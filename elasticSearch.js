/*
Assumes a elasticSearch Docker container is already running locally, otherwise change the client connection details
    docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" --name elasticSearch elasticsearch:7.14.2

You can run elasticSearch commands locally within the container by connecting to its console and running the command `psql`
*/

"use strict"
const elasticsearch = require('elasticsearch');

const main = async () => {
    const client = new elasticsearch.Client({
        host: 'localhost:9200',
        log: 'trace',
        apiVersion: '7.x', // use the same version of your Elasticsearch instance
    });
    let response;
    // client.ping({
    //     // ping usually has a 3000ms timeout
    //     requestTimeout: 1000
    // }, (error) => {
    //     if (error) {
    //         console.trace('elasticsearch cluster is down!');
    //     } else {
    //         console.log('All is well');
    //     }
    // });
    try {
        response = await client.cluster.health();
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
    // Delete the old index if it exists
    try {
        response = await client.indices.delete({ index: 'store' });
    } catch (err) {
        // console.log(err);
    }
    // Create a new empty index
    try {
        response = await client.indices.create({ index: 'store' });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    // Create a single document
    try {
        response = await client.index({
            index: 'store',
            id: '123',
            type: 'shopping_cart',
            body: {
                'item_count': 2,
                'last_update_timestamp': Date.now()
            }
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    // Create array of rows to insert, executing them in bulk
    const dataset = [{
        id: '234',
        item_count: 5,
        last_update_timestamp: Date.now()
    }, {
        id: '345',
        item_count: 3,
        last_update_timestamp: Date.now()
    }, {
        id: '456',
        item_count: 6,
        last_update_timestamp: Date.now()
    }];
    const body = dataset.flatMap(doc => [{ index: { _index: 'store' } }, doc]);
    const bulkResponse = await client.bulk({ refresh: true, body });
    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: body[i * 2],
                    document: body[i * 2 + 1]
                })
            }
        })
        console.log(erroredDocuments)
    }
    // Count shopping carts
    try {
        response = await client.count({ index: 'store', type: 'shopping_cart' });
        console.log(`${response.count} shopping carts`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    // Execute query to get table data
    try {
        response = await client.search({
            index: 'store',
            type: 'shopping_cart',
            body: {
                query: {
                    wildcard: { 'id': '*3*' }
                },
            }
        });
        console.log("--- Response ---");
        console.log(response);
        console.log("--- Hits ---");
        response.hits.hits.forEach(function(hit){
          console.log(hit);
        })
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Shutting down');
    process.exit(0);
}

main();
