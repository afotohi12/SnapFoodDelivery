const { compToken } = require('../module/encrypt');
//بررسی لاگین بودن کاربر
const checkLogin = (req, res, next) => {
    try {
        const user = compToken(req.headers.authorization.slice(7));
        req.userName = user.date;
        next();
    } catch (error) {
        next({ status: 401, message: "Please Login" });
    }
};


module.exports = checkLogin;
