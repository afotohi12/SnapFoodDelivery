const {signup,login,logout,passGen,changePassword,deleteAcount,changeProfile,basket,allmenu,getProfile,getuser,
  alluser,forgetPassword,verifyEmail,allpurchase,allCommentUser,insertComment} = require("../controller/userContoller");
const checkLogin = require("../validation/auth/checkLogin");
const upload = require("../utils/multer");
const imageValidation = require("../validation/auth/fileValidation");
//const signupSchema = require("../validation/signupSchema");

const router = require("express").Router();
//مسیر های کاربر
router.post("/signup",signup);
router.post("/login",login);
router.put("/logout",checkLogin,logout);
router.post("/changePassword",checkLogin,changePassword);
router.delete("/deleteAccount",checkLogin,deleteAcount);
router.post("/changeProfile",checkLogin,changeProfile);
router.post("/getProfile",checkLogin,getProfile);
router.post("/verifyEmail",checkLogin,verifyEmail);
router.post("/forgetPassword",forgetPassword);
router.get("/passGen",passGen);
router.get("/:id",getuser);
router.get("/allmenu/:id",checkLogin,allmenu);
router.get("/allpurchase/:id",checkLogin,allpurchase);
router.get("/",alluser);
router.get("/allCommentUser/:id",checkLogin,allCommentUser);
router.post("/insertComment",checkLogin,insertComment);
router.post("/basket",checkLogin,basket);
router.post("/uploadAvatar",upload.single('avatar'),imageValidation,(req, res, next) => {
      res.json({ message: "avatar updated" });
    }
  );

module.exports = router;