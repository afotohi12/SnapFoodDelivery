const yup = require('yup');

//بررسی اطلاعات ورودی مدیر رستوران جهت ورود
const resLoginSchema = yup.object().shape({
    resEmail : yup.string().email("آدرس ایمیل به درستی وارد نشده است").required(),
    resPassword : yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
});

module.exports = resLoginSchema;