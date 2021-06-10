const fs = require('fs');
const rs1 = fs.createReadStream('./str1.txt');
const rs2 = fs.createReadStream('./str2.txt');

const readPromise1 = new Promise((resolve, reject) => {
    rs1.on('data', (buf) => {
        resolve(buf);
    });
});

const readPromise2 = new Promise((resolve, reject) => {
    rs2.on('data', (buf) => {
        resolve(buf);
    });
});

console.log('start');
Promise.all([readPromise1, readPromise2]).then(res => {
    const bufArr = [res[0], res[1]];
    const arr2 = Buffer.concat(bufArr);
    console.log('res', arr2.toString());
})