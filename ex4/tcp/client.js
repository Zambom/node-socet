const net = require('net');
const readline = require('readline');

const client = new net.Socket();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.connect(3000, '127.0.0.1', () => {
    rl.addListener('line', line => {
        line = line.toString();

        if (line.toLowerCase() === 'bye') {
            client.write(JSON.stringify({ end: true }));
            client.end();
        }

        const terms = line.split(" ");

        client.write(JSON.stringify({ op: terms[0], x: Number.parseFloat(terms[1]), y: Number.parseFloat(terms[2]) }));
    });
});

console.log('Type your question as "op num1 num2" (op = {+, -, /, *}):\n');

client.on('data', msg => {
    console.log(`Result: ${msg}\n`);
});

client.on("error", err => {
    switch(err.code) {
        case 'ERR_STREAM_WRITE_AFTER_END':
            console.log('Connection lost.');
            break;

        case 'ECONNREFUSED':
            console.log('Server is unreachable');
            break;
        
        default:
            console.log('Something went wrong.');
    }

    client.end();
});

client.on('close', () => {
    console.log('Connection ended.');
});