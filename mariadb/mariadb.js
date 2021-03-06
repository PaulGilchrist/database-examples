/*
See either `README_Docker.md` or `README_Kubernetes.md` before running this nodeJS test
*/

"use strict"
const mariadb = require('mariadb');

const main = async () => {
    let conn;
    try {
        conn = await mariadb.createConnection({
            user: "root",
            host: "127.0.0.1",
            password: "password"
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    let result;
    // Create database
    try {
        result = await conn.query(`CREATE DATABASE IF NOT EXISTS store`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    // Create table
    try {
        result = await conn.query(`CREATE TABLE IF NOT EXISTS store.shoppingCart(userId VARCHAR(10) NOT NULL PRIMARY KEY, itemCount int NOT NULL, lastModifiedDate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL);`);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    // Ensure table starts empty
    try {
        result = await conn.query(`TRUNCATE TABLE store.shoppingCart`);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    // Create single new row
    try {
        result = await conn.query(`INSERT INTO store.shoppingCart (userId, itemCount) VALUES ('123', 2)`);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    // Create array of rows to insert, executing them in bulk
    let query = `INSERT INTO store.shoppingCart (userId, itemCount) VALUES ('234', 5),('345', 3),('456', 6)`;
    try {
        result = await conn.query(query);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    // Execute query to get table data
    try {
        result = await conn.query('SELECT * FROM store.shoppingCart');
        console.log('Obtained result: ', result);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    // Close Connection
    console.log('Shutting down');
    if (conn) conn.close();
    process.exit(0);
}

main();
