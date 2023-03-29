const { Schema, model } = require("mongoose");

//ساخت اطلاعات رستوران در پایگاه داده
const resSchema = new Schema({
    resName: { type: String },
    ownerName: { type: String },
    ownerFamily : { type: String},
    resAddress: { type: String },
    resUserName :{ type: String },
    resEmail: { type: String },
    resPassword: { type: String },
    resPhoneNumber: { type: String },
    resType : { type: String },
    resJavaz : { type: String },
    token : { type: String },
    avatar : { type : String,default : "http://127.0.0.1:3000/default/images.jpeg"},
},
    { timestamps: true }
);

const resModel = model("resturant", resSchema);
module.exports = resModel;

