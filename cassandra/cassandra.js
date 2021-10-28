/*
See either `README_Docker.md` or `README_Kubernetes.md` before running this nodeJS test
*/

"use strict"
const args = require("minimist")(process.argv.slice(2)); // Get arguments by name rather than by index
const cassandra = require('cassandra-driver');

const contactPoints = (args["contactPoints"] || process.env.contactPoints || '127.0.0.1').split(',');

const main = async () => {
    const client = new cassandra.Client({ contactPoints: contactPoints, localDataCenter: 'datacenter1' });
    await client.connect()
    console.log(`Connected to cluster with ${client.hosts.length} host(s): ${client.hosts.keys()}`);
    // List hosts
    client.hosts.forEach((host) => {
        console.log('Host %s v%s on rack %s, dc %s', host.address, host.cassandraVersion, host.rack, host.datacenter);
    });
    // List keyspaces
    console.log('Listing keyspaces:');
    for (let name in client.metadata.keyspaces) {
        if (!client.metadata.keyspaces.hasOwnProperty(name)) continue;
        const keyspace = client.metadata.keyspaces[name];
        console.log('- %s:\n\tstrategy %s\n\tstrategy options %j',
            keyspace.name, keyspace.strategy, keyspace.strategyOptions);
    }
    // Create new keyspace
    await client.execute(`CREATE KEYSPACE IF NOT EXISTS store WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };`);
    // Create table in new keyspace
    await client.execute(`CREATE TABLE IF NOT EXISTS store.shoppingCart (userId text PRIMARY KEY, itemCount int, lastModifiedDate timestamp);`);
    // Ensure table starts empty
    await client.execute(`TRUNCATE store.shoppingCart`);
    // Create single new row
    await client.execute(`INSERT INTO store.shoppingCart (userId, itemCount, lastModifiedDate) VALUES ('123', 2, toTimeStamp(now()))`);
    // Create array of rows to insert, executing them in bulk
    const query = 'INSERT INTO store.shoppingCart (userId, itemCount, lastModifiedDate) VALUES (?, ?, toTimeStamp(now()))';
    const values = [
        ['234', 5],
        ['345', 3],
        ['456', 6]
    ];
    await cassandra.concurrent.executeConcurrent(client, query, values);
    const result = await client.execute('SELECT * FROM store.shoppingCart');
    console.log('Obtained result: ', result);
    console.log('Shutting down');
    client.shutdown();
    process.exit(0);
}

main();
