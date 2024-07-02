const express = require('express');
const mysql = require('mysql')
const router = express.Router()

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'zoomcar'
})

conn.connect((err) => {
    if(err)
        console.log('DB Connection failed')
    else
        console.log('DB connected')
})
const app = express()
app.get('/createDB', (req, res) => {
    let sql = "CREATE DATABASE zoomcar;"
    conn.query(sql, (err, result) => {
        if(err)
            return res.status(400).json({err : "Database creation failed", error : err})
        return res.status(200).json({status : "Database created successfully"})
    })
})