/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const express = require('express');
const login = require('./router/login.route');
const register = require('./router/register.route');
const app = express();

app.use(login);
app.use(register);

app.listen(process.env.PORT || 5001, () => console.log('Server started on port ' + (process.env.PORT || 5001)));