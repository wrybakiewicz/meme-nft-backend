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
        throw e
    }
    let res
    try {
        try {
            res = await client.query(q)
        } catch (err) {
            console.err(err)
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
        const { rows } = await query("select * from memes")
        console.log(JSON.stringify(rows))
        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type" : "application/json"
            },
            "body": JSON.stringify(rows),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
