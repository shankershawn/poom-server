const mongoose = require('mongoose');
const mongodbUrl = process.env.DB_CONNECTION_URL;

module.exports = (async () => {
    await mongoose
    .connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: 300000,
        poolSize: 10
    })
    .then(() => {
        console.log("Connected to poomdb");
    }, (err) => {
        console.log("Failed to connect to db. Inside error block");
        console.log(err);
    }).catch((err) => {
        console.log("Failed to connect to db. Inside catch block");
        console.log(err);
    });
    return mongoose;
})();