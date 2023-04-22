const { Schema, model } = require("mongoose");

//ساخت اطلاعات رستوران در پایگاه داده
const resSchema = new Schema({
    resName: { type: String },
    ownerName: { type: String },
    ownerFamily : { type: String},
    resAddress: { type: String },
    resUserName :{ type: String },
    email: { type: String },
    password: { type: String },
    resPhoneNumber: { type: String },
    resType : { type: String },
    resJavazNum : { type: String },
    token : { type: String },
    avatar : { type : String,default : "http://127.0.0.1:3000/default/images.jpeg"},
    isRes : {type: Boolean , require : true , default : true}
},
    { timestamps: true }
);

const resModel = model("resturant", resSchema);
module.exports = resModel;

