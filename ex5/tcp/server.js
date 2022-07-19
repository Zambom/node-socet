const net = require('net');

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
        y: buffer.readInt8(2),
        end: buffer.readInt8(3)
    };

    return req;
}

const handleConnection = socket => {
    socket.on('data', data => {
        const jsonData = deserialize(data);

        if (jsonData.end) {
            socket.destroy({});
        } else {
            let response = "";
    
            if (!validate(jsonData)) {
                response = "Invalid request (missing parameters)";
            } else {
                response = (calculator[jsonData.op](jsonData.x, jsonData.y)).toString();
            }
    
            socket.write(serialize(response));
        }
    });

    socket.on("error", err => {
        console.log(err);
    });
}

const server = net.createServer(handleConnection);

server.listen(3000, '127.0.0.1');