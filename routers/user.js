const {signup,login,changePassword,deleteAcount} = require("../controller/userContoller");
const checkLogin = require("../validation/checkLogin");
const signupSchema = require("../validation/signupSchema");

const router = require("express").Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/changePassword",checkLogin,changePassword);
router.post("/deleteAccount",checkLogin,deleteAcount)
//router.post("/changeProfile");

module.exports = router;