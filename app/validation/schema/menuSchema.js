const yup = require('yup');


const menuSchema = yup.object().shape({
    foodName : yup.string().required(),
    price    : yup.string().required(),
    explain  : yup.string().min(15).max(150).required(),
    score    : yup.number().min(1).max(5).required(),
    category : yup.string().max(30).required(),
  
});


module.exports = menuSchema;