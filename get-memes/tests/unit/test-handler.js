'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('verifies successful response', async () => {
        event = {
            queryStringParameters: {
                itemsPerPage: 2,
                pagesSkip: 1,
                competition: 1,
                address: '0x26ea8aaf2028ecb261e36b61e6a21b03bd229c77'
            }
        }
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);
        console.log(response)

        expect(response.memes).to.be.an('array');
    });
    it('verifies successful response without address', async () => {
        event = {
            queryStringParameters: {
                itemsPerPage: 2,
                pagesSkip: 1,
                competition: 1,
            }
        }
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);
        console.log(response)

        expect(response.memes).to.be.an('array');
    });
});
