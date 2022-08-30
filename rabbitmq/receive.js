#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function (erro1, channel) {
        if (erro1) {
            throw erro1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(`Waiting for message in ${queue}`);

        channel.consume(queue, function (msg) {
            console.log(`Received '${msg.content.toString()}'`);
        }, {
            noAck: true
        });
    });
});