const {register,login,logout,verifyEmail,getProfile,changeProfile,getUsers,forgetPassword,passGen,changePassword,
    allPayment,deleteAccount,insertMenu,AllMenu,uploadfoodImag,uploadAvatar,replyComment,coponCode,showExPirecopon,
    showAllCopn} = require("../controller/resController");
const checkLogin = require("../validation/auth/checkLogin");
const upload = require("../utils/multer");
const imageValidation = require("../validation/auth/fileValidation");
const resturantRouter = require("express").Router();

resturantRouter.post("/register",register);
resturantRouter.post("/login",login);
resturantRouter.put("/logout",checkLogin,logout);
resturantRouter.post("/verifyEmail",checkLogin,verifyEmail);
resturantRouter.post("/getProfile",checkLogin,getProfile);
resturantRouter.post("/changeProfile",checkLogin,changeProfile);
resturantRouter.get("/getUsers",getUsers);
resturantRouter.post("/forgetPassword",forgetPassword);
resturantRouter.get("/passGen",passGen);
resturantRouter.post("/changePassword",checkLogin,changePassword);
resturantRouter.post("/replyComment/:id",checkLogin,replyComment);
resturantRouter.delete("/deleteAccount",checkLogin,deleteAccount);
resturantRouter.post("/insertMenu",checkLogin,insertMenu);
resturantRouter.get("/AllMenu",checkLogin,AllMenu);
resturantRouter.post("/coponCode",checkLogin,coponCode);
resturantRouter.get("/showExPirecopon/:id",showExPirecopon);
resturantRouter.get("/showAllCopn/:id",checkLogin,showAllCopn);
resturantRouter.get("/allPayment/:id",checkLogin,allPayment);
resturantRouter.post("/uploadAvatar",upload.single('avatar'),checkLogin,imageValidation,uploadAvatar);
resturantRouter.post("/menu/uploadfoodImag/:id",upload.single('foodImag'),checkLogin,imageValidation,uploadfoodImag);






module.exports = resturantRouter;