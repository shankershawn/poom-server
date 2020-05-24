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

    var UserRegModel = await modelUtil.getModel('user_registration');
    var PageModel  = await modelUtil.getModel('pages');
    
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
                jwtUtil
                    .sign(credentials)
                    .then((token) => {
                        PageModel.find({accessLevel: "U"}, {}, {lean: true}, (err, pageDataArray) => {
                            res.setHeader('cdf', token);
                            res.json({
                                pageDataArray,
                                messageDetail: "Welcome " + userRegDataArray[0].firstname
                            });
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(403).send({
                            messageDetail: "Something went wrong. Please try again later."
                        });
                    })
                ;
            }else{
                res.status(403).send({
                    messageDetail: "Your username or password is invalid."
                });
            }
        });
    });
    return login;
})();