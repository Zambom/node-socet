const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = dgram.createSocket('udp4');

console.log('Type your question as "op num1 num2" (op = {+, -, /, *}):\n');

client.on('message', msg => {
    console.log(`Result: ${msg}\n`);
});

rl.addListener('line', line => {
    line = line.toString();

    if (line.toLowerCase() === 'bye') {
        client.close();
    }

    const terms = line.split(" ");

    client.send(JSON.stringify({ op: terms[0], x: Number.parseFloat(terms[1]), y: Number.parseFloat(terms[2]) }), 8081, '127.0.0.1');
});