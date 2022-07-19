const dgram = require('dgram');

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

const validate = req => {
    if (req.op == null || req.x == null || req.y == null) {
        return false;
    }
    
    return true;
}

const serialize = msg => {
    const buffer = Buffer.alloc(1);

    buffer.write(msg);

    return buffer;
}

const deserialize = data => {
    const buffer = Buffer.from(data);
    
    const req = {
        op: buffer.toString('utf8', 0, 1),
        x: buffer.readInt8(1),
        y: buffer.readInt8(2)
    };

    return req;
}

const socket = dgram.createSocket('udp4');

socket.on('error', error => {
    console.log(`Error: ${error}`);
    socket.close();
});

socket.on('message', (msg, rinfo) => {
    const req = deserialize(msg);

    let response = "";

    if (!validate(req)) {
        response = "Invalid request (missing parameters)";
    } else {
        response = (calculator[req.op](req.x, req.y)).toString();
    }

    socket.send(serialize(response), rinfo.port, rinfo.address);
});

socket.bind(8081);