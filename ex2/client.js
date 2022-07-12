const net = require('net');
const readline = require('readline');

const client = new net.Socket();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.connect(3000, '127.0.0.1', () => {
    let messageType = 0;

    rl.addListener('line', line => {
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearScreenDown(process.stdout);
        
        if (line.toString().toLowerCase() === 'exit') {
            client.write(JSON.stringify({ type: 2, message: line.toString() }));
            client.end();
        } else {
            client.write(JSON.stringify({ type: messageType, message: line.toString() }));
            
            if (messageType === 1) {
                console.log(`\x1b[34mMe: ${line.toString()}\x1b[0m`);
            }
            
            messageType = 1;
        }

    });
});

client.on('data', data => {
    const jsonData = JSON.parse(data.toString());

    switch (jsonData['type']) {
        case 0:
            console.log(`\x1b[36m${jsonData['message']}\x1b[0m\n`);

            break;
        case 1:
            console.log(`\x1b[32m${jsonData['message']}\x1b[0m`);
        
            break;
        case 2:
            console.log(`\n\x1b[33m${jsonData['message']}\x1b[0m\n`);

            break;
    }
});