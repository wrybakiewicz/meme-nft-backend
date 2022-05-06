'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('send email', async () => {
        event = {
            body:
                {
                    "signature": "0xbb27b0edc3b0ff89b35c4b81da34f77c086926409ea11e138e3eda342669a0080f34b1da33000fe8b921312450cab138ed9d096f6f15164f61566ccb381b6f831c",
                    "params": {
                        "domain": {
                            "chainId": 80001,
                            "name": "Meme NFT",
                            "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
                            "version": "1"
                        },
                        "message": {"email": "guziec96@gmail.com"},
                        "primaryType": "Mail",
                        "types": {"Mail": [{"name": "email", "type": "string"}]}
                    }
                }
        }
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        const response = JSON.parse(result.body);
        expect(response.status).to.equal('OK');
    });
});
