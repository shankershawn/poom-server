module.exports = (async () => {
    const jwtUtil = require('../util/jwt.util');
    const ssoUtil = await require('../util/sso.util');
    const login = await require('../util/express.util').getModule();
    const modelUtil = require('../util/model.util');
    const cryptojs = require('crypto-js');
    const verifyToken = require('../util/token.util').verifyToken;
    
    console.log("Loading Login route");
    
    login.use((req, res, next) => {
        res.header("Access-Control-Allow-Headers", "authorization,x-auth-type");
        next();
    });

    var UserRegModel = await modelUtil.getModel('user_registration');
    var PageModel  = await modelUtil.getModel('pagesNew');

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

    login.get('/logout', (req, res) => {
        return new Promise((resolve, reject) => {
            var token = req.header("authorization");
            var auth_type = req.header("x-auth-type");
            token = token.split("Bearer ")[1];
            if("g" == auth_type){
                ssoUtil
                    .revokeGoogleToken(token) 
                    .then(() => {
                        res.status(200).send();
                    })
                    .catch((err) => {
                        res.status(400).send({
                            messageDetail: "Something went wrong. Please try again later."
                        });
                    })
                ;
            }else if("n" == auth_type){
                res.status(200).send();
                /*Code for revoke of JWT for future implementation. Currently not supported.*/
            }
        });
    });

    login.get('/verify', (req, res) => {
        verifyToken(req, res)
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err) => {
                console.log(err);
                res.status(403).send({
                    messageDetail: "You are not authorized to perform this operation. Please sign-in and try again."
                });
            });
    });

    login.get('/topmenu', (req, res) => {
        verifyToken(req, res)
        .then(() => {
            PageModel.find({accessLevel: "U"}, {'_id': 0, 'path': 1, 'detail': 1}, {lean: true, sort: {displayOrder: 1}}, (err, pageDataArray) => {
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
        .catch((err) => {
            res.status(403).send({
                messageDetail: "You are not authorized to perform this operation. Please sign-in and try again."
            });
        });
        
    });

    return login;
})();