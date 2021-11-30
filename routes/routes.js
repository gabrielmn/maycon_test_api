const express = require('express');
const router = express.Router();

router.use('/user', require("./controllers/user"));
router.use('/product', require("./controllers/product"));

module.exports = router;
