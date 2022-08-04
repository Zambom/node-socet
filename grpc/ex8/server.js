const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

const packageDef = protoLoader.loadSync('chat.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const chatPackage = grpcObj.chatPackage;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const send = (call) => {
    call.on('data', (data) => {
        const message = data.msg;
        
        console.log(`\x1b[32mClient: ${message}\x1b[0m`);

        if (message.toLowerCase() === "bye") {
            rl.close();
            call.end();
        }
    });

    rl.addListener('line', line => {
        call.write({ msg: line });

        readline.moveCursor(process.stdout, 0, -1);
        readline.clearScreenDown(process.stdout);

        console.log(`\x1b[34mMe: ${line.toString()}\x1b[0m`);

        if (line.toString().toLowerCase() === 'bye') {
            rl.close();
            call.end();
        }
    });
}

const server = new grpc.Server();
server.bind("0.0.0.0:3000", grpc.ServerCredentials.createInsecure());

server.addService(chatPackage.Chat.service, {
    'send': send
});

server.start();