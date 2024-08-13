const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql"); // Require mysql only once

app.use(cors());

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kani_0203",  // Use the correct password
    database: "todolist_db"
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

// Define a route
app.get("/", (req, res) => {
    res.json("hey backend");
});

// Start the server
app.listen(8083, () => {
    console.log('Listening on port 8082');
});
