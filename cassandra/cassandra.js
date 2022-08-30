/*
See either `README_Docker.md` or `README_Kubernetes.md` before running this nodeJS test
*/

"use strict"
const args = require("minimist")(process.argv.slice(2)); // Get arguments by name rather than by index
const cassandra = require('cassandra-driver');

const contactPoints = (args["contactPoints"] || process.env.contactPoints || '127.0.0.1').split(',');

const main = async () => {
    logTime('Starting/Connecting');
    // Connecting to the client is slow but queries are fast.  Reuse client once connected
    const client = new cassandra.Client({ contactPoints: contactPoints, localDataCenter: 'datacenter1' });
    await client.connect()
    logTime(`Connected to cluster with ${client.hosts.length} host(s): ${client.hosts.keys()}`);
    // List hosts
    client.hosts.forEach((host) => {
        console.log(`    Host ${host.address} version ${host.cassandraVersion} on ${host.rack}, ${host.datacenter}`);
    });
    // List keyspaces
    logTime('Listing keyspaces:');
    for (let name in client.metadata.keyspaces) {
        if (!client.metadata.keyspaces.hasOwnProperty(name)) continue;
        const keyspace = client.metadata.keyspaces[name];
        console.log(`    ${keyspace.name}:`);
        if(keyspace.strategy) {
            console.log(`      strategy: ${keyspace.strategy}`);
        }
        if(keyspace.strategyOptions) {
            console.log('      strategy options: %s', keyspace.strategyOptions);
        }
    }
    // Create new keyspace
    await client.execute(`CREATE KEYSPACE IF NOT EXISTS store WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'replication_factor' : '3' };`);
    logTime('Created Keyspace');
    // Create table in new keyspace
    await client.execute(`CREATE TABLE IF NOT EXISTS store.shoppingCart (userId text PRIMARY KEY, itemCount int, lastModifiedDate timestamp);`);
    logTime('Created Table');
    // Ensure table starts empty
    await client.execute(`TRUNCATE store.shoppingCart`);
    logTime('Truncated Table');
    // Create single new row
    await client.execute(`INSERT INTO store.shoppingCart (userId, itemCount, lastModifiedDate) VALUES ('123', 2, toTimeStamp(now()))`);
    logTime('Inserted 1 Record');
    // Create array of rows to insert, executing them in bulk
    const query = 'INSERT INTO store.shoppingCart (userId, itemCount, lastModifiedDate) VALUES (?, ?, toTimeStamp(now()))';
    const values = [
        ['234', 5],
        ['345', 3],
        ['456', 6]
    ];
    await cassandra.concurrent.executeConcurrent(client, query, values, { prepare: true });
    logTime('Inserted 3 Records');
    const result = await client.execute('SELECT * FROM store.shoppingCart', null, { prepare: true });
    logTime('Queries All Records');
    console.log(JSON.stringify(result, null, '   '));
    logTime('Shutting down');
    client.shutdown();
    process.exit(0);
}

const logTime = (message) => {
    const options = {
        timeZone: "UTC",
        timeZoneName: "short",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3
    };
    const time = new Date().toLocaleTimeString("en-US", options);
    //const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}.${currentDate.getMilliseconds()}`;
    if (message) {
        console.log(`${time} - ${message}`);
    } else {
        console.log(time);
    }
}

main();
