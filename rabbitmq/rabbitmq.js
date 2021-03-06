/*
See either `README_Docker.md` or `README_Kubernetes.md` before running this nodeJS test
*/

"use strict"
const amqp = require('amqplib/callback_api');

const main = async () => {
    const exchange = 'logs';
    // connect, createChannel, and assertExchange are required for either a sender or receiver service
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel(async (error1, channel) => {
            if (error1) {
                throw error1;
            }
            channel.assertExchange(exchange, 'fanout', { // Could change to direct and add a binding key
                durable: false
            });
            // Setup listner
            channel.assertQueue('', {
                exclusive: true
            }, (error2, q) => {
                if (error2) {
                    throw error2;
                }
                console.log(` [*] Waiting for messages in ${q.queue}. To exit press CTRL+C`);
                channel.bindQueue(q.queue, exchange, '');
                channel.consume(q.queue, (msg) => {
                    if (msg.content) {
                        console.log(` [x] Received ${msg.content.toString()}`);
                    }
                }, {
                    noAck: true
                });
            });
            // Allow the listener to start before continuing
            await sleep(500);
            // Send some messages (usually sender and receiver are on separate services, but this demo has them together for readability)
            const dataset = [
                {
                    userId: '123',
                    itemCount: 2,
                    lastModifiedDate: Date.now()
                },
                {
                    userId: '234',
                    itemCount: 5,
                    lastModifiedDate: Date.now()
                },
                {
                    userId: '345',
                    itemCount: 3,
                    lastModifiedDate: Date.now()
                },
                {
                    userId: '456',
                    itemCount: 6,
                    lastModifiedDate: Date.now()
                }
            ];
            dataset.forEach(async (data) => {
                const msg = JSON.stringify(data);
                channel.publish(exchange, '', Buffer.from(msg));
                console.log(` [x] Sent ${msg}`);
            });
            // Allow time for all messages to be received before closing the connection
            await sleep(500);
            connection.close();
            process.exit(0);
        });
    });
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();
