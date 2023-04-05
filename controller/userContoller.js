const userModel = require("../module/userModel");
const resModel = require("../module/resturantModel");
const loginSchema = require("../validation/loginSchema");
const signupSchema = require("../validation/signupSchema");
const { hashString, comphash, genToken } = require("../module/encrypt");
const yup = require('yup');
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const passwordGenerator = require("../module/passGen");

//ثبت نام کاربر 
const signup = async (req, res, next) => {
  try {
    const { name, family, age, address, userName, email, password, confirmPassword, phoneNumber } = req.body;
    await signupSchema.validate({ name, family, age, address, userName, email, password, confirmPassword, phoneNumber }, { abortEarly: false });
    //حالت معمول 
    // if (password != confirmPassword) throw { message: "password Not Equel" };
    // if (await userModel.findOne({ userName })) throw { message: "user already exists" };
    // if (await userModel.findOne({ email })) throw { message: "email already exists" };
    // if (await userModel.findOne({ phoneNumber })) throw { message: "phone number already exists" };

    //حالت بهینه
    const existingUser = await userModel.findOne({ $or: [{ userName }, { email }, { phoneNumber }], }, { userName: 1, email: 1, phoneNumber: 1 });

    if (existingUser) {
      if (existingUser.userName === userName) {
        throw new Error("Username already exists");
      }

      if (existingUser.email === email) {
        throw new Error("Email already exists");
      }

      if (existingUser.phoneNumber === phoneNumber) {
        throw new Error("Phone number already exists");
      }
    }

    await userModel.create({ name, family, age, address, userName, email, phoneNumber, password: hashString(password), });
    res.status(201).json({ success: true, message: "user created" });
  } catch (error) {
    next({ status: 400, message: error.errors || error.message });
  };
};

//لاگین شدن کاربر
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await loginSchema.validate({ email, password }, { abortEarly: false });
    const user = await userModel.findOne({ email }, { createdAt: 0, updatedAt: 0, __v: 0 });

    if (!user) throw { message: "User not found" };
    if (!comphash(password, user.password)) throw ({ message: "password is incorrect" });

    user.token = genToken(user.userName);
    user.save();
    const userSend = JSON.parse(JSON.stringify(user));
    delete userSend.password;
    //res.json(userSend);
    res.status(201).json({ success: true, message: "login successful" });
  } catch (error) {
    next({ status: 400, message: error.errors || error.message });
  }
};

//خروج کاربر 
const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    await userModel.updateOne({ userName: decodedToken.date }, { token: "" });
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "User Not Login" });
    }
    next({ status: 400, message: error.message });
  }
};


//تغییر کلمه عبور
const changePassword = async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body;
    const user = await userModel.findOne({ userName: req.userName }, { createdAt: 0, updatedAt: 0, __v: 0 });
    if (!user) throw { message: "User not Found :(" };

    if (!comphash(oldpassword, user.password)) throw { message: "old password incorect :(" };

    await yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required().validate(newpassword);

    await userModel.updateOne({ _id: user._id }, { password: hashString(newpassword) });

    res.status(200).json({ success: true, message: "password changed Successfuly :)" })
  } catch (error) {
    next({ status: 400, message: error.errors || error.message });

  }

};
//حذف اکانت کاربری
const deleteAcount = async (req, res, next) => {
  try {
    const result = await userModel.deleteOne({ userName: req.userName });

    if (!result.deletedCount) throw { message: "User deleted Unsuccessfull" };
    res.status(200).json({ status: 200, success: true, message: "user deleted Successfully", });

  } catch (error) {
    next({ status: 400, message: error.errors || error.message });
  }
};
//تغییر اطلاعات کاربری 
const changeProfile = async (req, res, next) => {
  try {
    const { name, family, age, address, phoneNumber } = req.body;
    const result = await userModel.updateOne({ username: req.username }, { age, address, name, family, phoneNumber });
    if (!result.modifiedCount) throw { message: " profile update failed" };
    res.status(200).json({ status: 200, success: true, message: " profile updated successfully" });

  } catch (error) {
    next({ starus: 400, message: error.errors || error.message });
  }
};
//بررسی لاگین بودن کاربر 
const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ username: req.username }, { password: 0, updatedAt: 0, createdAt: 0, __v: 0 });

    if (!user) throw { message: "user not found" };
    res.status(200).json(user);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};
//به دست آوردن اطلاعات کاربر
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw { message: "id is wrong" };
    const user = await userModel.findOne({ _id: id });
    if (!user) throw { message: "user not found" };
    res.status(200).json(user);
  } catch (error) {
    next({ message: error.message });
  }
};
//بدست آوردن اظلاعات تمام کاربران
const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    next({ message: error.message });
  }
};


//تایید ادرس ایمیل 
const verifyEmail = async (req, res, next) => {
  try {
    console.log("verifyEmail");
  } catch (error) {

  }
};

//فراموشی رمز عبور 
const forgetPassword = async (req, res, next) => {
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
    next({ status: 400, message: error.errors })
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

module.exports = { signup, login, logout, passGen, changePassword, deleteAcount, changeProfile, getProfile, getUser, getUsers, forgetPassword, verifyEmail };
