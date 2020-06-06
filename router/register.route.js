module.exports = (async () => {
    const express = require('express');
    const register = express();
    const bodyParser = require('body-parser');
    const poomdb = await require('../util/mongodb.util');
    const registrationHelper = require('../helper/registration.helper');
    const cryptojs = require('crypto-js');
    const modelUtil = require('../util/model.util');
    
    console.log("Loading Register route");
    
    var UserRegModel = await modelUtil.getModel('user_registration');

    register.use(bodyParser.json());
    register.use(bodyParser.urlencoded({extended: false}));
    register.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", process.env.UI_URL);
        next();
    });
    var messages = [];
    
    register.post('/register', (req, res) => {
        messages = registrationHelper.validateInput(req.body);
        if(messages.length > 0){
            res.status(400).send(messages);
        }else{
            var userRegData = new UserRegModel(req.body);
            userRegData.password = cryptojs.SHA512(userRegData.password).toString(cryptojs.enc.Base64);
            userRegData.save()
                .then(() => {
                    console.log('Data saved!');
                    messages.push({messageDetail: 'Welcome aboard.   - From Poom! :).'})
                    res.json(messages);
                })
                .catch((err) => {
                    console.log(err);
                    messages.push({messageDetail: 'Something went wrong. Please try again later.'})
                    res.status(500).send(messages);
                });
        }
    });

    register.get('/validate/:key/:value', (req, res) => {
        const param = req.params;
        var mongoSearchParam;
        var messageDetail;
        var isValid = true;
        if(param && param.key && param.value){
            if(param.key == "email"){
                mongoSearchParam = {"email": decodeURIComponent(param.value)};
                messageDetail = "The email address entered by you already exists in our records. Please enter a different email address.";
            }else if(param.key == "phone"){
                mongoSearchParam = {"phone": decodeURIComponent(param.value)};
                messageDetail = "The phone number entered by you already exists in our records. Please enter a different phone number.";
            }else if(param.key == "username"){
                mongoSearchParam = {"username": decodeURIComponent(param.value)};
                messageDetail = "The username entered by you already exists in our records. Please enter a different username.";
            }
            if(mongoSearchParam){
                UserRegModel.countDocuments(mongoSearchParam, (err, count) => {
                    if(count > 0){
                        isValid = false;
                        res.json({isValid, messageDetail});
                    }else{
                        res.json({isValid});
                    }
                });
            }else{
                isValid = false;
                messageDetail = "Invalid parameters";
                res.json({isValid, messageDetail});
            }
        }
    });
    return register;
})();
