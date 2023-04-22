const yup = require('yup')


const purchesSchema = yup.object().shape({
    menuCount : yup.number().required(),
    price : yup.string().required(),
    paymentMethod : yup.string().required(),
    bankName : yup.string().required(),
    payment : yup.string().required()
});

module.exports = purchesSchema;