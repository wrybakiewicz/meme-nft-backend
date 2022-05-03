'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('send email', async () => {
        event = {body: `
        {
        "email": "email",
        "address": "address"
        }`}
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        const response = JSON.parse(result.body);
        expect(response.status).to.equal('OK');
    });

    it('not send email', async () => {
        event = {body: `
        {
        "email": "email",
        "address": "0x9b424f755831575446313cde6a97ea5bc69b30a6"
        }`}
        const result = await app.handler(event, context)

        expect(result).to.be.equal(undefined);
    });
});
