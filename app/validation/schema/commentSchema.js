const yup = require('yup');


const commentSchema = yup.object().shape({
    comment : yup.string().min(15).max(150).required(),
    score    : yup.number().min(1).max(5),
    accept : yup.boolean(),
  
});

module.exports = commentSchema;


