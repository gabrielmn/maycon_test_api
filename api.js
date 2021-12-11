const express = require('express');
var cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());
app.use(require("./routes/routes"))

app.listen(3001,()=>{
    console.log('API online');
})