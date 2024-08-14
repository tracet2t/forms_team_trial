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


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + db.threadId);
});


app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error"); 

        return res.json(data);  
    });
});

// Start the server on port 8083 (update log message to reflect the correct port)
app.listen(8084, () => {
    console.log('Listening on port 8083');
});
