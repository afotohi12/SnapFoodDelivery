require('dotenv').config();
const startApplication = require('./app');
const mongoose = require  ('mongoose');

//srver running from index.js 
startApplication();


//Connect database 
mongoose.connect(process.env.Address+process.env.App_dataBaseName, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });
