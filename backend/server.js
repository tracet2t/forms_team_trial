const express = require ("express");
const app  = express();
const cors = require ("cors");
const mysql = require ("mysql");


app.use(cors());

app.listen( 8081,()  =>  {
    console.log ("Listening");


})