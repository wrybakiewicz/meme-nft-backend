require("dotenv").config()
const { Pool } = require('pg')
const {ethers} = require("ethers");
const deploy = require("./contracts/deploy.json");

var dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
};

const pool = new Pool(dbConfig)

let client;

async function query(query, value) {
    if(client === undefined) {
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
    return new ethers.Contract(
        deploy.contracts.MemeNFTOpen.address,
        deploy.contracts.MemeNFTOpen.abi,
        provider
    );
}

function getTotalSupply() {
    console.log("Querying total supply from smart contract")
    return contract.totalSupply().then(_ => {
        const totalSupply = _.toNumber()
        console.log("Total supply: " + totalSupply)
        return totalSupply
    })
}

function getLastSavedId() {
    console.log("Querying last saved id from DB")
    return query("select MAX(id) from memes").then(_ => {
        const lastSavedId = _.rows[0].max
        console.log("Last saved id: " + lastSavedId)
        return lastSavedId
    })
}

function getIdsToSave(totalSupply, lastSavedId) {
    const firstIdToFetch = lastSavedId + 1
    const lastIdToFetch = totalSupply
    const result = []
    for(i = firstIdToFetch; i<=lastIdToFetch; i++) {
        result.push(i)
    }
    return result
}

function fetchAndSave(id) {
    console.log("Fetching: " + id)
    return contract.tokenURI(id)
        .then(url => {
            return query(`INSERT INTO memes VALUES (${id}, '', '${url}', 0, 0, 0, false)`)
        })
}

function getActiveCompetitionId() {
    return query("SELECT id from competitions WHERE now() > startdate AND now() < enddate").then(_ => {
        console.log(_.rows);
        if(_.rows.length == 0) {
            return undefined
        } else {
            return _.rows[0].id
        }
    })

}

let response;

const contract = getContract()

//TODO: if there is no competition create one (with increased number)
//TODO: assign memes to competition

exports.handler = async (event, context) => {
    try {
        const totalSupplyPromise = getTotalSupply()
        const lastSavedIdPromise = getLastSavedId()
        const activeCompetitionIdPromise = getActiveCompetitionId()

        const totalSupply = await totalSupplyPromise
        const lastSavedId = await lastSavedIdPromise
        const activeCompetitionId = await activeCompetitionIdPromise
        console.log(activeCompetitionId)

        if(totalSupply > lastSavedId) {
            console.log("Updating memes in DB")
            const idsToFetch = getIdsToSave(totalSupply, lastSavedId)
            console.log("IDs to fetch: " + idsToFetch)
            await Promise.all(idsToFetch.map(id => fetchAndSave(id)))
        } else {
            console.log("No need to update memes in DB")
        }

        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type" : "application/json"
            },
            "body": JSON.stringify(["OK"]),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
