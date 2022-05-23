'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('verifies activated', async () => {
        event = {pathParameters: {
                address: "0x9B424f755831575446313cdE6A97eA5bc69B30A6"
            }}
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        const response = JSON.parse(result.body);
        expect(response.competitions).to.be.an('array');
    });
});
