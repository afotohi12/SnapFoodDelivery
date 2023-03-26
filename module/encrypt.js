require('dotenv').config({ path: '../.env' });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashString = (str) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(str, salt);
};

const comphash = (date, hashString) => {
    return bcrypt.compareSync(date, hashString);

};


const genToken = (payload) => {
    return jwt.sign({date : payload,expireIn : "1y"}, process.env.SECRET_KEY);
};

const compToken = (payload) => {
    return jwt.verify(payload, process.env.SECRET_KEY);
    
};


module.exports = { hashString, comphash, genToken, compToken };