/*
Assumes a RabbitMQ Docker container is already running locally, otherwise change the client connection details
    Without persistance
        docker run -d -p 15672:15672 -p 5672:5672 --hostname rabbitmq --name rabbitmq rabbitmq:3-management 
    With persistance (must pre-create the directory `/Users/Shared/containerStorage/rabbitmq` on host before running container)
        docker run -d -p 15672:15672 -p 5672:5672 --hostname rabbitmq --name rabbitmq -v /Users/Shared/containerStorage/rabbitmq:/var/lib/rabbitmq rabbitmq:3-management 

Assumes the client npm package has been installed
    npm i amqplib --save

You can connect to the management UI at http://localhost:15672
Default username and password of guest / guest
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
