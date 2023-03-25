const compToken = require('../module/encrypt');

const checkLogin = (req,res,next) => {
    try {
        const user = compToken(req.headers.authorization.slice(7));
        req.userName = user.data;
        next();
    } catch (error) {
        next({status : 400,message : error.message || error.errors});
    }
};

module.exports = checkLogin;