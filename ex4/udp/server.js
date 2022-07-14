const dgram = require('dgram');
const { request } = require('http');

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
    if (req.op == null || req.x == null || req.y == null) {
        return false;
    }
    
    return true;
}

const socket = dgram.createSocket('udp4');

socket.on('error', error => {
    console.log(`Error: ${error}`);
    socket.close();
});

socket.on('message', (msg, rinfo) => {
    console.log(`Request: ${msg} - From ${rinfo.address}:${rinfo.port}\n`);

    const req = JSON.parse(msg);
    let response = "";

    if (!validate(req)) {
        response = "Invalid request (missing parameters)";
    } else {
        response = (calculator[req.op](req.x, req.y)).toString();
    }

    socket.send(response, rinfo.port, rinfo.address);
});

socket.bind(8081);