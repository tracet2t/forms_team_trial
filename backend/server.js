const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(cors()); 
app.use(express.json()); 

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


const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

