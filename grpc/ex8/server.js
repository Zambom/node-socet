const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('chat.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const chatPackage = grpcObj.chatPackage;

const clients = [];

const broadcastMessage = (id, message) => {
    clients.forEach(el => {
        if (el.id !== id) {
            el.call.write(message);
        }
    });
}

const join = (call) => {
    const { id, name } = call.request;
    const qtd = clients.length;
    
    clients.push({ id, call, name});

    broadcastMessage(id, { id, type: 0, msg: `${name} has joined the channel` });

    call.write({ id, type: 2, msg: qtd });
}

const send = (call, callback) => {
    const { id, msg } = call.request;
    
    const me = clients.find(el => el.id === id);
    
    broadcastMessage(id, { id, type: 1, msg: `${me.name}: ${msg}` });

    if (msg.toLowerCase() === "bye") {
        broadcastMessage(id, { id, type: 0, msg: `${me.name} has left the channel` });

        me.call.end();

        clients.splice(clients.indexOf(me), 1);
    }
}

const server = new grpc.Server();
server.bind("0.0.0.0:3000", grpc.ServerCredentials.createInsecure());

server.addService(chatPackage.Chat.service, {
    'join': join,
    'send': send
});

server.start();