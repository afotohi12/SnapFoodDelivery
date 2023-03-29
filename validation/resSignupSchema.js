const yup = require('yup');

//بررسی اطلاعات رستوران جهت ثبت نام 
const resSignupSchema = yup.object().shape({
    resName: yup.string().min(3).required(),
    ownerName: yup.string().min(4),
    ownerFamily : yup.string().min(4),
    resAddress: yup.string().min(8),
    resUserName : yup.string().min(5).required(),
    resJavazNum : yup.number() .min(10).required(),
    resEmail: yup.string().email().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
    resPassword: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    resConfirmPassword : yup.string().required().oneOf([yup.ref('resPassword'), null],"پسوردهای وارد شده برابر نیستند"),
    resPhoneNumber: yup.string().matches(/09[\d/0-9]/,"شماره تماس معتبر نیست!").required(),
    resType : yup.string().min(3).required()
});

module.exports = resSignupSchema;