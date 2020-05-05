const jwt = require('jsonwebtoken');

const secretKey = "jdkjswfJdfwNDTuVFW3fvsdc";

var jwtUtil  = {
    sign: (payload) => {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secretKey, (err, token) => {
                if(!err){
                    resolve(token);
                }else{
                    reject(err);
                }
            });
        });
    },
    verify: (signature) => {
        console.log('Accessed verify');
    }
};

module.exports = jwtUtil;