'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('send email', async () => {
        event = {
            body:
                '{"email": "guziec96@gmail.com", "activationCode": 22584453}'
        }
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        const response = JSON.parse(result.body);
        expect(response.status).to.equal('OK');
    });
});
