const express = require('express');
const router = express.Router();
const mysql = require('../../database/mysql')
const jwt = require('jsonwebtoken')

router.post("/login", async (req, res, next) => {

    let connection;
    try {
        const {username, password} = req.body;
        let sql = 'SELECT `id` FROM `users` WHERE `username`= ? AND `password`= ?; '
        sql = mysql.formatQuery(sql, [username, password]);
        connection = await mysql.connect();
        const [rows, fields] = await connection.query(sql);
        if (rows.length === 0) {
            // usersema or password wrong.
            res.status(400).send("User or password wrong.");
        } else {
                const token = jwt.sign({ id: rows[0].id}, "token_key", { expiresIn: "1d" });
                res.status(200).send({ id: rows[0].id, token: "Bear " + token });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    } finally {
        mysql.close(connection);
    }
    next();
})

module.exports = router
