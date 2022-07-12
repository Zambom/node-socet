const net = require('net');
const crypto = require('crypto');

const clients = [];

const broadcastMessage = (id, message) => {
    clients.forEach(el => {
        if (el.id !== id) {
            el.socket.write(JSON.stringify(message));
        }
    });
}

const handleConnection = socket => {
    const identifier = crypto.randomUUID();

    socket.write(JSON.stringify({ type: 0, message: 'Identify yourself' }));

    socket.on('data', data => {
        const jsonData = JSON.parse(data.toString());

        switch (jsonData['type']) {
            case 0:
                clients.push({ id: identifier, socket, name: jsonData["message"] });

                broadcastMessage(identifier, { type: 2, message: `${jsonData["message"]} has joined.`});
                socket.write(JSON.stringify({ type: 0, message: "Joined chat." }));

                break;
            case 1:
                const me = clients.find(el => el.id === identifier);

                broadcastMessage(me.id, { type: 1, message: `${me.name}: ${jsonData["message"]}` });

                break;
            case 2:
                const client = clients.find(el => el.id === identifier);

                broadcastMessage(client.id, { type: 2, message: `${client.name} has left the channel` });
                socket.write(JSON.stringify({ type: 0, message: "Disconnected." }));

                clients.splice(clients.indexOf(client), 1);

                break;
        }
    });
}

const server = net.createServer(handleConnection);

server.listen(3000, '127.0.0.1');