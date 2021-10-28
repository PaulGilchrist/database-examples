/*
See either `README_Docker.md` or `README_Kubernetes.md` before running this nodeJS test
*/

"use strict";
const mongoClient = require("mongodb").MongoClient;

const main = async () => {
    const mongoClientOptions = {
        connectTimeoutMS: 300000, // 5 min - May need to wait for the container to finish creation process and first time database setup
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
    const client = await mongoClient.connect("mongodb://localhost:27017/", mongoClientOptions);
    // Remove all existing documents
    await client.db("store").collection("shoppingCart").deleteMany({});
    // Bulk insert
    const documents = [
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
    ]
    await client.db("store").collection("shoppingCart").insertMany(documents);
    // Find documents
    // Could optionally sort({ name: 1 }) between find() and toArray()
    // Could optionally limit(5) between find() and toArray()
    // let query = {'userId':'123'};
    const result = await client.db("store").collection("shoppingCart").find({}).toArray();
    if (result && result.length > 0) {
        console.log(result);
    } else {
        console.error(`Document not found - find`);
    }
    client.close();
    process.exit(0);
};

main();
