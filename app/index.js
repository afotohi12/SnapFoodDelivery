require('dotenv').config();
const path = require('path');
const router = require('./routers/router');
const express = require('express');
const app = express();

app.use(express.json());

//Permition to files folder 
app.use(express.static(path.join(__dirname, "files")));

//server running ....
module.exports =  () => {
  const port = process.env.App_Port ;
  app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});
};

//routing
app.use(router);

//Main Address 
app.get("/", (req, res) => {
  res.send("WellCome To Snap Food");
});

//unknown routes Address 
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find Address!");
});



