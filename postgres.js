/*
Assumes a PostgreSql Docker container is already running locally, otherwise change the client connection details
    docker run  -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password --name postgres postgres:latest

You can run PostgreSql commands locally within the container by connecting to its console and running the command `psql`
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
    // Create table
    try {
        result = await pool.query(`CREATE DATABASE store WITH OWNER 'postgres'`);
    } catch(err) {
        if(err.code != '42P04') { // database already exists
            console.log(err);
            process.exit(1);
        }
    }
    // Create table
    try {
        result = await pool.query(`CREATE TABLE shopping_cart(userid text NOT NULL PRIMARY KEY, item_count int NOT NULL, last_update_timestamp timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL);`);
    } catch(err) {
        if(err.code != '42P07') { // relation already exists
            console.log(err);
            process.exit(1);
        }
    }
    // Ensure table starts empty
    try {
        result = await pool.query(`TRUNCATE TABLE shopping_cart`);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
    // Create single new row
    try {
        result = await pool.query(`INSERT INTO shopping_cart (userid, item_count) VALUES ('123', 2)`);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
    // Create array of rows to insert, executing them in bulk
    let query = `INSERT INTO shopping_cart (userid, item_count) VALUES ('234', 5);`;
    query += `INSERT INTO shopping_cart (userid, item_count) VALUES ('345', 3);`;
    query += `INSERT INTO shopping_cart (userid, item_count) VALUES ('456', 6);`;
    try {
        result = await pool.query(query);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
    // Execute query to get table data
    try {
        result = await pool.query('SELECT * FROM shopping_cart');
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Obtained result: ', result);
    console.log('Shutting down');
    pool.end();
    process.exit(0);
}

main();
