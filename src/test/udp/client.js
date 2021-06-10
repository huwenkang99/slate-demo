const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const message = new Buffer.from('深入浅出nodejs');

client.send(message, 41234, 'localhost', (err, bytes) => {
    client.close();
});