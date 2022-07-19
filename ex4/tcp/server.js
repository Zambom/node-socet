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

const handleConnection = socket => {
    socket.on('data', data => {
        const jsonData = JSON.parse(data.toString());

        if (jsonData.end) {
            socket.destroy({});
        } else {
            let response = "";
    
            if (!validate(jsonData)) {
                response = "Invalid request (missing parameters)";
            } else {
                response = (calculator[jsonData.op](jsonData.x, jsonData.y)).toString();
            }
    
            socket.write(response);
        }
    });

    socket.on("error", err => {
        console.log(err);
    });
}

const server = net.createServer(handleConnection);

server.listen(3000, '127.0.0.1');