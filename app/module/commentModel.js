const {Schema , model} = require('mongoose');

//Create comment model 
const commentSchema = new Schema({
     userId : {type : String},
     resId : {type : String},
     menuId : {type : String},
     replyId : {type : String},
     comment : {type : String},
     score : {type : Number},
     accept : {type : Boolean},

},
{timestamps : true}
);

const commentModel = model("comments",commentSchema);
module.exports = commentModel;