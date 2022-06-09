require("dotenv").config()
const {Pool} = require('pg')
const {rows} = require("pg/lib/defaults");

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
        const address = queryParams.address
        const id = queryParams.id
        console.log("Querying: " + address + " id: " + id)

        const queryString = `
            SELECT id, link, vote_up_count, vote_down_count, competition_id, is_winner, winner_id
            FROM memes
            WHERE is_blocked = false
            AND id = $1
            LIMIT 1
        `
        const rowsMemesPromise = query(queryString, [id])
        const rowsMemes = (await rowsMemesPromise).rows

        if (rowsMemes.length === 0) {
            return;
        }

        let meme = rowsMemes[0]
        if(address) {
            console.log("Querying votes for address: " + address)
            const queryString = `SELECT meme_id, vote_up, vote_down FROM votes WHERE address = $1 AND meme_id =$2`
            const votes = (await query(queryString, [address, id])).rows
            console.log(votes)
            if(votes.length > 0) {
                meme["votedUp"] = votes[0].vote_up
                meme["votedDown"] = votes[0].vote_down
            }
        }

        console.log(JSON.stringify(meme))
        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": JSON.stringify({meme: meme}),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
