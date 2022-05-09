require("dotenv").config()
const { Pool } = require('pg')

var dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
};

const pool = new Pool(dbConfig)

async function query (query, value) {
    let client;
    try {
        client = await pool.connect()

    } catch (e) {
        throw e
    }
    let res
    try {
        try {
            res = await client.query(query, value)
        } catch (err) {
            console.error(err)
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
        console.log("Activating account")
        console.log(event)
        const body = JSON.parse(event.body)
        const email = body.email
        const activationCode = body.activationCode
        console.log("Activating: " + email + " with code : " + activationCode)

        const { rows } = await query("SELECT activation_code FROM vote_users WHERE email=$1 AND status != 'activated'", [email])
        if (rows.length === 0) {
            console.log("Not found or activated")
            return;
        }
        const realActivationCode = rows[0].activation_code

        if(realActivationCode === activationCode.toString()) {
            console.log("Activating: " + email)
            await query("UPDATE vote_users SET status = 'activated' WHERE email=$1 AND status != 'activated'", [email])
        }

        response = {
            'statusCode': 200,
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
