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
                    "signature": "0xc9c44197ec1a8a6cd9ad5951c777bc7216febba5725d3d6de8fb90f33604fc7751ee8c08b904983ae76518fdf5feeb7510c1057eccd5d9cb31c901d9af2484281b",
                    "params": {
                        "domain": {
                            "chainId": 80001,
                            "name": "Meme NFT",
                            "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
                            "version": "1"
                        },
                        "message": {"email": "abc"},
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

    it('not send email', async () => {
        event = {
            body:
                {
                    "signature": "0xc9c44197ec1a8a6cd9ad5951c777bc7216febba5725d3d6de8fb91f33604fc7751ee8c08b904983ae76518fdf5feeb7510c1057eccd5d9cb31c901d9af2484281b",
                    "params": {
                        "domain": {
                            "chainId": 80001,
                            "name": "Meme NFT",
                            "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
                            "version": "1"
                        },
                        "message": {"email": "xyxx"},
                        "primaryType": "Mail",
                        "types": {"Mail": [{"name": "email", "type": "string"}]}
                    }
                }
        }
        const result = await app.handler(event, context)

        expect(result).to.be.equal(undefined);
    });
});
