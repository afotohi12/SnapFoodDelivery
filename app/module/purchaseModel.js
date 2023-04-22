const { Schema, model } = require("mongoose");

//جدول پرداخت ها 
const purchaseSchema = new Schema({
    resId    : {type: String },
    userId   : {type: String },
    menuId : {type: String},
    
    
    
}, {timestamps : true});



module.exports = purchaseSchema;


