const userRouter = require('./user');
const resturantRouter = require('./resturant');
const {errorRes} = require('../module/erroeHandler');
const app = require('express').Router();
//مسیر کاربران
app.use("/user", userRouter);

//مسیر رستوران ها
app.use("/resturant", resturantRouter);


//نمایش تمام خطاها به صورت یکجا
app.use(errorRes);

module.exports = app;