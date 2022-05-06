require("dotenv").config()
const { Pool } = require('pg')
const {recoverTypedSignature_v4 } = require('eth-sig-util');
const nodemailer = require("nodemailer");

var dbConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
};

const pool = new Pool(dbConfig)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
});

transporter.verify().then(console.log).catch(console.error);

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
            console.log("FOUND existing email")
            return;
        }
        if(!validateEmail(email)) {
            console.log("Invalid email: " + email)
            return;
        }
        const code = Math.floor(Math.random()*90000000) + 10000000;
        console.log("Generated code: " + code + " for " + address)
        await query("INSERT INTO vote_users(address, email, activation_code, status) VALUES ($1, $2, $3, 'email_sent')", [address, email, code])

        const sendEmailResult = await transporter.sendMail({
            from: '"Meme NFT" <memenftss@gmail.com>',
            to: email,
            subject: "Activation code for MemeNFT",
            html: `<div>Your activation code is <b>${code}</b></div>`
        }).then(info => {
            console.log("Send email result: ")
            console.log({info});
        }).catch(console.error);

        console.log(sendEmailResult)

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


function validateEmail(email)
{
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
