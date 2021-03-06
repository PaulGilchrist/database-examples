/*
See either `README_Docker.md` or `README_Kubernetes.md` before running this nodeJS test
*/

"use strict"
const { Pool } = require('pg');

const main = async () => {
    const pool = new Pool({
        user: "postgres",
        password: "password",
        host: "localhost",
        port: 5432,
      });
    let result;
    // Create database
    try {
        result = await pool.query(`CREATE DATABASE store WITH OWNER 'postgres'`);
    } catch(err) {
        if(err.code != '42P04') { // database already exists
            console.error(err);
            process.exit(1);
        }
    }
    // Create table
    try {
        result = await pool.query(`CREATE TABLE shoppingCart(userId text NOT NULL PRIMARY KEY, itemCount int NOT NULL, lastModifiedDate timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL);`);
    } catch(err) {
        if(err.code != '42P07') { // relation already exists
            console.error(err);
            process.exit(1);
        }
    }
    // Ensure table starts empty
    try {
        result = await pool.query(`TRUNCATE TABLE shoppingCart`);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    // Create single new row
    try {
        result = await pool.query(`INSERT INTO shoppingCart (userId, itemCount) VALUES ('123', 2)`);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    // Create array of rows to insert, executing them in bulk
    let query = `INSERT INTO shoppingCart (userId, itemCount) VALUES ('234', 5);`;
    query += `INSERT INTO shoppingCart (userId, itemCount) VALUES ('345', 3);`;
    query += `INSERT INTO shoppingCart (userId, itemCount) VALUES ('456', 6);`;
    try {
        result = await pool.query(query);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    // Execute query to get table data
    try {
        result = await pool.query('SELECT * FROM shoppingCart');
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Obtained result: ', result);
    console.log('Shutting down');
    pool.end();
    process.exit(0);
}

main();
