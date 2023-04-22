const { Schema, model } = require("mongoose");

//purches Model 
const purchaseSchema = new Schema({
    resId    : {type: String },
    userId   : {type: String },
    menuId : {type: String},
    menuCount : {type: Number},
    price : {type: String},
    paymentMethod : {type: String},
    bankName : {type: String},
    payment : {type: String},
    
}, {timestamps : true});


const purchaseModel = model('payment',purchaseSchema)
module.exports = purchaseModel;


