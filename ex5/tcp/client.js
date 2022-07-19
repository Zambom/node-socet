const net = require('net');
const readline = require('readline');

const handleInput = input => {
    const str = input.toString();

    if (str.toLowerCase() === "bye") {
        return false;
    }

    const terms = str.split(' ');

    return { op: terms[0], x: Number.parseInt(terms[1]), y: Number.parseInt(terms[2]), end: 0 };
}

const serialize = obj => {
    const values = Object.values(obj);

    const buffer = Buffer.alloc(values.length);

    values.forEach((val, idx) => {
        if (Number.isInteger(val)) {
            buffer.writeInt8(val, idx);
        }else {
            buffer.write(val, idx);
        }
    });

    return buffer;
}

const deserialize = data => {
    const buffer = Buffer.from(data);

    return buffer.toString();
}

const client = new net.Socket();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.connect(3000, '127.0.0.1', () => {
    rl.addListener('line', line => {
        line = handleInput(line);

        if (!line) {
            client.write(serialize({ op: '', x: 0, y: 0, end: 1 }));
            client.end();
        }

        client.write(serialize(line));
    });
});

console.log('Type your question as "op num1 num2" (op = {+, -, /, *}):\n');

client.on('data', msg => {
    msg = deserialize(msg);

    console.log(`Result: ${msg}\n`);
});

client.on("error", err => {
    switch(err.code) {
        case 'ERR_STREAM_WRITE_AFTER_END':
            console.log('Connection lost.');
            break;

        case 'ECONNREFUSED':
            console.log('Server is unreachable');
            break;
        
        default:
            console.log('Something went wrong.');
    }

    client.end();
});

client.on('close', () => {
    console.log('Connection ended.');
});