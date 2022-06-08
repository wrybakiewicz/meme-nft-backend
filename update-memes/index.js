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

async function updateOwners() {
    return query("SELECT id, owner_address FROM memes").then(_ => {
        const idOwnerAddresses = _.rows
        console.log(idOwnerAddresses)
        const updateOwnerPromiseList = idOwnerAddresses.map(_ => updateOwner(_.id, _.owner_address))
        return Promise.all(updateOwnerPromiseList)
    })
}

function updateOwner(id, ownerAddressInDb) {
    return contract.ownerOf(id).then(owner => {
        const ownerLowerCase = owner.toLowerCase()
        if (ownerLowerCase !== ownerAddressInDb) {
            return query("UPDATE memes SET owner_address =$1 WHERE id = $2", [ownerLowerCase, id])
        }
    })
}

let response;

const contract = getContract()

exports.handler = async (event, context) => {
    try {
        await updateOwners()

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
