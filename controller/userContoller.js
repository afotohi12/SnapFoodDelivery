const userModel = require("../module/userModel");
const loginSchema = require("../validation/loginSchema");
const signupSchema = require("../validation/signupSchema");
const { hashString, comphash, genToken } = require("../module/encrypt");
const yup = require('yup');
const { isValidObjectId } = require("mongoose");


//ثبت نام کاربر 
const signup = async (req, res, next) => {
    try {
        const { name, family, age, address, userName, email, password, confirmPassword, phoneNumber } = req.body;

        await signupSchema.validate({ name, family, age, address, userName, email, password, confirmPassword, phoneNumber }, { abortEarly: false });

        if (password != confirmPassword) throw { message: "password Not Equel" };
        if (await userModel.findOne({ userName })) throw { message: "user already exists" };
        if (await userModel.findOne({ email })) throw { message: "email already exists" };
        if (await userModel.findOne({ phoneNumber })) throw { message: "phone number already exists" };

        await userModel.create(
            {
                name,
                family,
                age,
                address,
                userName,
                email,
                phoneNumber,
                password: hashString(password),
            }
        );
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
        res.json(userSend);
        res.status(201).json({ success: true, message: "login successful" });
    } catch (error) {
        next({ status: 400, message: error.errors || error.message });
    }
};
//تغییر کلمه عبور
const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findOne({ userName: req.userName }, { createdAt: 0, updatedAt: 0, __v: 0 });
        if (!user) throw { message: "User not Found :(" };

        if (!comphash(oldPassword, user.password)) throw { message: "old password incorect :(" };

        await yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required().validate(newPassword);

        await userModel.updateOne({ _id: user._id }, { password: hashString(newPassword) });

        res.status(200).json({ success: true, message: "Password changed Successfuly :)" })
    } catch (error) {
        next({ status: 400, message: error.errors || error.message });

    }

};
//حذف اکانت کاربری
const deleteAcount = async (req, res, next) => {
    try {
        const result = await userModel.deleteOne({ userName: req.userName });

        if (!result.deletedCount) throw { message: "User deleted Unsuccessfull" };
        res.status(200).json({status:200, success: true, message: "user deleted Successfully", });

    } catch (error) {
        next({ status: 400, message: error.errors || error.message });
    }
};
//تغییر اطلاعات کاربری 
const changeProfile = async (req,res,next) => {
    try {
        const {name, family, age, address, phoneNumber} = req.body ;
        const result = await userModel.updateOne({ username: req.username },{ age, address, name, family,phoneNumber});
        if (!result.modifiedCount) throw {message : " profile updare failed"};
        res.status(200).json({status : 200 , success : true , message : " profile updated successfully"});

    } catch (error) {
        next({starus : 400, message : error.errors || error.message });
    }
};
//بررسی لاگین بودن کاربر 
const getProfile = async (req, res, next) => {
    try {
      const user = await userModel.findOne({ username: req.username },{ password: 0, updatedAt: 0, createdAt: 0, __v: 0 }
      );
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
 
module.exports = { signup, login, changePassword, deleteAcount,changeProfile,getProfile,getUser,getUsers };
