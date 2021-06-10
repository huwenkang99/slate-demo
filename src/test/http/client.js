const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: '1334',
    method: 'GET',
    path: '/',
};
const req = http.request(options, (res) => {
    console.log('status code:', res.statusCode);
    console.log('headers:', JSON.stringify(res.headers));
    res.setEncoding('utf-8');
    res.on('data', (chunk) => {
        console.log('res chunk:', chunk);
    });
});
// 默认并发数为5，可配置

req.end();