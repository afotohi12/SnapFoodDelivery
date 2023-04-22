const {Schema , model} = require('mongoose');

const commentSchema = new Schema({
     userId : {type : String},
     resId : {type : String},
     menuId : {type : String},
     comment : {type : String},
     score : {type : Number},
     accept : {type : Boolean},

},
{timestamps : true}
);

const commentModel = model("comments",commentSchema);
module.exports = commentModel;