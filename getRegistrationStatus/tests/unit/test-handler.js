'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('verifies activated', async () => {
        event = {pathParameters: {
                address: "address1"
            }}
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body.status).to.equal('activated');
    });

    it('verifies notRegistered', async () => {
        event = {pathParameters: {
                address: "notExist"
            }}
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body.status).to.equal('notRegistered');
    });
});
