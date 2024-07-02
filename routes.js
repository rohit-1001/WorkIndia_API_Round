const express = require('express')
const router = express.Router()
const conn = require('./db')
const bcrypt = require('bcryptjs')


//////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////

router.post('/register', async(req, res) => {
    const {username, password, email} = req.body
    const encryptedPassword = await bcrypt.hash(password, 10);
    let sql = "INSERT INTO user(username, password, email) VALUES ("+username+","+encryptedPassword+","+email+")";
    conn.query(sql, (err, result) => {
        if(err)
            return res.status(400).json({err : "Registration Failed"})
        else
            return res.status(200).json({status : "Account successfully created", status_code : 200, user_id : username})
    })
})

module.exports = router