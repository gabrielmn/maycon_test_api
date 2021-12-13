const express = require('express');
const router = express.Router();
const mysql = require('../../database/mysql')
const { auth } = require('../../middleware/auth')
const fs = require('fs/promises')
const { uriExtractor } = require('../../shared/uri');

const LOCAL_STORAGE = "images"


router.post("/", async (req, res, next) => {

    let connection;
    try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const { categoryId, name, image } = req.body;
        const data = uriExtractor(image);
        const image_path = `${LOCAL_STORAGE}/product_${name}.${data[1]}`;
        await fs.writeFile(image_path, data[0], 'base64')
        let sql = 'INSERT INTO `products`(`category_id`, `name`, `image_path`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?);'
        sql = mysql.formatQuery(sql, [categoryId, name, image_path, currentDate, currentDate]);
        connection = await mysql.connect();
        const [rows, fields] = await connection.query(sql);
        if (rows.affectedRows === 1) {
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

router.get("/", async (req, res, next) => {
    let connection;
    try {
        let sql = 'SELECT `category_id`, `name`, `image_path` FROM `products`;'
        sql = mysql.formatQuery(sql);
        connection = await mysql.connect();
        const [rows, fields] = await connection.query(sql);
        if (rows.length !== 0) {
            let payload = await Promise.all(rows.map(async (item, index, array) => {
                let image = await fs.readFile(item.image_path, 'base64');
                let extension = item.image_path.lastIndexOf('.');
                extension = item.image_path.substring(extension + 1);
                return {
                    categoryId: item.category_id,
                    name: item.name,
                    image: `data:image/${extension};base64,${image}`
                }
            }))
            // product added successfully
            res.status(200).send(payload);
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


router.post("/category", async (req, res, next) => {

    let connection;
    try {
        const currentDate = new Date().toISOString().slice(0, 10);
        const { name, image } = req.body;
        const data = uriExtractor(image);
        const image_path = `${LOCAL_STORAGE}/category_${name}.${data[1]}`;
        await fs.writeFile(image_path, data[0], 'base64')
        let sql = 'INSERT INTO `categories`(`name`, `image_path`,`createdAt`, `updatedAt`) VALUES ( ?, ?, ?, ?);'
        sql = mysql.formatQuery(sql, [name, image_path, currentDate, currentDate]);
        connection = await mysql.connect();
        const [rows, fields] = await connection.query(sql);
        if (rows.affectedRows === 1) {
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

router.get("/category", async (req, res, next) => {
    let connection;
    try {
        let sql = 'SELECT `name`, `image_path` FROM `categories`;'
        sql = mysql.formatQuery(sql);
        connection = await mysql.connect();
        const [rows, fields] = await connection.query(sql);
        if (rows.length !== 0) {
            let payload = await Promise.all(rows.map(async (item, index, array) => {
                let image = await fs.readFile(item.image_path, 'base64');
                let extension = item.image_path.lastIndexOf('.');
                extension = item.image_path.substring(extension + 1);
                return {
                    name: item.name,
                    image: `data:image/${extension};base64,${image}`
                }
            }))
            // product added successfully
            res.status(200).send(payload);
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
