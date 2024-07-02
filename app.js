const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path : './config.env'});

app.use(cors({origin : 'http://localhost:3000'}));
app.use(bodyParser.json());

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'zoomcar'
});

conn.connect((err) => {
    if(err)
        console.log('DB Connection failed:', err);
    else
        console.log('DB connected');
});

const encrypt = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log('Error encrypting password:', error);
    }
};

app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    let encryptedPassword = await encrypt(password);
    let sql = "INSERT INTO user (username, password, email) VALUES (?, ?, ?)";
    conn.query(sql, [username, encryptedPassword, email], (err, result) => {
        if(err) {
            return res.status(400).json({ err: "Registration Failed", error: err });
        } else {
            let sql1 = "SELECT user_id FROM user WHERE username = ?";
            conn.query(sql1, [username], (err, result) => {
                if(err) {
                    return res.status(400).json({ err: "Error fetching user ID", error: err });
                } else {
                    return res.status(200).json({ status: "Account successfully created", status_code: 200, user_id: result[0].user_id });
                }
            });
        }
    });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    let sql = "SELECT user_id, password FROM user WHERE username = ?";
    conn.query(sql, [username], async (err, results) => {
        if(err) {
            return res.status(400).json({ err: "Login Failed", error: err });
        } else {
            if(results.length > 0) {
                const validPassword = await bcrypt.compare(password, results[0].password);
                if(validPassword) {
                    const access_token = jwt.sign({ user_id: results[0].user_id }, process.env.secret_key);
                    return res.status(200).json({ status: "Login successful", status_code: 200, user_id: results[0].user_id, access_token: access_token });
                } else {
                    return res.status(401).json({ status: "Incorrect username/password provided. Please retry", status_code: 401 });
                }
            } else {
                return res.status(401).json({ status: "Incorrect username/password provided. Please retry", status_code: 401 });
            }
        }
    });
});



app.listen(8000, () => {
    console.log("Backend running successfully");
});
