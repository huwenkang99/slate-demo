const usage = process.memoryUsage();
// console.log('usage', usage);

const arr = [];
for (let i = 0; i < 1000000; i++) {
    arr.push(new Array(100));
}
const os = require('os')
const osTotalMem = os.totalmem();
const osFreeMem = os.freemem();
console.log('os total memory:', osTotalMem, ' os free memory:', osFreeMem);