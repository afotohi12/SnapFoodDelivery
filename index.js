require('dotenv').config();
const path = require('path');
const router = require('./routers/router');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());

//دسترسی دادن پوشه فایل به کاربر
app.use(express.static(path.join(__dirname, "files")));

//اتصال به بانک اطلاعاتی 
mongoose.connect("mongodb://localhost:27017/SnapFoodDelivery", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

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

//نشان دادن راه اندازی درست سرور
app.listen("3000", () => { console.log("server run on port 3000"); })



