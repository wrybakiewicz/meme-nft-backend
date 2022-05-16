require("dotenv").config()
const { Pool } = require('pg')
const {recoverTypedSignature_v4 } = require('eth-sig-util');

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
        console.log("Received request")
        console.log(event)
        const body = JSON.parse(event.body)
        const signature = body.signature
        const params = JSON.parse(body.params)
        const vote = params.message.vote
        const memeId = params.message.memeId
        const address = recoverTypedSignature_v4({
            data: params,
            sig: signature,
        });

        console.log(address)
        console.log(vote)
        console.log(memeId)

        let result = "INVALID";

        if(vote === 'UP' || vote === 'DOWN') {
            console.log("Vote: " + vote)
            const isUserActive = await query(`SELECT address FROM vote_users WHERE status = 'activated' AND address =$1`, [address])
            console.log("Users found: " + isUserActive.rows.length)
            if(isUserActive.rows.length > 0) {
                const isUserVoted = await query(`SELECT address FROM votes WHERE address = $1 AND meme_id = $2`, [address, memeId])
                console.log("User voted: " + isUserVoted.rows.length)
                if(isUserVoted.rows.length) {
                    result = "OK"
                    const updateQuery = `UPDATE votes SET vote_up = $1, vote_down=$2 WHERE address = $3 AND meme_id = $4`
                    if(vote === 'UP') {
                        console.log("UPDATE UP")
                        await query(updateQuery, [true, false, address, memeId])
                    } else {
                        console.log("UPDATE DOWN")
                        await query(updateQuery, [false, true, address, memeId])
                    }
                } else {
                    result = "OK"
                    const insertQuery = "INSERT INTO votes(address, meme_id, vote_up, vote_down) VALUES ($1, $2, $3, $4)"
                    let voteUp = false
                    let voteDown = false
                    if(vote === 'UP') {
                        console.log("INSERT UP")
                        voteUp = true
                    } else {
                        console.log("INSERT DOWN")
                        voteDown = true
                    }
                    await query(insertQuery, [address, memeId, voteUp, voteDown])
                }
            } else {
                console.log("User not active")
            }
        } else {
            console.log("Invalid vote")
        }

        if(result === "OK") {
            const upVoteCountPromise = query(`SELECT COUNT(*) FROM votes WHERE meme_id = $1 AND vote_up = true`, [memeId])
            const downVoteCountPromise = query(`SELECT COUNT(*) FROM votes WHERE meme_id = $1 AND vote_down = true`, [memeId])
            const upVoteCount = (await upVoteCountPromise).rows[0].count
            const downVoteCount = (await downVoteCountPromise).rows[0].count
            const result = upVoteCount - downVoteCount
            console.log(upVoteCount)
            console.log(downVoteCount)
            console.log(result)
            await query(`UPDATE memes SET vote_up_count = $1, vote_down_count = $2, vote_result = $3 WHERE id = $4`, [upVoteCount, downVoteCount, result, memeId])
        }

        response = {
            'statusCode': 200,
            "headers": {
                "Content-Type" : "application/json",
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
            },
            "body": JSON.stringify({result: result}),
        }
        return response
    } catch (err) {
        console.log(err);
        throw err;
    }
};
