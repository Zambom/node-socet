const net = require('net');
const readline = require('readline');

const client = new net.Socket();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.connect(3000, '127.0.0.1', () => {
    console.log('\x1b[33mcontrol message: connected\x1b[0m\n\n');

    rl.addListener('line', line => {
        client.write(line);

        readline.moveCursor(process.stdout, 0, -1);
        readline.clearScreenDown(process.stdout);

        console.log(`\x1b[34mMe: ${line.toString()}\x1b[0m`);

        if (line.toString().toLowerCase() === 'bye') {
            client.end();
        }
    });
});

client.on('data', data => {
    console.log(`\x1b[32mServer: ${data.toString()}\x1b[0m`);
});