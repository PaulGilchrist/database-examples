/*
See either `README_Docker.md` or `README_Kubernetes.md` before running this nodeJS test
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
    try {
        response = await client.ping({ requestTimeout: 1000 }); // ping usually has a 3000ms timeout
    } catch (err) {
        console.trace('elasticsearch cluster is down!');
        // console.error(err);
        process.exit(1);
    }
    try {
        response = await client.cluster.health();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    // Delete the old index if it exists
    try {
        response = await client.indices.delete({ index: 'store' });
    } catch (err) {
        // console.error(err);
    }
    // Create a new empty index
    try {
        response = await client.indices.create({ index: 'store' });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    // Create a single document
    try {
        response = await client.index({
            index: 'store',
            id: '123',
            type: 'shoppingCart',
            body: {
                'itemCount': 2,
                'lastModifiedDate': Date.now()
            }
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    // Create array of rows to insert, executing them in bulk
    const dataset = [
        {
            id: '234',
            itemCount: 5,
            lastModifiedDate: Date.now()
        },
        {
            id: '345',
            itemCount: 3,
            lastModifiedDate: Date.now()
        },
        {
            id: '456',
            itemCount: 6,
            lastModifiedDate: Date.now()
        }
    ];
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
        response = await client.count({ index: 'store', type: 'shoppingCart' });
        console.log(`${response.count} shopping carts`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    // Execute query to get table data
    try {
        response = await client.search({
            index: 'store',
            type: 'shoppingCart',
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
        console.error(err);
        process.exit(1);
    }
    console.log('Shutting down');
    process.exit(0);
}

main();
