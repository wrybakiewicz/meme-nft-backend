'use strict';

const app = require('../../index.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests mint', function () {
    it('verify mint', async () => {
        event = {
            resource: '/mint',
            path: '/mint',
            httpMethod: 'POST',
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryBqvyVclcFjgNDtps',
                Host: 'ibn51vomli.execute-api.eu-central-1.amazonaws.com',
                origin: 'http://localhost:3000',
                referer: 'http://localhost:3000/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'sec-gpc': '1',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                'X-Amzn-Trace-Id': 'Root=1-62a0c026-6535dc2a0141c0ad58d3585b',
                'X-Forwarded-For': '79.184.101.22',
                'X-Forwarded-Port': '443',
                'X-Forwarded-Proto': 'https'
            },
            multiValueHeaders: {
                accept: [ 'application/json, text/plain, */*' ],
                'accept-encoding': [ 'gzip, deflate, br' ],
                'accept-language': [ 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7' ],
                'content-type': [
                    'multipart/form-data; boundary=----WebKitFormBoundaryBqvyVclcFjgNDtps'
                ],
                Host: [ 'ibn51vomli.execute-api.eu-central-1.amazonaws.com' ],
                origin: [ 'http://localhost:3000' ],
                referer: [ 'http://localhost:3000/' ],
                'sec-fetch-dest': [ 'empty' ],
                'sec-fetch-mode': [ 'cors' ],
                'sec-fetch-site': [ 'cross-site' ],
                'sec-gpc': [ '1' ],
                'User-Agent': [
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
                ],
                'X-Amzn-Trace-Id': [ 'Root=1-62a0c026-6535dc2a0141c0ad58d3585b' ],
                'X-Forwarded-For': [ '79.184.101.22' ],
                'X-Forwarded-Port': [ '443' ],
                'X-Forwarded-Proto': [ 'https' ]
            },
            multiValueQueryStringParameters: null,
            queryStringParameters: {
                address: "0x26ea8aaf2028ecb261e36b61e6a21b03bd229c77"
            },
            stageVariables: null,
            requestContext: {
                resourceId: 'hg0fn6',
                resourcePath: '/mint',
                httpMethod: 'POST',
                extendedRequestId: 'TaL2HEUyliAFhbw=',
                requestTime: '08/Jun/2022:15:28:38 +0000',
                path: '/prod/mint',
                accountId: '966408459255',
                protocol: 'HTTP/1.1',
                stage: 'prod',
                domainPrefix: 'ibn51vomli',
                requestTimeEpoch: 1654702118918,
                requestId: 'e435544e-22e3-4db9-a082-3b0089f95a7d',
                identity: {
                    cognitoIdentityPoolId: null,
                    accountId: null,
                    cognitoIdentityId: null,
                    caller: null,
                    sourceIp: '79.184.101.22',
                    principalOrgId: null,
                    accessKey: null,
                    cognitoAuthenticationType: null,
                    cognitoAuthenticationProvider: null,
                    userArn: null,
                    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                    user: null
                },
                domainName: 'ibn51vomli.execute-api.eu-central-1.amazonaws.com',
                apiId: 'ibn51vomli'
            },
            body: '------WebKitFormBoundaryBqvyVclcFjgNDtps\r\n' +
                'Content-Disposition: form-data; name="data"\r\n' +
                '\r\n' +
                '-1,-40,-1,-32,0,16,74,70,73,70,0,1,1,1,0,72,0,72,0,0,-1,-37,0,67,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-37,0,67,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-64,0,17,8,0,-22,1,57,3,1,34,0,2,17,1,3,17,1,-1,-60,0,23,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,-1,-60,0,36,16,1,1,1,0,2,1,4,3,1,1,1,1,0,0,0,0,0,1,17,33,49,65,2,18,81,113,97,-127,-111,-79,-95,-63,-16,-1,-60,0,21,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,-1,-60,0,22,17,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,1,-1,-38,0,12,3,1,0,2,17,3,17,0,63,0,-54,-30,47,32,-118,-126,13,96,67,0,-96,-77,-127,83,48,-25,110,-75,-22,99,65,-87,62,23,51,18,86,-88,49,101,-44,93,60,-14,8,-68,126,86,-49,49,-99,6,-72,-87,-122,-44,-34,1,120,54,102,50,-128,-42,-102,-118,13,65,-103,113,-83,-33,-96,23,-92,-14,1,111,-16,-121,-73,124,-89,64,-42,-90,-4,-77,-72,104,47,-89,-117,86,-34,117,22,-64,39,-86,93,-44,-73,83,59,1,102,-33,-108,-77,3,-112,67,23,-4,94,-65,98,50,-65,-92,0,-59,64,5,13,3,-90,-91,97,-88,10,-109,-67,-90,-2,63,105,-32,26,-74,124,48,-46,96,-94,-51,92,-13,75,-96,113,63,53,62,-111,96,45,-11,112,-100,89,-33,37,-107,51,-26,-127,98,47,-46,-39,-104,34,2,-55,-40,39,30,67,-37,91,-49,-102,-86,-26,-36,-12,-33,-91,4,48,-56,0,-68,37,-101,-46,40,57,-30,-29,86,107,50,-27,21,86,95,-108,-49,-36,61,-65,-3,80,90,-74,108,103,-103,-59,60,118,7,-8,-106,114,-70,-73,-112,72,94,76,-7,-14,116,8,7,-16,68,5,81,5,0,53,12,5,-107,81,-84,-88,37,69,-88,14,-101,49,-98,-45,-20,-71,-32,85,-29,-27,113,-123,-36,-128,-74,-1,0,-116,-30,-58,-92,-128,-52,45,-73,-122,-67,-79,120,-118,-116,-55,126,-65,-42,-70,64,21,0,16,23,1,5,-60,0,0,18,-51,80,25,116,-19,-106,54,-118,-35,-101,-25,-90,22,94,-41,113,4,-115,102,33,109,-65,64,-67,-61,-35,39,-124,-105,-8,-104,13,110,-8,103,9,23,2,50,2,-94,-1,0,-22,47,-62,1,-115,125,36,106,116,-118,-51,107,111,76,-46,2,-126,2,-120,-44,-12,-16,12,-115,101,-23,114,65,9,20,-47,68,0,5,-60,80,16,1,99,62,-85,103,75,-85,121,7,61,-65,43,125,95,16,-59,-39,0,23,-76,0,92,64,11,52,1,-100,-80,-110,-7,110,37,-68,-94,-90,39,-38,-77,-99,-125,115,44,99,-107,-100,30,0,-19,49,-82,47,-31,115,-20,25,56,66,-120,-69,-87,-46,-55,-28,-24,85,-100,-106,95,11,-62,-125,-99,-32,91,-51,80,67,-74,-109,52,9,-7,116,102,73,62,-51,84,93,68,80,1,65,12,9,116,11,100,79,119,61,22,121,-124,-12,-32,52,-54,-37,35,50,-126,-101,-99,-117,103,0,-84,-5,99,60,-61,104,55,-78,51,-18,100,5,-37,-32,-117,12,1,64,2,-51,85,6,51,-113,-54,-6,103,122,-68,69,-44,83,35,57,60,52,116,35,22,30,-22,-74,-90,-118,29,21,52,26,-46,-29,26,42,55,-60,53,4,84,36,-33,42,-78,2,-56,-88,-118,-128,0,42,0,-46,36,-66,63,-115,2,39,-26,40,11,-84,-6,-83,58,-25,-6,-96,-26,-79,108,-54,0,-106,-43,0,-122,18,40,38,40,-96,-126,-77,-18,-8,6,-114,35,27,64,95,114,91,104,2,26,47,8,-72,-73,-43,-8,79,119,-32,-40,1,109,-87,-54,-44,81,-86,-49,-37,76,-44,12,9,-86,-96,77,22,68,22,79,53,85,21,16,0,0,1,80,2,-14,75,-30,-121,96,-46,43,19,-99,6,-85,59,103,73,116,-128,-115,38,40,0,-72,2,-31,-60,-19,-101,65,-82,35,62,-17,-114,16,0,0,0,0,16,5,-78,-9,-120,-74,-48,72,11,38,-94,-110,-4,-75,-6,-65,-62,122,126,107,89,1,-56,5,6,-72,-84,-128,-47,-87,41,121,-88,53,-86,-50,42,-96,0,0,0,76,14,-63,-92,103,106,93,-67,-126,-37,-30,127,82,0,45,69,0,82,66,-39,1,89,-66,-81,-124,-74,-48,0,0,0,0,64,81,0,0,0,1,70,-26,-8,102,77,116,-4,64,63,-22,-91,-39,56,-16,-57,-65,-16,34,6,124,-120,-85,-63,-109,-32,-119,-96,37,-30,-117,-40,26,-87,-97,-22,-86,40,64,0,1,21,0,17,-92,4,85,48,5,-5,77,-111,-99,-48,91,126,16,0,0,1,20,4,0,84,0,0,0,0,17,86,73,124,-126,-49,-8,-34,-55,53,-116,-66,57,46,-15,-64,-83,-22,100,-8,79,87,76,109,-7,-96,-70,-84,-104,-126,-90,44,1,50,-128,-88,52,-53,80,5,64,21,23,-62,0,0,2,-128,66,-33,-124,-73,80,0,0,4,5,64,0,0,0,0,16,20,64,5,64,5,-44,80,107,83,-36,99,40,-83,-37,62,124,51,-64,-72,-94,-29,54,53,122,78,16,103,-106,-76,-42,84,106,-40,-128,34,-128,10,34,-128,-88,2,-127,-72,11,-45,22,-23,-40,8,-96,2,0,0,0,0,0,0,-118,88,8,11,-48,32,0,0,2,-30,0,-48,-118,-118,-125,75,-128,-51,66,-84,-72,-95,-103,54,-97,-110,-35,68,23,116,-103,-27,-107,84,91,-119,-89,32,-85,-64,-117,-105,-31,17,68,85,13,101,80,5,16,0,0,0,0,0,4,5,69,92,-128,-54,-23,96,2,-96,-118,-108,95,8,-88,-69,4,-128,47,102,26,-128,-66,34,-21,42,10,-69,-7,100,69,21,58,77,81,-72,-105,-16,72,-77,-114,-112,97,98,-31,115,-62,-95,-122,43,54,34,-102,-70,-117,1,26,47,72,10,-53,76,-43,64,0,0,0,0,21,13,21,113,48,64,93,65,-96,34,-95,-88,42,18,-128,-51,20,84,65,64,48,-58,-124,-85,25,26,100,64,15,-22,-118,-117,14,47,-38,9,-90,-45,17,69,86,90,-47,85,42,74,32,-95,19,-96,106,50,0,-80,-88,-86,-120,-94,0,8,2,-94,-126,42,2,-88,-94,8,52,-108,17,110,32,-88,0,0,2,-115,70,87,-10,-126,-85,31,-74,-63,45,101,106,0,2,-96,0,8,-86,12,-88,0,30,74,-118,-87,-33,-39,11,-40,10,-117,58,81,60,-84,64,69,64,4,88,0,-72,98,-126,-77,66,-10,1,-90,-94,-126,-23,-31,60,30,17,1,69,4,80,4,10,2,40,2,-19,34,124,-128,42,0,0,63,-1,-39\r\n' +
                '------WebKitFormBoundaryBqvyVclcFjgNDtps--\r\n',
            isBase64Encoded: false
        }
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('array');
    });

    it('verify mint empty file', async () => {
        event = {
            resource: '/mint',
            path: '/mint',
            httpMethod: 'POST',
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryANYmLYXqynOAfdQw',
                Host: 'ibn51vomli.execute-api.eu-central-1.amazonaws.com',
                origin: 'http://localhost:3000',
                referer: 'http://localhost:3000/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'sec-gpc': '1',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                'X-Amzn-Trace-Id': 'Root=1-62a1fc5b-57bc85ef697d92456be184da',
                'X-Forwarded-For': '79.184.101.22',
                'X-Forwarded-Port': '443',
                'X-Forwarded-Proto': 'https'
            },
            multiValueHeaders: {
                accept: [ 'application/json, text/plain, */*' ],
                'accept-encoding': [ 'gzip, deflate, br' ],
                'accept-language': [ 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7' ],
                'content-type': [
                    'multipart/form-data; boundary=----WebKitFormBoundaryANYmLYXqynOAfdQw'
                ],
                Host: [ 'ibn51vomli.execute-api.eu-central-1.amazonaws.com' ],
                origin: [ 'http://localhost:3000' ],
                referer: [ 'http://localhost:3000/' ],
                'sec-fetch-dest': [ 'empty' ],
                'sec-fetch-mode': [ 'cors' ],
                'sec-fetch-site': [ 'cross-site' ],
                'sec-gpc': [ '1' ],
                'User-Agent': [
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
                ],
                'X-Amzn-Trace-Id': [ 'Root=1-62a1fc5b-57bc85ef697d92456be184da' ],
                'X-Forwarded-For': [ '79.184.101.22' ],
                'X-Forwarded-Port': [ '443' ],
                'X-Forwarded-Proto': [ 'https' ]
            },
            queryStringParameters: { address: '0x26ea8aaf2028ecb261e36b61e6a21b03bd229c77' },
            multiValueQueryStringParameters: { address: [ '0x26ea8aaf2028ecb261e36b61e6a21b03bd229c77' ] },
            pathParameters: null,
            stageVariables: null,
            requestContext: {
                resourceId: 'hg0fn6',
                resourcePath: '/mint',
                httpMethod: 'POST',
                extendedRequestId: 'TdReXG-qliAFvlg=',
                requestTime: '09/Jun/2022:13:57:47 +0000',
                path: '/prod/mint',
                accountId: '966408459255',
                protocol: 'HTTP/1.1',
                stage: 'prod',
                domainPrefix: 'ibn51vomli',
                requestTimeEpoch: 1654783067729,
                requestId: 'e7077e41-1a5f-4010-a1e9-1cadd99d1840',
                identity: {
                    cognitoIdentityPoolId: null,
                    accountId: null,
                    cognitoIdentityId: null,
                    caller: null,
                    sourceIp: '79.184.101.22',
                    principalOrgId: null,
                    accessKey: null,
                    cognitoAuthenticationType: null,
                    cognitoAuthenticationProvider: null,
                    userArn: null,
                    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                    user: null
                },
                domainName: 'ibn51vomli.execute-api.eu-central-1.amazonaws.com',
                apiId: 'ibn51vomli'
            },
            body: '------WebKitFormBoundaryANYmLYXqynOAfdQw\r\n' +
                'Content-Disposition: form-data; name="data"\r\n' +
                '\r\n' +
                'undefined\r\n' +
                '------WebKitFormBoundaryANYmLYXqynOAfdQw--\r\n',
            isBase64Encoded: false
        }
        await app.handler(event, context)
    });
});
