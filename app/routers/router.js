const userRouter = require('../routers/user');
const resturantRouter = require('./resturant');
const {errorRes} = require('../../app/utils/erroeHandler');
const app = require('express').Router();
//مسیر کاربران
app.use("/user", userRouter);

//مسیر رستوران ها
app.use('/resturant', resturantRouter);

//نمایش تمام خطاها به صورت یکجا
app.use(errorRes);

module.exports = app;