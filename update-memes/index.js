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

async function query (q) {
    let client;
    try {
        client = await pool.connect()
    } catch (e) {
        console.error("Error connecting to pool: " + e)
        throw e
    }
    let res
    try {
        try {
            res = await client.query(q)
        } catch (err) {
            console.error("Error querying " + err)
            throw err
        }
    } catch (e) {
        throw e
    } finally {
        client.end()
    }
    return res
}

function getContract() {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/" + process.env.RPC_KEY);
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

let response;

const contract = getContract()

exports.handler = async (event, context) => {
    try {
        const totalSupplyPromise = getTotalSupply()
        const lastSavedIdPromise = getLastSavedId()

        const totalSupply = await totalSupplyPromise
        const lastSavedId = await lastSavedIdPromise

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
