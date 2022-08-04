const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');
const crypto = require('crypto');

const packageDef = protoLoader.loadSync('chat.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const chatPackage = grpcObj.chatPackage;

const client = new chatPackage.Chat("127.0.0.1:3000", grpc.credentials.createInsecure());

const send = client.send();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

send.on('data', (data) => {
    const { msg } = data;

    console.log(`\x1b[32mServer: ${msg}\x1b[0m`);

    if (msg.toLowerCase() === 'bye') {
        send.end();
        rl.close();
    }
});

rl.addListener('line', line => {
    send.write({ msg: line });

    readline.moveCursor(process.stdout, 0, -1);
    readline.clearScreenDown(process.stdout);

    console.log(`\x1b[34mMe: ${line.toString()}\x1b[0m`);

    if (line.toString().toLowerCase() === 'bye') {
        send.end();
        rl.close();
    }
});