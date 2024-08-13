const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kani_0203", 
    database: "todolist_db"
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";
    db.query (sql,(err,data)  => {
    if(err) return app.json("Error");

    return app.json(data);
    })
});


app.listen(8083, () => {
    console.log('Listening on port 8082');
});
