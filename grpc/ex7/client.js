const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

const packageDef = protoLoader.loadSync('chat.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const chatPackage = grpcObj.chatPackage;

const client = new chatPackage.Calc("127.0.0.1:3000", grpc.credentials.createInsecure());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.addListener('line', line => {
    line = handleInput(line);
    
    client.send({ msg: line });

    readline.moveCursor(process.stdout, 0, -1);
    readline.clearScreenDown(process.stdout);

    console.log(`\x1b[34mMe: ${line.toString()}\x1b[0m`);

    if (line.toString().toLowerCase() === 'bye') {
        client.end();
    }
});