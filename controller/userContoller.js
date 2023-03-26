const userModel = require("../module/userModel");
const loginSchema = require("../validation/loginSchema");
const signupSchema = require("../validation/signupSchema");
const {hashString,comphash, genToken} = require("../module/encrypt");
const yup = require('yup');



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
                password : hashString(password),
            }
        );
        res.status(201).json({ success: true, message: "user created" });
    } catch (error) {
        next({status : 400 , message : error.errors || error.message});
    };
};


const login = async (req,res,next) => {
    try {
        const {email,password} = req.body;
        await loginSchema.validate({email,password},{abortEarly : false});
    
    const user = await userModel.findOne({email},{createdAt : 0,updatedAt:0,__v:0});
    if (!user) throw { message: "User not found" };
    if (!comphash(password,user.password)) throw ({ message: "password is incorrect" });

    user.token = genToken(user.userName);
    user.save();
    const userSend = JSON.parse(JSON.stringify(user));
    delete userSend.password;
    res.json(userSend);
        res.status(201).json({success : true , message : "login successful" });
    } catch (error) {
        next({status : 400 , message : error.errors || error.message});
    }
};

const changePassword = async(req,res,next) => {
    try {
        const {oldPassword,newPassword} =req.body;
        const user = await userModel.findOne({userName : req.userName},{createdAt : 0,updatedAt:0,__v:0});
        if (!user) throw {message : "User not Defined"};

        if (!comphash(oldPassword,user.password)) throw {message : "old password incorect :("};
        
        await yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required().validate(newPassword);
        
        await userModel.updateOne({ _id: user._id }, { password: hashString(newPassword) }); // به‌روزرسانی رمز

        res.status(200).json({success : true , message: "Password changed Successfuly :)"})
    } catch (error) {
        next({status : 400 , message : error.errors || error.message});

    }
  
};


  
module.exports = {signup,login,changePassword};
