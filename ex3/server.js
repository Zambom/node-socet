const dgram = require('dgram');

const socket = dgram.createSocket('udp4');

socket.on('error', error => {
    console.log(`Error: ${error}`);
    socket.close();
});

socket.on('message', (msg, rinfo) => {
    console.log(`message: ${msg} | info: ${rinfo.address} - ${rinfo.port}`);
});

socket.bind(8081);