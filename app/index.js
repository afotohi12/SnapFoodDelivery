require('dotenv').config();
const path = require('path');
const router = require('./routers/router');
const express = require('express');
const app = express();

app.use(express.json());

//دسترسی دادن پوشه فایل به کاربر
app.use(express.static(path.join(__dirname, "files")));

//server running ....
module.exports =  () => {
  const port = process.env.App_Port ;
  console.log(port);
  app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});
};

//مسیریابی
app.use(router);

//آدرس اصلی 
app.get("/", (req, res) => {
  res.send("WellCome To Snap Food");
});

//پیدا نکردن آدرس وارد شده
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find Address!");
});



