require("dotenv").config()
const { Pool } = require('pg')
const {recoverTypedSignature_v4 } = require('eth-sig-util');

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
        const body = event.body
        const signature = body.signature
        const params = body.params
        const email = params.message.email
        const address = recoverTypedSignature_v4({
            data: params,
            sig: signature,
        });
        console.log(address)
        console.log("Sending mail to " + email + " for address : " + address)
        const { rows } = await query("SELECT status FROM vote_users WHERE address=$1", [address])
        if (rows.length > 0) {
            return;
        }
        const code = Math.floor(Math.random()*90000000) + 10000000;
        console.log("Generated code: " + code + " for " + address)
        await query("INSERT INTO vote_users(address, email, activation_code, status) VALUES ($1, $2, $3, 'email_sent')", [address, email, code])
        //TODO: send email
        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type" : "application/json",
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": JSON.stringify({status: "OK"}),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
