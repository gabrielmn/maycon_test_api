const express = require('express');
const router = express.Router();
const mysql = require('../../database/mysql')
const {auth} = require('../../middleware/auth')
const fs = require('fs/promises')


const LOCAL_STORAGE =  "images"


router.post("/", auth, async (req, res, next) => {

    let connection;
    try {
        const currentDate = new Date().toISOString().slice(0,10);
        const {category_id, name, image } = req.body;
        const image_path = `${LOCAL_STORAGE}/product_${name}.jpg`;
        await fs.writeFile(image_path, image, 'base64')
        let sql = 'INSERT INTO `products`(`category_id`, `name`, `image_path`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?);'
        sql = mysql.formatQuery(sql, [category_id, name, image_path, currentDate, currentDate]);
        connection = await mysql.connect();
        const [rows, fields] = await connection.query(sql);
        if (rows.affectedRows  === 1) {
            // product added successfully
            res.status(201).send({
                product_id: rows.insertId
            });
        } else {
                res.status(400).send("Something went wrong.:(");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    } finally {
        mysql.close(connection);
    }
})


router.post("/category", auth, async (req, res, next) => {

    let connection;
    try {
        const currentDate = new Date().toISOString().slice(0,10);
        const {name, image } = req.body;
        const image_path = `${LOCAL_STORAGE}/category_${name}.jpg`;
        await fs.writeFile(image_path, image, 'base64')
        let sql = 'INSERT INTO `categories`(`name`, `image_path`,`createdAt`, `updatedAt`) VALUES ( ?, ?, ?, ?);'
        sql = mysql.formatQuery(sql, [ name, image_path, currentDate, currentDate]);
        connection = await mysql.connect();
        const [rows, fields] = await connection.query(sql);
        if (rows.affectedRows  === 1) {
            // product added successfully
            res.status(201).send({
                product_id: rows.insertId
            });
        } else {
                res.status(400).send("Something went wrong.:(");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    } finally {
        mysql.close(connection);
    }
})

module.exports = router
