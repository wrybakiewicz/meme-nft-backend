require("dotenv").config()
const {Pool} = require('pg')

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
        console.log(event)
        const queryParams = event.queryStringParameters
        const address = queryParams.address.toLowerCase()
        console.log("Querying for address: " + address)

        const queryString = `
            SELECT id, link, vote_up_count, vote_down_count, is_winner, winner_id, owner_address, competition_id
            FROM memes
            WHERE is_blocked = false
            AND owner_address = $1
        `
        const rowsMemes = (await query(queryString, [address])).rows

        console.log(JSON.stringify(rowsMemes))
        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": JSON.stringify({memes: rowsMemes}),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
