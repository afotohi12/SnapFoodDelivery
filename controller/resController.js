const resModel = require("../module/resturantModel");
const loginSchema = require("../validation/loginSchema");
const signupSchema = require("../validation/signupSchema");
const { hashString, comphash, genToken } = require("../module/encrypt");
const yup = require('yup');
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");

const register = (req,res,next) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = register;