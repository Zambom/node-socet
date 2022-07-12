const net = require('net');
const readline = require('readline');

const client = new net.Socket();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.connect(3000, '127.0.0.1', () => {
    console.log('connected');

    rl.addListener('line', line => {
        client.write(line);
    });
});

client.on('data', data => {
    console.log(data.toString());
});