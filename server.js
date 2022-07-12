const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const handleConnection = socket => {
    console.log('\x1b[33mcontrol message: a new challenger has arrived...\x1b[0m\n\n');

    socket.on('end', () => {
        console.log('\n\n\x1b[33mcontrol message: Client has left...\x1b[0m');
    });

    rl.addListener('line', line => {
        socket.write(line);

        readline.moveCursor(process.stdout, 0, -1);
        readline.clearScreenDown(process.stdout);

        console.log(`\x1b[34mMe: ${line.toString()}\x1b[0m`);
    });

    socket.on('data', data => {
        const message = data.toString();
        
        console.log(`\x1b[32mClient: ${message}\x1b[0m`);

        if (message.toLowerCase() === "bye") {
            socket.end();
        }
    });
}

const server = net.createServer(handleConnection);

server.listen(3000, '127.0.0.1');