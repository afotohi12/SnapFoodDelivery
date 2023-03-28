const { Schema, model } = require("mongoose");
//const path = require("path");
//const { string } = require("yup");

//ساخت اطلاعات کاربر در پایگاه داده
const userSchema = new Schema({
    name: { type: String },
    age: { type: Number, default:19 },
    family: { type: String },
    address: { type: String },
    userName :{ type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String },
    token : { type: String },
    avatar : { type : String,default : "http://127.0.0.1:3000/default/images.jpeg"},
},
    { timestamps: true }
);

const userModel = model("user", userSchema);
module.exports = userModel;

