const { Schema, model } = require("mongoose");

//جدول سبد خرید کاربر
const basketSchema = new Schema({
    resId    : {type: String },
    userId   : {type: String },
    menuId : {type: String},
    


    
}, {timestamps : true}
);


module.exports = basketSchema;
