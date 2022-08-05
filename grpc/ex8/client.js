const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');
const crypto = require('crypto');

const packageDef = protoLoader.loadSync('chat.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const chatPackage = grpcObj.chatPackage;

const uuid = crypto.randomUUID();

const client = new chatPackage.Chat("127.0.0.1:3000", grpc.credentials.createInsecure());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const handleStreamReturn = (data) => {
    const { type, msg } = data;

    switch (type) {
        case 0:
            console.log(`\x1b[36m${msg}\x1b[0m\n`);

            break;
        case 1:
            console.log(`\x1b[32m${msg}\x1b[0m`);

            break;
        case 2:
            let complement;

            switch (msg) {
                case '0':
                    complement = 'yourself';
                    break;
                case '1':
                    complement = 'one another';
                    break;
                default:
                    complement = `${msg} others`;
            }

            console.log(`\x1b[33mTalking to ${complement}\x1b[0m\n`);

            break;
    }
}

const joinChat = (username) => {
    const stream = client.join({ id: uuid, name: username });

    stream.on('data', handleStreamReturn);

    stream.on('error', () => {
        console.log(`\x1b[36mLost connection to server.\x1b[0m\n`);

        rl.close();
    });
}

rl.question(`\x1b[36mWho's there?\x1b[0m\n`, answer => {
    joinChat(answer);
});

rl.addListener('line', line => {
    client.send({ id: uuid, type: 0, msg: line }, (res) => {});

    readline.moveCursor(process.stdout, 0, -1);
    readline.clearScreenDown(process.stdout);

    console.log(`\x1b[34mMe: ${line.toString()}\x1b[0m`);

    if (line.toString().toLowerCase() === 'bye') {
        rl.close();
    }
});