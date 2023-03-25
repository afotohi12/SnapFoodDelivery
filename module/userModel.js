const { Schema, model } = require("mongoose");
const { string } = require("yup");


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
},
    { timestamps: true }
);

const userModel = model("user", userSchema);
module.exports = userModel;

