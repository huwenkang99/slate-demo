const net = require('net');
const server = net.createServer((socket) => {
    // 新的连接
    socket.on('data', (data) => {
        socket.write('你好');
        console.log('socket data', data.toString());
    });
    socket.on('end', () => {
        console.log('断开连接');
    });
    socket.write('欢迎光临 深入浅出nodejs')
});

server.listen(8124, () => {
    console.log('server bound');
})