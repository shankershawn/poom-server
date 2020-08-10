module.exports = (async () => {
    const modelUtil = require('../util/model.util');
    const https = require('https');
    var UserRegModel = await modelUtil.getModel('user_registration');
    var ssoUtils = {
        verifyGoogleToken: (token) => {
            return new Promise((resolve, reject) => {
                https.get("https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names,phoneNumbers&access_token=" + token, (resp) => {
                    var body = "";
                    resp.on("data", (data) => {
                        body +=data;
                    });
                    resp.on("end", () => {
                        var data = JSON.parse(body);
                        if(!!data && !!data.emailAddresses){
                            var userRegData = {};
                            data.emailAddresses.forEach(emailAddress => {
                                if(emailAddress.metadata.primary == true){
                                    userRegData["email"] = emailAddress.value;
                                }
                            });
                            if(!!data.names){
                                data.names.forEach((name) => {
                                    if(name.metadata.primary == true){
                                        userRegData["firstname"] = name.givenName;
                                        userRegData["lastname"] = name.familyName;
                                    }
                                });
                            }
                            if(!!data.phoneNumbers){
                                data.phoneNumbers.forEach((phoneNumber) => {
                                    if(phoneNumber.metadata.primary == true){
                                        userRegData["phone"] = phoneNumber.value;
                                    }
                                });
                            }
                            userRegData["accessLevel"] = "U";
                            UserRegModel
                                .update({email: userRegData.email}, userRegData, {upsert: true}, (err, upsertResult) => {
                                    if(err){
                                        reject();
                                    }else{
                                        resolve();
                                    }
                                })
                            ;
                        }else{
                            reject();
                        }
                    });
                }).on("error", (err) => {
                    reject();
                });
            });
        },
        revokeGoogleToken: (token) => {
            const https = require('https');
            return new Promise((resolve, reject) => {
                if(!!token){
                    https.get("https://accounts.google.com/o/oauth2/revoke?token=" + token)
                    .on("finish", () => {
                        resolve();
                    })
                    .on("error", (err) => {
                        reject();
                    });
                }
            });
        }
    };
    return ssoUtils;
})();