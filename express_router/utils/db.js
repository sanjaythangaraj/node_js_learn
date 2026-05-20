// db.js
const mysql = require('mysql2/promise');

// create a connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "myuser",
    password: "mypassword",
    database: "mysqldb"
})

module.exports = pool;