const resturantRouter = require('express').Router();

resturantRouter.post("/register",(req,res) => {
    res.send("resturant register");
});

resturantRouter.post("/login" , (req,res) => {
    res.send("resturantLogin")
});



module.exports = resturantRouter;