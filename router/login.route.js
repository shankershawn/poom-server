const express = require('express');
const jwtUtil = require('../util/jwt.util');
const login = express();
const bodyParser = require('body-parser');
const poomdb = require('../util/mongodb.util');

login.use(bodyParser.json());
login.use(bodyParser.urlencoded({extended: false}));

login.post('/login', (req, res) => {
    console.log(req.body);
    jwtUtil
        .sign(req.body)
        .then((token) => {
            res.json({
                message: "login accessed!",
                token
            });
        })
        .catch((err) => {
            res.sendStatus(403);
        })
    ;
    
});

module.exports = login;