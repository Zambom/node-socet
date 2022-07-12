const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = dgram.createSocket('udp4');

client.on('message', (msg, info) => {
    console.log(`\x1b[32mServer: ${msg}\x1b[0m`);
});

rl.addListener('line', line => {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearScreenDown(process.stdout);
    
    client.send(line.toString(), 8081, '127.0.0.1');
});