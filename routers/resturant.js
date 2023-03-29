const {register} = require("../controller/resController");
const checkLogin = require("../validation/checkLogin");
const upload = require("../module/multer");
const imageValidation = require("../validation/fileValidation");

const resturantRouter = require("express").Router();

resturantRouter.post("/register",register);
//resturantRouter.post("/login",login);



module.exports = resturantRouter;