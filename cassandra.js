/*
Assumes a Cassandra Docker container is already running locally, otherwise change the client connection details
    docker run -d -p 9042:9042 --name cassandra cassandra

You can run Cassandra commands locally within the container by connecting to its console and running the command `cqlsh`
*/

"use strict"
const cassandra = require('cassandra-driver');

const main = async () => {
    const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1' });
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
    await client.execute(`CREATE TABLE IF NOT EXISTS store.shopping_cart (userid text PRIMARY KEY, item_count int, last_update_timestamp timestamp);`);
    // Ensure table starts empty
    await client.execute(`TRUNCATE store.shopping_cart`);
    // Create single new row
    await client.execute(`INSERT INTO store.shopping_cart (userid, item_count, last_update_timestamp) VALUES ('123', 2, toTimeStamp(now()))`);
    // Create array of rows to insert, executing them in bulk
    const query = 'INSERT INTO store.shopping_cart (userid, item_count, last_update_timestamp) VALUES (?, ?, toTimeStamp(now()))';
    const values = [
        ['234', 5],
        ['345', 3],
        ['456', 6]
    ];
    await cassandra.concurrent.executeConcurrent(client, query, values);
    // Execute query to get table details
    const table = await client.metadata.getTable('store', 'shopping_cart');
    console.log('Table information');
    console.log('- Name: %s', table.name);
    console.log('- Columns:', table.columns);
    console.log('- Partition keys:', table.partitionKeys);
    console.log('- Clustering keys:', table.clusteringKeys);
    // Execute query to get table data
    const result = await client.execute('SELECT * FROM store.shopping_cart');
    console.log('Obtained result: ', result);;
    console.log('Shutting down');
    client.shutdown();
    process.exit(0);
}

main();
