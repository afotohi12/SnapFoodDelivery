const resModel = require("../module/resturantModel");
const menuModel = require("../module/menuModel");
const loginSchema = require("../validation/loginSchema");
const resSignupSchema = require("../validation/resSignupSchema");
const menuSchema = require("../validation/menuSchema");
const { hashString, comphash, genToken } = require("../module/encrypt");
const yup = require('yup');
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const passwordGenerator = require("../module/passGen");


//ثبت نام رستوران 
const register = async (req, res, next) => {
    try {
        const { resName, ownerName, ownerFamily, resAddress, resUserName, resJavazNum, email, password, ConfirmPassword, resPhoneNumber, resType } = req.body;
        await resSignupSchema.validate({ resName, ownerName, ownerFamily, resAddress, resUserName, resJavazNum, email, password, ConfirmPassword, resPhoneNumber, resType }, { abortErly: false });

        const existRest = await resModel.findOne({ $or: [{ resName }, { resUserName }, { resJavazNum }, { email }, { resPhoneNumber }] });
        if (existRest) {
            if (existRest.resName === resName) {
                throw new Error("Resturant Name Is Exist ");
            }
            if (existRest.resUserName === resUserName) {
                throw new Error("Resturant UserName Is Exist ");
            }
            if (existRest.resJavazNum === resJavazNum) {
                throw new Error("Resturant Javaz Number Is Exist ");
            }
            if (existRest.email === email) {
                throw new Error("Resturant email Is Exist ");
            }
            if (existRest.resPhoneNumber === resPhoneNumber) {
                throw new Error("Resturant PhoneNumber Is Exist ");
            }
        };
        await resModel.create({ resName, ownerName, ownerFamily, resAddress, resUserName, resJavazNum, email, password: hashString(password), resPhoneNumber, resType, });
        res.status(201).json({ succes: true, status: 200, message: "resturant Register SuccessFully" });

    } catch (error) {
        next({ status: 400, message: error.errors || error.message });
    }
};

//ورود رستوران
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await loginSchema.validate({ email, password }, { abortEarly: false });
        const resUser = await resModel.findOne({ email }, { createdAt: 0, updatedAt: 0, __v: 0 });

        if (!resUser) throw { message: "Resturant Not Found" };
        if (!comphash(password, resUser.password)) throw { message: "Your PassWord inCorect !" };

        resUser.token = genToken(resUser.resUserName);
        resUser.save();
        const resUserSend = JSON.parse(JSON.stringify(resUser));
        delete resUserSend.password;

        res.status(201).json({ succes: true, message: "Login SuccessFull" });
    } catch (error) {
        next({ status: 400, message: error.errors || error.message });
    }
};

//بررسی لاگین بودن کاربر 
const getProfile = async (req, res, next) => {
    try {
      const resturant = await resModel.findOne({ resUserName: req.userName }, { createdAt: 0, updatedAt: 0, __v: 0 });
      
      if (!resturant) throw { message: "user not found" };
      res.status(200).json(resturant);
    } catch (error) {
      next({ status: 400, message: error.message });
    }
  };

  

//بروزرسانی اطلاعات رستوران 
const changeProfile = async (req, res, next) => {
    try {
        const { resName,ownerName,ownerFamily,resAddress } = req.body;
        const result = await resModel.updateOne({ username: req.username }, { resName,ownerName,ownerFamily,resAddress });
        if (!result.modifiedCount) throw { message: "resturant profile update failed" };
        res.status(200).json({ status: 200, success: true, message: " profile updated successfully" });
    
      } catch (error) {
        next({ starus: 400, message: error.errors || error.message });
      }
}

//ورود اطلاعات غذا
const insertMenu = async (req, res, next) => {
    try {
        const { foodName, price, explain, score, category } = req.body;
        await menuSchema.validate({ foodName, price, explain, score, category }, { abortEarly: false });
        const menu = await menuModel.findOne({ foodName }, { createdAt: 0, updatedAt: 0, __v: 0 });
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await resModel.findOne({ resUserName: decodedToken.date }, { createdAt: 0, updatedAt: 0, __v: 0 });

        if (menu) throw { message: "Food Name Is Exist !" };
        if (!["fastFood", "sonaty", "sobhaneh"].includes(category)) throw { message: " you Should Select between {fastFood,sonaty,sobhaneh}" }

        await menuModel.create({ foodName, price, explain, score, category, resId: user._id });
        res.status(200).json({ success: true, message: "Menu Created Successfully" });

    } catch (error) {
        next({ status: 400, message: error.errors || error.message })
    }
}

//آپدیت عکس رستوران
const uploadAvatar = async (req, res, next) => {
    try {

        //const token = req.headers.authorization.split(" ")[1];
        //const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const resturant = await resModel.findOne({ resUserName: req.userName }, { createdAt: 0, updatedAt: 0, __v: 0 });
        if (!resturant) throw { message: "User not found" };

        const image = req.file;
        const parts = image.path.split("/");
        parts.shift();
        const output = parts.join("/");

        await resModel.updateOne({ _id: resturant._id }, { avatar: "http://127.0.0.1:3000/" + output });
        //حذف عکس قبلی 
        // const fs = require('fs');
        // fs.unlink("../" +image.destination + image.filename, (err) => {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log("Delete File successfully.");
        // });

        res.status(200).json({ success: true, message: "Avatar updated successfully" });

    } catch (error) {
        next({ status: 400, message: error.errors || error.message });
    }
}

//لیست غذاهای رستوران 
const AllMenu = async (req, res, next) => {
    try {
        //const token = req.headers.authorization.split(" ")[1];
        //const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await resModel.findOne({ resUserName: req.userName }, { createdAt: 0, updatedAt: 0, __v: 0 });
        if (!user) throw { message: "User not found" };

        const allMenu = await menuModel.find({ resId: user._id }, { createdAt: 0, updatedAt: 0, __v: 0 });
        res.status(200).json({ success: true, message: allMenu });

    } catch (error) {
        next({ status: 400, message: error.errors || error.message })
    }
};

//اضافه و یا بروزرسانی عکس غذا
const uploadfoodImag = async (req, res, next) => {
    try {

        const { id } = req.params;
        if (!isValidObjectId(id)) throw { message: "id is wrong" };
        const food = await menuModel.findOne({ _id: id });
        if (!food) throw { message: "food not found" };
        //استخراج آیدی رستوران
        //const token = req.headers.authorization.split(" ")[1];
        //const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const resturant = await resModel.findOne({ resUserName: req.userName }, { createdAt: 0, updatedAt: 0, __v: 0 });

        if (!resturant) throw { message: "Resturan User not found" };
        if (!(food.resId === resturant.id)) throw { message: "This menu not for this resturant" };

        //استخراج آدرس عکس آپلود شده 
        const image = req.file;
        const parts = image.path.split("/");
        parts.shift();
        const output = parts.join("/");

        await menuModel.updateOne({ _id: food._id }, { foodImag: "http://127.0.0.1:3000/" + output });
        res.status(200).json({ success: true, message: "food picture updated successfully" });
    } catch (error) {
        next({ status: 400, message: error.errors || error.message });
    }
}


//خروج کاربر رستوران
const logout = async (req, res, next) => {
    try {
        //const token = req.headers.authorization.split(" ")[1];
        //const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        await resModel.updateOne({ resUserName: req.userName }, { token: "" });
        res.status(200).json({ success: true, message: "User logged out" });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "User Not Login" });
        }
        next({ status: 400, message: error.errors || error.message });
    }
};

//جدف جساب کاربری 
const deleteAccount = async (req, res, next) => {
    try {
        //دلیل حذف پرسیده شود و در جدولی ذخیره شود اطلاعات رستوران

        //--
        const result = await resModel.deleteOne({ resUserName: req.userName });
        if (!result.deletedCount) throw { message: "user delete unsuccessfully " };
        res.status(200).json({ status: 200, success: true, message: "user deleted Successfully", });

        //تمام منو های غذایی مربوط به این رستوران حذف گردد

        //--
    } catch (error) {
        next({ status: 400, message: error.errors || error.message });
    }
}

//تمام کاربرانی که از این رستوران خرید انجام داده اند
const getUsers = async (req,res,next) => {
    try {
        const users = await menuModel.find({resId : req.userName}, { createdAt: 0, updatedAt: 0, __v: 0 });
        res.status(200).json(users);
      } catch (error) {
        next({ message: error.message });
      }
};

//تغییر رمز عبور کاربری رستوران 
const changePassword = async (req, res,next) => {
    try {
        const { oldpassword, newpassword } = req.body;
        const resturant = await resModel.findOne({ resUserName: req.userName }, { createdAt: 0, updatedAt: 0, __v: 0 });
        if (!resturant) throw { message: "User not Found :(" };
    
        if (!comphash(oldpassword, resturant.password)) throw { message: "old password incorect :(" };
    
        await yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required().validate(newpassword);
    
        await resModel.updateOne({ _id: resturant._id }, { password: hashString(newpassword) });
    
        res.status(200).json({ success: true, message: "password changed Successfuly :)" })
      } catch (error) {
        next({ status: 400, message: error.errors || error.message });
    
      }
    
}

//تایید ادرس ایمیل 
const verifyEmail = async (req,res,next) =>{
    try {
      console.log("verifyEmail");
    } catch (error) {
      
    }
};

//فراموشی رمز عبور 
const forgetPassword = async (req,res,next) => {
    try {
      console.log("forgetPassword");

      // var nodemailer = require('nodemailer');

      // var transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: 'youremail@gmail.com',
      //     pass: 'yourpassword'
      //   }
      // });
      
      // var mailOptions = {
      //   from: 'youremail@gmail.com',
      //   to: 'myfriend@yahoo.com',
      //   subject: 'Sending Email using Node.js',
      //   text: 'That was easy!'
      // };
      
      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });

    } catch (error) {
      next({status : 400 , message : error.errors})
     }
};

//ساخت رمز عبور تصادفی 
const passGen = async (req, res, next) => {
    try {
      const password = await passwordGenerator();
      res.status(200).json(password);
    } catch (error) {
      next({ status: 400, message: error.message || error.errors });
    }
  };


module.exports = { register, login,forgetPassword,passGen,getUsers,changeProfile,changePassword,
    verifyEmail,getProfile, deleteAccount, insertMenu, AllMenu, uploadfoodImag, uploadAvatar, logout };