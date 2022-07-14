const net = require('net');

const clients = [];

const calculator = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '/': (x, y) => {
        if (y === 0) {
            return "Invalid operation (division by zero)";
        }

        return x / y;
    },
    '*': (x, y) => x * y,
}

const validate = (req) => {
    if (req.op === null || req.x  === null || req.y === null) {
        return false;
    }
    
    return true;
}

const handleConnection = socket => {
    socket.on('data', data => {
        const jsonData = JSON.parse(data.toString());
    });
}

const server = net.createServer(handleConnection);

server.listen(3000, '127.0.0.1');