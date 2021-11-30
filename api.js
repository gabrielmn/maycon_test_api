const express = require('express');

const app = express();

app.use(require("./routes/routes"))
app.use(express.json());


app.listen(()=>{
    console.log('API online');
})