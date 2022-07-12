const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const handleConnection = socket => {
    console.log('A new challenger has arrived...');

    socket.on('end', () => {
        console.log('Goodbye', socket);
    });

    rl.addListener('line', line => {
        socket.emit(line);
    });

    socket.on('data', data => {
        console.log(data.toString());
    });
}

const server = net.createServer(handleConnection);

server.listen(3000, '127.0.0.1');