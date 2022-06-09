require("dotenv").config()
const {Pool} = require('pg')
const {ethers} = require("ethers");
const deploy = require("./contracts/deploy.json");
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
        deploy.contracts.MemeNFTWinner.address,
        deploy.contracts.MemeNFTWinner.abi,
        provider.getSigner()
    ).connect(wallet);
}

const getTotalSupply = async () => {
    return await contract.totalSupply().then(_ => _.toNumber())
}

const getOpenTokenId = async (tokenId) => {
    const uri = await contract.tokenURI(tokenId).then(_ => {
        console.log("Found URI for token: " + tokenId)
        console.log(_)
        return _
    })
    const openTokenId = await axios.get(uri).then(_ => _.data.openTokenId)
    console.log(openTokenId)
    return openTokenId
}

const getOwnerOf = (tokenId) => {
    return contract.ownerOf(tokenId)
}

let response;

const contract = getContract()

exports.handler = async (event, context) => {
    try {

        const potentialWinnerIdsPromise = query("SELECT id FROM memes WHERE is_winner = true AND winner_id IS NULL").then(_ => _.rows.map(_ => _.id))
        const totalSupplyPromise = getTotalSupply()

        const potentialWinnerIds = await potentialWinnerIdsPromise
        const totalSupply = await totalSupplyPromise

        console.log(potentialWinnerIds)
        console.log(totalSupply)

        let currentTokenId = totalSupply
        let potentialWinnerIdsFiltered = potentialWinnerIds

        while(true) {
            if(currentTokenId > 0 && potentialWinnerIdsFiltered.length > 0) {
                console.log("Querying for token: " + currentTokenId)
                const openTokenId = await getOpenTokenId(currentTokenId)
                if(potentialWinnerIdsFiltered.includes(openTokenId)) {
                    console.log("Includes!: " + openTokenId)
                    const owner = (await getOwnerOf(currentTokenId)).toLowerCase()
                    console.log(owner)
                    potentialWinnerIdsFiltered = potentialWinnerIdsFiltered.filter(_ => _ !== openTokenId)
                    await query("UPDATE memes SET winner_id = $1, owner_address = $2 WHERE id = $3", [currentTokenId, owner, openTokenId])
                }
                currentTokenId -= 1
            } else {
                break
            }
        }

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
