module.exports = (async () => {
    const express = require('express');
    const jwtUtil = require('../util/jwt.util');
    const login = express();
    const bodyParser = require('body-parser');
    const poomdb = await require('../util/mongodb.util');
    const modelUtil = require('../util/model.util');
    const messages = [];
    const cryptojs = require('crypto-js');
    
    console.log("Loading Login route");
    
    login.use(bodyParser.json());
    login.use(bodyParser.urlencoded({extended: false}));
    login.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", process.env.UI_URL);
        res.header("Access-Control-Allow-Headers", "authorization");
        next();
    });

    var UserRegModel = await modelUtil.getModel('user_registration');
    var PageModel  = await modelUtil.getModel('pages');

    var setToken = (payload, res) => {
        return new Promise((resolve, reject) => {
            payload.exp = Math.round(Date.now()/1000) + 3600;
            jwtUtil
                .sign(payload)
                .then((token) => {
                    res.setHeader("Access-Control-Expose-Headers", "X-Bixi");
                    res.setHeader('X-Bixi', token);
                    resolve();
                })
                .catch((err) => {
                    console.error(err);
                    reject();
                })
            ;
        });
    };
    
    login.post('/login', (req, res) => {
        const credentials = req.body;
        credentials.password = cryptojs.SHA512(credentials.password).toString(cryptojs.enc.Base64);
        UserRegModel.find(credentials, {}, {lean: true}, (err, userRegDataArray) => {
            if(err){
                console.error(err);
                res.status(403).send({
                    messageDetail: "Something went wrong. Please try again later."
                });
            }else if(userRegDataArray.length == 1){
                setToken(credentials, res)
                .then(() => {
                    res.json({
                        messageDetail: "Welcome " + userRegDataArray[0].firstname
                    });
                })
                .catch(() => {
                    res.status(403).send({
                        messageDetail: "Something went wrong. Please try again later."
                    });
                });
                
            }else{
                res.status(403).send({
                    messageDetail: "Your username or password is invalid."
                });
            }
        });
    });

    var verifyToken = (req, res) => {
        return new Promise((resolve, reject) => {
            var token = req.header("authorization");
            token = token.split("Bearer ")[1];
            if(!token){
                reject();
            }else{
                jwtUtil
                    .verify(token)
                    .then((data) => {
                        if(data.exp - Math.round(Date.now()/1000) < 900){
                            data.exp = Math.round(Date.now()/1000) + 3600;
                            setToken(data, res);
                        }
                        resolve();
                    })
                    .catch((err) => {
                        reject();
                    })
                ;
            }
        });
    };

    login.get('/verify', (req, res) => {
        verifyToken(req, res)
            .then(() => {
                res.sendStatus(200);
            })
            .catch(() => {
                res.status(403).send({
                    messageDetail: "You are not authorized to perform this operation. Please sign-in and try again."
                });
            });
    });

    login.get('/topmenu', (req, res) => {
        verifyToken(req, res)
        .then(() => {
            PageModel.find({accessLevel: "U"}, {'_id': 0, 'iconClass': 1, 'id': 1, 'isDefault': 1, 'label': 1, 'name': 1}, {lean: true, sort: {displayOrder: 1}}, (err, pageDataArray) => {
                if(err){
                    res.status(500).send({
                        messageDetail: "Something went wrong. Please try again later."
                    });
                }
                res.json({
                    pageDataArray
                });
            });
        })
        .catch(() => {
            res.status(403).send({
                messageDetail: "You are not authorized to perform this operation. Please sign-in and try again."
            });
        });
        
    });

    return login;
})();