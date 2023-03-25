const yup = require('yup');

const loginSchema = yup.object().shape({
    email : yup.string().email("آدرس ایمیل به درستی وارد نشده است").required(),
    password : yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
});

module.exports = loginSchema;