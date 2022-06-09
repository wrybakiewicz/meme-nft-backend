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
        const itemsPerPage = queryParams.itemsPerPage
        const pagesSkip = queryParams.pagesSkip
        const competition = queryParams.competition
        const address = queryParams.address
        console.log("Querying: " + itemsPerPage + " skip: " + pagesSkip + " competition: " + competition + " address: " + address)

        const queryString = `
            SELECT id, link, vote_up_count, vote_down_count, is_winner, winner_id
            FROM memes
            WHERE is_blocked = false
            AND competition_id = $3
            ORDER BY vote_result DESC 
            LIMIT $1
            OFFSET $2
        `
        const rowsMemesPromise = query(queryString, [itemsPerPage, pagesSkip * itemsPerPage, competition])
        const totalMemesPromise = query('SELECT COUNT(*) FROM memes WHERE is_blocked = false AND competition_id = $1', [competition])

        const rowsMemes = (await rowsMemesPromise).rows
        const total = (await totalMemesPromise).rows[0].count

        let memes = rowsMemes
        if(address && rowsMemes.length > 0) {
            console.log("Querying votes for address: " + address)
            const memeIds = rowsMemes.map(_ => _.id).join(",")
            console.log(memeIds)
            const queryString = `SELECT meme_id, vote_up, vote_down FROM votes WHERE address = $1 AND meme_id IN (${memeIds})`
            const votes = (await query(queryString, [address])).rows
            console.log(votes)
            memes = rowsMemes.map(meme => {
                const vote = votes.filter(vote => vote.meme_id === meme.id)
                if(vote.length > 0) {
                    meme["votedUp"] = vote[0].vote_up
                    meme["votedDown"] = vote[0].vote_down
                }
                return meme
            })
        }

        console.log(JSON.stringify(memes))
        console.log(total)
        const totalPages = Math.ceil((1.0 * total) / itemsPerPage)
        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": JSON.stringify({memes: memes, totalPages: totalPages}),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
