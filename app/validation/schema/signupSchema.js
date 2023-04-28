const yup = require('yup');

//بررسی اطلاعات کاربر جهت ثبت نام 
const signupSchema = yup.object().shape({
    name : yup.string().min(2),
    family : yup.string().min(4),
    age : yup.number().min(1),
    subject: yup.string().min(2).max(12).required(),
    address: yup.string().min(10).max(150).required(),
    city: yup.string().min(2).max(15).required(),
    userName : yup.string().min(5).required(),
    email : yup.string().email().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
    password : yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    confirmPassword : yup.string().required().oneOf([yup.ref('password'), null],"پسوردهای وارد شده برابر نیستند"),
    phoneNumber : yup.string().matches(/09[\d/0-9]/,"شماره تماس معتبر نیست!").required()
    

});

module.exports = signupSchema;