const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());

mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kani_0203",
    database: "todolist_db"
})

app.get("/", (req,res) => {
    res.json("hey backend");

})

const PORT = 8082;
app.listen(8082, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
