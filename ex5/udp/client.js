const dgram = require('dgram');
const readline = require('readline');

const handleInput = input => {
    const str = input.toString();

    if (str.toLowerCase() === "bye") {
        return false;
    }

    const terms = str.split(' ');

    return { op: terms[0], x: Number.parseInt(terms[1]), y: Number.parseInt(terms[2]) };
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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = dgram.createSocket('udp4');

console.log('Type your question as "op num1 num2" (op = {+, -, /, *}):\n');

client.on('message', msg => {
    msg = deserialize(msg);

    console.log(`Result: ${msg}\n`);
});

rl.addListener('line', line => {
    line = handleInput(line);
    
    if (!line) {
        console.log('end');
        client.close();
    } else {
        client.send(serialize(line), 8081, '127.0.0.1');
    }
});