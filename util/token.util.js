module.exports = {
    verifyToken: async (req, res) => {
        const jwtUtil = require('./jwt.util');
        const ssoUtil = await require('./sso.util');
        return new Promise((resolve, reject) => {
            var token = req.header("authorization");
            var auth_type = req.header("x-auth-type");
            if(!token || !auth_type){
                reject();
            }else{
                if("g" == auth_type){
                    token = token.split("Bearer ")[1];
                    ssoUtil
                        .verifyGoogleToken(token)
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            reject(err)
                        })
                    ;
                }else if("n" == auth_type){
                    token = token.split("Bearer ")[1];
                    jwtUtil
                        .verify(token)
                        .then((data) => {
                            if(data.exp - Math.round(Date.now()/1000) < 900){
                                data.exp = Math.round(Date.now()/1000) + 3600;
                                setToken(data, res);
                            }
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        })
                    ;
                }else{
                    reject();
                }
            }
        });
    }
};