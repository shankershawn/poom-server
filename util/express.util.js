module.exports = {
    getModule: async () => {
        const express = require('express');
        const module = express();
        const bodyParser = require('body-parser');
        module.use(bodyParser.json());
        module.use(bodyParser.urlencoded({extended: false}));
        await module.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", process.env.UI_URL);
            next();
        });
        return module;
    }
};