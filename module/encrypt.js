require('dotenv').config({ path: '../.env' });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');

//رمزنگاری اطلاعات
const hashString = (str) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(str, salt);
};
//مقایسه اطلاعات رمزنگاری شده 
const comphash = (date, hashString) => {
    return bcrypt.compareSync(date, hashString);

};

//ساخت توکن
const genToken = (payload) => {
    return jwt.sign({ date: payload, expireIn: "1y" }, process.env.SECRET_KEY);
};
//بررسی توکن 
const compToken = (payload) => {
    return jwt.verify(payload, process.env.SECRET_KEY);

};
//ساخت نام بر اساس تاریخ برای فایل
const uploadFilePath = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const fileAddress = path.join(__dirname, "..", "files", "uploads", "images", String(year), String(month + 1), String(day));

    require("fs").mkdirSync(fileAddress, { recursive: true });
    return path.join("files", "uploads", "images", String(year), String(month + 1), String(day));
};

module.exports = { hashString, comphash, genToken, compToken, uploadFilePath };