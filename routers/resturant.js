const {register,login,logout,verifyEmail,getProfile,changeProfile,getUsers,forgetPassword,changePassword,deleteAccount,insertMenu,AllMenu,uploadfoodImag,uploadAvatar} = require("../controller/resController");
const checkLogin = require("../validation/checkLogin");
const upload = require("../module/multer");
const imageValidation = require("../validation/fileValidation");
const resturantRouter = require("express").Router();

resturantRouter.post("/register",register);
resturantRouter.post("/login",login);
resturantRouter.put("/logout",checkLogin,logout);
resturantRouter.post("/verifyEmail",checkLogin,verifyEmail);
resturantRouter.post("/getProfile",checkLogin,getProfile);
resturantRouter.post("/changeProfile",checkLogin,changeProfile);
resturantRouter.get("/getUsers",getUsers);
resturantRouter.post("/forgetPassword",forgetPassword);
resturantRouter.post("/changePassword",checkLogin,changePassword);
resturantRouter.delete("/deleteAccount",checkLogin,deleteAccount);
resturantRouter.post("/insertMenu",checkLogin,insertMenu);
resturantRouter.get("/AllMenu",checkLogin,AllMenu);
resturantRouter.post("/uploadAvatar",upload.single('avatar'),checkLogin,imageValidation,uploadAvatar);
resturantRouter.post("/menu/uploadfoodImag/:id",upload.single('foodImag'),checkLogin,imageValidation,uploadfoodImag);






module.exports = resturantRouter;