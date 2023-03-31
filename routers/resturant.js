const {register,login,logout,insertMenu,resAllMenu,uploadfoodImag,uploadAvatar} = require("../controller/resController");
const checkLogin = require("../validation/checkLogin");
const upload = require("../module/multer");
const imageValidation = require("../validation/fileValidation");
const resturantRouter = require("express").Router();

resturantRouter.post("/register",register);
resturantRouter.post("/login",login);
resturantRouter.put("/logout",checkLogin,logout);
resturantRouter.post("/insertMenu",checkLogin,insertMenu);
resturantRouter.get("/resAllMenu",checkLogin,resAllMenu);
resturantRouter.post("/uploadAvatar",upload.single('avatar'),checkLogin,imageValidation,uploadAvatar);
resturantRouter.post("/menu/uploadfoodImag/:id",upload.single('foodImag'),checkLogin,imageValidation,uploadfoodImag);

module.exports = resturantRouter;