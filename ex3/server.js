const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const socket = dgram.createSocket('udp4');

socket.on('error', error => {
    console.log(`Error: ${error}`);
    socket.close();
});

socket.on('message', (msg, rinfo) => {
    console.log(`\x1b[32mClient: ${msg}\x1b[0m`);

    rl.addListener('line', line => {
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearScreenDown(process.stdout);

        console.log(`\x1b[34mMe: ${line.toString()}\x1b[0m`);
        
        socket.send(line.toString(), rinfo.port, rinfo.address);
        
        if (line.toString().toLowerCase() === 'bye') {
            socket.close();
        }
    });
});

socket.bind(8081);