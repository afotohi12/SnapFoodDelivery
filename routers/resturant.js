const {register,login,insertMenu,resMenu,uploadfoodImag,uploadAvatar} = require("../controller/resController");
const checkLogin = require("../validation/checkLogin");
const upload = require("../module/multer");
const imageValidation = require("../validation/fileValidation");
const resturantRouter = require("express").Router();

resturantRouter.post("/register",register);
resturantRouter.post("/login",login);
resturantRouter.post("/insertMenu",checkLogin,insertMenu);
resturantRouter.get("/resMenu",checkLogin,resMenu);
resturantRouter.post("/uploadAvatar",upload.single('avatar'),checkLogin,imageValidation,uploadAvatar);
resturantRouter.post("/menu/uploadfoodImag",checkLogin,imageValidation,uploadfoodImag);

module.exports = resturantRouter;