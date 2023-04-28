const { Schema, model } = require("mongoose");
const { array } = require("../utils/multer");

//ساخت اطلاعات کاربر در پایگاه داده
const userSchema = new Schema({
    name: { type: String },
    age: { type: Number, default:19 },
    family: { type: String },
    address: [{
        subject : String,
        address: String,
        city: String
      }],
    userName :{ type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String },
    token : { type: String },
    avatar : { type : String,default : "http://127.0.0.1:3000/default/images.jpeg"},
    isRes : {type: Boolean , require : true , default : false}
},
    { timestamps: true }
);

const userModel = model("user", userSchema);
module.exports = userModel;

