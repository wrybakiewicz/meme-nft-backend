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
        const address = event.pathParameters.address.toLowerCase()
        console.log("Querying for: " + address)
        const { rows } = await query("SELECT status FROM vote_users WHERE address=$1", [address])
        let status
        if (rows.length > 0) {
            status = rows[0].status
        } else {
            status = "notRegistered"
        }
        console.log(JSON.stringify(rows))
        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type" : "application/json",
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": JSON.stringify({status: status}),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
