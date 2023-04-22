const yup = require('yup');

//بررسی اطلاعات رستوران جهت ثبت نام 
const resSignupSchema = yup.object().shape({
    resName: yup.string().min(3).required(),
    ownerName: yup.string().min(4),
    ownerFamily : yup.string().min(4),
    resAddress: yup.string().min(8),
    resUserName : yup.string().required(),
    resJavazNum : yup.number() .min(10).required(),
    email: yup.string().email().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
    password: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    ConfirmPassword : yup.string().required().oneOf([yup.ref('password'), null],"پسوردهای وارد شده برابر نیستند"),
    resPhoneNumber: yup.string().matches(/09[\d/0-9]/,"شماره تماس معتبر نیست!").required(),
    resType : yup.string().min(3).required()
    
});

module.exports = resSignupSchema;