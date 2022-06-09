require("dotenv").config()
const {Pool} = require('pg')
const {ethers} = require("ethers");
const deploy = require("./contracts/deploy.json");
const {NodeBundlr} = require("@bundlr-network/client/build/node");
const axios = require("axios");

var dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
};

const pool = new Pool(dbConfig)

let client;

async function query(query, value) {
    if (client === undefined) {
        await initializeDbClient()
    }
    let res
    try {
        res = await client.query(query, value)
    } catch (e) {
        console.log("Error querying")
        throw e
    }
    return res
}

const initializeDbClient = async () => {
    try {
        client = await pool.connect()
    } catch (e) {
        console.log("Error initializing client")
        throw e
    }
}


function getContract() {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/" + process.env.RPC_KEY);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return new ethers.Contract(
        deploy.contracts.MemeNFTOpen.address,
        deploy.contracts.MemeNFTOpen.abi,
        provider.getSigner()
    ).connect(wallet);
}

const getGasCost = async () => {
    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    try {
        const {data} = await axios({
            method: 'get',
            url: 'https://gasstation-mainnet.matic.network/v2'
        })
        maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        )
        maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        )
        const result = {maxFeePerGas: maxFeePerGas, maxPriorityFeePerGas: maxPriorityFeePerGas}
        console.log("Calculated gas ")
        console.log(result)
        return result
    } catch {
        console.log("Error in gas cost")
    }
}

const mint = async (address) => {
    const gas = await getGasCost()
    const tx = await contract.mint(address, {maxFeePerGas: gas.maxFeePerGas, maxPriorityFeePerGas: gas.maxPriorityFeePerGas})
    const result = await tx.wait()
    const tokenId = result.events.filter(_ => _.event === 'Transfer')[0].args.tokenId.toNumber()
    console.log("Minted tokenId " + tokenId)
    return tokenId
}

const setTokenURI = async (uri, tokenId) => {
    const gas = await getGasCost()
    const tx = await contract.setTokenURI(uri, tokenId, {maxFeePerGas: gas.maxFeePerGas, maxPriorityFeePerGas: gas.maxPriorityFeePerGas})
    await tx.wait()
}

let response;

const contract = getContract()

/** Fund 0.01 MATIC */
const fund = async () => {
    console.log((await bundlr.getLoadedBalance()).toNumber())
    await bundlr.fund(1e16);
}

const upload = async (data) => {
    const transaction = bundlr.createTransaction(data)
    await transaction.sign();
    const result = await transaction.upload();
    const hash = result.data.id
    console.log("Hash: " + hash)
    return hash
}

function getActiveCompetitionId() {
    return query("SELECT id from competitions WHERE now() > startdate AND now() < enddate").then(_ => {
        console.log(_.rows);
        if(_.rows.length == 0) {
            return ''
        } else {
            return _.rows[0].id
        }
    })
}

const bundlr = new NodeBundlr("http://node1.bundlr.network", "matic", process.env.PRIVATE_KEY);

exports.handler = async (event, context) => {
    try {
        const address = event.queryStringParameters.address.toLowerCase()
        console.log("Address " + address)
        console.log(event)
        console.log(context)

        const content = event.body.split('\r\n')[3]
        console.log(content)
        if(content === "undefined") {
            return
        }
        const contentArray = content.trim().split(",")

        console.log(contentArray)
        const memeHash = await upload(contentArray)
        const image = "https://arweave.net/" + memeHash

        const tokenId = await mint(address)

        const metadata = {
            image: image,
            openTokenId: tokenId
        }

        const metadataHash = await upload(JSON.stringify(metadata))
        const tokenUri = "https://arweave.net/" + metadataHash

        await setTokenURI(tokenUri, tokenId)


        const competitionId = await getActiveCompetitionId()
        const queryString = "INSERT INTO memes(id, link, vote_up_count, vote_down_count, vote_result, is_blocked, competition_id, is_winner, winner_id, owner_address) VALUES ($1, $2, 0, 0, 0, false, $3, false, null, $4)"
        await query(queryString, [tokenId, image, competitionId, address])

        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": JSON.stringify(["OK"]),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
