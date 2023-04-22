const { Schema, model } = require("mongoose");
//const { number } = require("yup");

//Create Food Menu 
const menuSchema = new Schema({
    foodName : { type: String },
    price    : { type: String },
    explain  : { type: String },
    score    : { type: Number },
    category : { type: String },
    foodImag : { type : String,default : "http://127.0.0.1:3000/default/foodDefault.png"},
    isActive : {type: Boolean , require : true , default : true},
    resId    : {type: String , default : "resId"},
    userId   : {type: String , default : "userId"},
},
    { timestamps: true }
);

const menuModel = model("menu", menuSchema);
module.exports = menuModel;

