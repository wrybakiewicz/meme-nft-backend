require("dotenv").config()
const { Pool } = require('pg')
const {recoverTypedSignature_v4 } = require('eth-sig-util');

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


let response;

exports.handler = async (event, context) => {
    try {
        console.log("Received request")
        console.log(event)
        const body = JSON.parse(event.body)
        const signature = body.signature
        const params = JSON.parse(body.params)
        const vote = params.message.vote
        const memeId = params.message.memeId
        const address = recoverTypedSignature_v4({
            data: params,
            sig: signature,
        });

        console.log(address)
        console.log(vote)
        console.log(memeId)

        if(vote === 'UP') {
            console.log("Vote up")
        } else if(vote === 'DOWN') {
            console.log("Vote down")
        } else {
            console.log("Invalid vote")
        }

        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type" : "application/json"
            },
            "body": "[]",
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
