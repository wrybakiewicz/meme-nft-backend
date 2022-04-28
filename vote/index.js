require("dotenv").config()
const { Pool } = require('pg')

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

let response;

exports.handler = async (event, context) => {
    try {
        const body = event.body
        const vote = body.vote

        if(vote === 'up') {
            console.log("Vote up")
        } else if(vote === 'down') {
            console.log("Vote down")
        } else {
            console.log("Invalid vote")
        }

        const signature = body.signature

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
