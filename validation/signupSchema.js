const yup = require('yup');

//بررسی اطلاعات کاربر جهت ثبت نام 
const signupSchema = yup.object().shape({
    name : yup.string().min(2),
    family : yup.string().min(4),
    age : yup.number().min(1),
    address : yup.string().min(8),
    userName : yup.string().min(5).required(),
    email : yup.string().email().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
    password : yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    confirmPassword : yup.string().required().oneOf([yup.ref('password'), null],"پسوردهای وارد شده برابر نیستند"),
    phoneNumber : yup.string().matches(/09[\d/0-9]/,"شماره تماس معتبر نیست!").required()


});

//بررسی اطلاعات رستوران جهت ثبت نام 
const resSchema = yup.object().shape({
    resName: yup.string().min(3).required(),
    ownerName: yup.string().min(4),
    ownerFamily : yup.string().min(4),
    resAddress: yup.string().min(8),
    resUserName : yup.string().min(5).required(),
    resJavazNum : yup.number() .min(10).required(),
    resEmail: yup.string().email().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
    resPassword: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    confirmPassword : yup.string().required().oneOf([yup.ref('password'), null],"پسوردهای وارد شده برابر نیستند"),
    resPhoneNumber: yup.string().matches(/09[\d/0-9]/,"شماره تماس معتبر نیست!").required(),
    resType : yup.string().min(3).required()
});

module.exports = {signupSchema,resSchema};