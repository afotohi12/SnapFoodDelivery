const yup = require('yup');

//بررسی اطلاعات منو غذایی  
const menuSchema = yup.object().shape({
    foodName :yup.string().min(4).max(15).required(), 
    price : yup.number().required(),
    explain : yup.string().min(10).max(150).required(),
    score : yup.number().min(1).max(5).required(),
    category : yup.string().required(),
});

module.exports = menuSchema;
