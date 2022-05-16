require("dotenv").config()
const { Pool } = require('pg')

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
        console.log("Activating account")
        console.log(event)
        const email = event.email
        const activationCode = event.activationCode
        console.log("Activating: " + email + " with code : " + activationCode)

        const { rows } = await query("SELECT activation_code FROM vote_users WHERE email=$1 AND status != 'activated'", [email])
        if (rows.length === 0) {
            console.log("Not found or activated")
            return;
        }
        const realActivationCode = rows[0].activation_code

        if(realActivationCode.toString() === activationCode.toString()) {
            console.log("Activating: " + email)
            await query("UPDATE vote_users SET status = 'activated' WHERE email=$1 AND status != 'activated'", [email])
        } else {
            console.log("Not activated")
            console.log(realActivationCode.toString())
            console.log(activationCode.toString())
        }

        response = {
            "statusCode": 200,
            "headers": {
                "Content-Type" : "application/json",
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
            },
            "body": JSON.stringify({status: "OK"}),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
