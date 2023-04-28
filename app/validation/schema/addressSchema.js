const yup = require('yup');


const addressSchema = yup.object().shape({
    subject: yup.string().min(2).max(12).required(),
    newaddress: yup.string().min(10).max(150).required(),
    city: yup.string().min(2).max(15).required(),
});

module.exports = addressSchema;