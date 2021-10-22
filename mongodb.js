/*
Assumes a MongoDB Docker container is already running locally, otherwise change the client connection details
    docker run -d -p 27017:27017 --name mongodb mongo

You can run MongoDB commands locally within the container by connecting to its console and running the command `mongo`
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
    await client.db("store").collection("shopping_cart").deleteMany({});
    // Bulk insert
    const documents = [
        {
            userId: '123',
            itemCount: 2,
            last_update_timestamp: Date.now()
        },
        {
            userId: '234',
            itemCount: 5,
            last_update_timestamp: Date.now()
        },
        {
            userId: '345',
            itemCount: 3,
            last_update_timestamp: Date.now()
        },
        {
            userId: '456',
            itemCount: 6,
            last_update_timestamp: Date.now()
        }
    ]
    await client.db("store").collection("shopping_cart").insertMany(documents);
    // Find documents
    // Could optionally sort({ name: 1 }) between find() and toArray()
    // Could optionally limit(5) between find() and toArray()
    // let query = {'userId':'123'};
    const result = await client.db("store").collection("shopping_cart").find({}).toArray();
    if (result && result.length > 0) {
        console.log(result);
    } else {
        console.error(`Document not found - find`);
    }
    client.close();
    process.exit(0);
};

main();
