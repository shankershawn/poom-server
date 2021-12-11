module.exports = (async () => {
    const dashboard = await require('../util/express.util').getModule();
    const modelUtil = require('../util/model.util');
    const verifyToken = require('../util/token.util').verifyToken;

    console.log("Loading Dashboard route");

    var UserRegModel = await modelUtil.getModel('user_registration');


    dashboard.post('/child', (req, res) => {
        verifyToken(req, res)
        .then(() => {
            
        })
        .catch((err) => {
            res.status(403).send({
                messageDetail: "You are not authorized to perform this operation. Please sign-in and try again."
            });
        });
    });


})();