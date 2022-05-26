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
                competition: 5
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
