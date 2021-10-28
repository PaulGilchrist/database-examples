/*
See either `README_Docker.md` or `README_Kubernetes.md` before running this nodeJS test
*/

"use strict";
const redis = require("redis");
const { promisify } = require("util");


const main = async () => {
    // const client = redis.createClient(6379, 'localhost', {auth_pass: redisKey, tls: {servername: 'localhost'}});
    const client = redis.createClient(6379, 'localhost');    
    client.on("error", (err) => {
        console.log('Main error handler');
        console.log(JSON.stringify(err));
        if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
            process.exit(err.errno);
        }
    });
    const get = promisify(client.get).bind(client); // Add support for async/await
    const keys = promisify(client.keys).bind(client); // Add support for async/await
    const set = promisify(client.set).bind(client); // Add support for async/await
    // Remove all existing keys
    client.flushall();
    // Bulk insert
    let batch = client.batch();
    const batchSet = promisify(batch.set).bind(batch); // Add support for async/await
    const batchExec = promisify(batch.exec).bind(batch); // Add support for async/await
    batchSet('123', JSON.stringify({ itemCount: 2, lastModifiedDate: Date.now() }));
    batchSet('234', JSON.stringify({ itemCount: 5, lastModifiedDate: Date.now() }));
    batchSet('345', JSON.stringify({ itemCount: 3, lastModifiedDate: Date.now() }));
    batchSet('456', JSON.stringify({ itemCount: 6, lastModifiedDate: Date.now() }));
    await batchExec(); // Could improve by checking resulting reply array
    const foundKeys = await keys('*3*');
    for(const key of foundKeys) {
        const value = await get(key);
        const shoppingCart = JSON.parse(value);
        shoppingCart.userId = key;
        console.log(shoppingCart);
    }
    client.quit();
    process.exit(0);
};

main();