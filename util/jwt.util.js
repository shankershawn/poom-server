const jwt = require('jsonwebtoken');

const secretKey = "jdkjswfJdfwNDTuVFW3fvsdc";

var jwtUtil  = {
    sign: (payload) => {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secretKey, (err, token) => {
                if(err){
                    reject(err);
                }else{
                    resolve(token);
                }
            });
        });
    },
    verify: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (err, payload) => {
                if(err){
                    reject(err);
                }else{
                    resolve(payload);
                }
            });
        });
    }
};

module.exports = jwtUtil;