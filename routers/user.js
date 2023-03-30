const {signup,login,logout,changePassword,deleteAcount,changeProfile,getProfile,getUser,getUsers,forgetPassword,verifyEmail} = require("../controller/userContoller");
const checkLogin = require("../validation/checkLogin");
const upload = require("../module/multer");
const imageValidation = require("../validation/fileValidation");
//const signupSchema = require("../validation/signupSchema");

const router = require("express").Router();
//مسیر های کاربر
router.post("/signup",signup);
router.post("/login",login);
router.put("/logout",checkLogin,logout);
router.post("/changePassword",checkLogin,changePassword);
router.delete("/deleteAccount",checkLogin,deleteAcount)
router.post("/changeProfile",checkLogin,changeProfile);
router.post("/getProfile",checkLogin,getProfile);
router.post("/verifyEmail",checkLogin,verifyEmail);
router.post("/forgetPassword",forgetPassword);
router.get("/:id",getUser);
router.get("/",getUsers);
router.post("/uploadAvatar",upload.single('avatar'),imageValidation,(req, res, next) => {
      res.json({ message: "avatar updated" });
    }
  );

module.exports = router;