'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('send email', async () => {
        event = {
            body:
                '{"signature":"0x9910784859ad1a45cd83e921ec07692cdd550544089fa7cd980117a2570190861ae925837c698921beb6d2dd6f63484ef9894c252a702ca898a85b1ffd60b1c71c","params":"{\\"domain\\":{\\"chainId\\":80001,\\"name\\":\\"Meme NFT\\",\\"verifyingContract\\":\\"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC\\",\\"version\\":\\"1\\"},\\"message\\":{\\"email\\":\\"guz.iec96@gmail.com\\"},\\"primaryType\\":\\"Mail\\",\\"types\\":{\\"Mail\\":[{\\"name\\":\\"email\\",\\"type\\":\\"string\\"}]}}"}'
        }
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        const response = JSON.parse(result.body);
        expect(response.status).to.equal('OK');
    });
});
