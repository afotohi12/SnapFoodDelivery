const yup = require('yup');

const coponSchema = yup.object().shape({
    alias : yup.string().min(3).max(10).required(),
    minBuy :    yup.number().required(),
    percent : yup.number(),
    maxCount : yup.number().required(),
    endTime : yup.string().matches(/\d{4}-\d{2}-\d{2}/).required(),
    price : yup.number().required(),
});

module.exports = coponSchema;