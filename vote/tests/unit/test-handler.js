'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('verifies UP successful response', async () => {
        event = {
            body: '{"signature":"0x5bf70d2c6ee2d5ec9c657e2850e0e9bcc8713db892dc0db45c2f188951d88dec76d5f9668c3cc6da6088a05e34c48741a26cbbced2dd8e3e05af5c329a04f0441c","params":"{\\"domain\\":{\\"chainId\\":137,\\"name\\":\\"Meme NFT\\",\\"verifyingContract\\":\\"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC\\",\\"version\\":\\"1\\"},\\"message\\":{\\"vote\\":\\"UP\\",\\"memeId\\":2},\\"primaryType\\":\\"Vote\\",\\"types\\":{\\"Vote\\":[{\\"name\\":\\"vote\\",\\"type\\":\\"string\\"},{\\"name\\":\\"memeId\\",\\"type\\":\\"string\\"}]}}"}'
        }
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('array');
    });
    it('verifies DOWN successful response', async () => {
        event = {
            body: '{"signature":"0x7b34437daca60ed658f74e0f64996d61910f843dcdcd925315d5fb512775ac85494b85739a869b9db27583f1b90bfb05d6dbdc1eef34cebfc6508b03d39528391b","params":"{\\"domain\\":{\\"chainId\\":137,\\"name\\":\\"Meme NFT\\",\\"verifyingContract\\":\\"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC\\",\\"version\\":\\"1\\"},\\"message\\":{\\"vote\\":\\"DOWN\\",\\"memeId\\":2},\\"primaryType\\":\\"Vote\\",\\"types\\":{\\"Vote\\":[{\\"name\\":\\"vote\\",\\"type\\":\\"string\\"},{\\"name\\":\\"memeId\\",\\"type\\":\\"string\\"}]}}"}'
        }
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('array');
    });
});
