/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const express = require('express');
const app = express();

const loadRoutes = async () => {
    app.use(await require('./router/register.route'));
    app.use(await require('./router/login.route'));
};
console.log("Loading routes");
loadRoutes().then(() => {
    app.listen(process.env.PORT || 5001, () => console.log('Server started on port ' + (process.env.PORT || 5001)));
}).catch((err) => {
    console.error(err);
});