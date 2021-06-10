const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    const buffers = [];
    req.on('data', (trunk) => {
        buffers.push(trunk);
    })
        .on('end', () => {
            const buffer = Buffer.concat(buffers);
            res.end('hello http');
        });
}).listen(1334, '127.0.0.1', () => {
    console.log('server is listening at: http://127.0.0.1:1334');
});