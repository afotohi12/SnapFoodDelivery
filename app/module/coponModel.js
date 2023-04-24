const {Schema,model} = require('mongoose');

//Create copon Model
const coponSchema = new Schema({
    resId : {type:String},
    coponCode: {type:String},
    minBuy : {type:Number},
    percent : {type:Number},
    maxCount : {type:Number},
    endTime : {type:String},
    price : {type:Number},
    userId : {type:String},
    count : {type:Number},
    menuId : {type:String},
    category : {type:String},
    
},
{timestamps:true});

const coponModel = model('copon',coponSchema);
module.exports = coponModel; 