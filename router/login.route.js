module.exports = (async () => {
    const express = require('express');
    const jwtUtil = require('../util/jwt.util');
    const login = express();
    const bodyParser = require('body-parser');
    const poomdb = await require('../util/mongodb.util');
    
    console.log("Loading Login route");
    
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
    return login;
})();