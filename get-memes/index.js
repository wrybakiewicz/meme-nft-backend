require("dotenv").config()
const {Pool} = require('pg')
const {rows} = require("pg/lib/defaults");

var dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
};

const pool = new Pool(dbConfig)

async function query(query, value) {
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
        console.log(event)
        const queryParams = event.queryStringParameters
        const itemsPerPage = queryParams.itemsPerPage
        const pagesSkip = queryParams.pagesSkip
        console.log("Querying: " + itemsPerPage + " skip: " + pagesSkip)
        const queryString = `
            SELECT id, title, link, vote_up_count, vote_down_count
            FROM memes
            WHERE is_blocked = false
            ORDER BY vote_result DESC 
            LIMIT $1
            OFFSET $2
        `
        const rowsMemesPromise = query(queryString, [itemsPerPage, pagesSkip * itemsPerPage])
        const totalMemesPromise = query('SELECT COUNT(*) FROM memes WHERE is_blocked = false')

        const rowsMemes = (await rowsMemesPromise).rows
        const total = (await totalMemesPromise).rows[0].count
        console.log(JSON.stringify(rowsMemes))
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
            "body": JSON.stringify({memes: rowsMemes, totalPages: totalPages}),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
