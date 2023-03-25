const userRouter = require('./user');
const resturantRouter = require('./resturant');
const {notFound, errorRes} = require('../module/erroeHandler');
const app = require('express').Router();

app.use("/user", userRouter);
app.use("/resturant", resturantRouter);


app.use(notFound);
app.use(errorRes);

module.exports = app;