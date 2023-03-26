require('dotenv').config();
const router = require('./routers/router');
const resturantRouter = require('./routers/resturant');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/SnapFoodDelivery", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => { 
    console.log(err);
  });

app.use(router);

app.get("/", (req, res) => {
    res.send("WellCome To Snap Food");
});

app.use((req, res) => {
    res.status(404).json({ message: "Adress not found :(" });
});
app.listen("3000", () => { console.log("server run on port 3000"); })


 
