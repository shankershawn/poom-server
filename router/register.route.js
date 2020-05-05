const express = require('express');
const jwtUtil = require('../util/jwt.util');
const register = express();
const bodyParser = require('body-parser');
const poomdb = require('../util/mongodb.util');
const registrationHelper = require('../helper/registration.helper');

var UserRegModel;
const collectionName = 'user_registration';
poomdb.model('schemas', new poomdb.Schema({name: String}), 'schemas').findOne({"name": collectionName}, (err, colldata) => {
    if(err) throw err;
    const schema = JSON.parse(JSON.stringify(colldata)).definition;
    UserRegModel = poomdb.model(collectionName, new poomdb.Schema(schema), collectionName);
});

register.use(bodyParser.json());
register.use(bodyParser.urlencoded({extended: false}));
register.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8000");
    next();
});
var messages = [];

register.post('/register', (req, res) => {
    messages = registrationHelper.validateInput(req.body);
    if(messages.length > 0){
        res.status(400).json(messages);
    }else{
        var userRegData = new UserRegModel(req.body);
        userRegData.save()
            .then(() => {
                console.log('Data saved!');
                messages.push({messageDetail: 'Welcome aboard.   - From Poom! :).'})
                res.status(200).json(messages);
            })
            .catch((err) => {
                console.log(err);
                messages.push({messageDetail: 'Something went wrong. Please try again later.'})
                res.status(500).json(messages);
            });
    }
});

module.exports = register;