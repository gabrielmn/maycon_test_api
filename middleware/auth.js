const jwt = require("jsonwebtoken");

async function auth(req, res, next){
    try {

        if(!req.header('Authorization')){
            throw 401;
        }
        const token = req.header('Authorization').substr(req.header('Authorization').search(" ") + 1);
        const decoded = jwt.verify(token, 'token_key');       
        next();
    } catch (error) {
        if(error === 401){
            res.status(401).send({ error: 'Please authenticate.' });                
        }else if(error.errno){
            res.status(401).send({ error: 'Please authenticate.' });            
        }else if(error.message === 'invalid token' || error.message === 'invalid signature'){
            res.status(401).send({ error: 'Please authenticate.' });            
        }else if(error.message === 'jwt must be provided'){
            res.status(401).send({ error: 'Token missing.' });            
        }else if(error.message === 'jwt expired'){
            res.status(401).send({ error: 'Token expired.' });            
        }
        else{
            console.error("Header:",req.header('Authorization'))
            console.error(error)
            res.status(500).send();
        }
    }
};

module.exports = {
    auth
};
