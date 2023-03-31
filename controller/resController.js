const resModel = require("../module/resturantModel");
const menuModel = require("../module/menuModel");
const loginSchema = require("../validation/loginSchema");
const resSignupSchema = require("../validation/resSignupSchema");
const menuSchema = require("../validation/menuSchema");
const { hashString, comphash, genToken } = require("../module/encrypt");
const yup = require('yup');
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const { all } = require("../routers/resturant");



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


//ورود اطلاعات غذا
const insertMenu = async (req,res,next) => {
    try {
        const {foodName,price,explain,score,category} = req.body;
        await menuSchema.validate({foodName,price,explain,score,category},{abortEarly : false});
        const menu = await menuModel.findOne({foodName}, { createdAt: 0, updatedAt: 0, __v: 0 });
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await resModel.findOne({ resUserName: decodedToken.date }, { createdAt: 0, updatedAt: 0, __v: 0 });
     
        if(menu) throw {message : "Food Name Is Exist !"};
        if(!["fastFood","sonaty","sobhaneh"].includes(category)) throw {message : " you Should Select between {fastFood,sonaty,sobhaneh}"}
        
        await menuModel.create({foodName,price,explain,score,category,resId : user._id});
        res.status(200).json({success : true , message : "Menu Created Successfully"});

    } catch (error) {
        next({status: 400, message: error.errors || error.message})
    }
}

//آپدیت عکس رستوران
const uploadAvatar = async (req,res,next) => {
    try {
        
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const resturant = await resModel.findOne({ resUserName: decodedToken.date }, { createdAt: 0, updatedAt: 0, __v: 0 });
        if(!resturant) throw {message : "User not found"};
        
        const image = req.file;
        const parts = image.path.split("/");
        parts.shift();
        const output = parts.join("/");

        await resModel.updateOne({ _id: resturant._id }, { avatar : "http://127.0.0.1:3000/" + output});
        //حذف عکس قبلی 
        // const fs = require('fs');
        // fs.unlink("../" +image.destination + image.filename, (err) => {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log("Delete File successfully.");
        // });

        res.status(200).json({success : true , message : "Avatar updated successfully"});

    } catch (error) {
        next({status: 400, message: error.errors || error.message});
    }
}

//لیست غذاهای رستوران 
const resAllMenu = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await resModel.findOne({resUserName : decodedToken.date}, { createdAt: 0, updatedAt: 0, __v: 0 });
        if(!user) throw {message : "User not found"};

        const allMenu = await menuModel.find({resId : user._id}, { createdAt: 0, updatedAt: 0, __v: 0 });
        res.status(200).json({success : true , message : allMenu});
        
    } catch (error) {
        next({status: 400, message: error.errors || error.message})
    }
};

//اضافه و یا بروزرسانی عکس غذا
const uploadfoodImag = async (req,res,next) => {
    try {

        const { id } = req.params;
        console.log(id);
        if (!isValidObjectId(id)) throw { message: "id is wrong" };
        const food = await menuModel.findOne({ _id: id });
        if (!food) throw { message: "food not found" };
        
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const resturant = await resModel.findOne({ resUserName: decodedToken.date }, { createdAt: 0, updatedAt: 0, __v: 0 });
        if(!resturant) throw {message : "Resturan User not found"};
        
        if(!food.resId === resturant._id) throw {message : "This menu not for this resturant"};

        const image = req.file;
        const parts = image.path.split("/");
        parts.shift();
        const output = parts.join("/");

        await menuModel.updateOne({ _id: food._id }, { foodImag : "http://127.0.0.1:3000/" + output});

      res.status(200).json({success : true , message : "food picture updated successfully"});
    } catch (error) {
        next({status: 400, message: error.errors || error.message})
    }
}



//خروج کاربر رستوران
const logout = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    
        await resModel.updateOne({resUserName : decodedToken.date},{token : ""});
        res.status(200).json({ success: true, message: "User logged out" });
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ success: false, message: "User Not Login" });
        }
        next({ status: 400, message: error.message });
      }
};


module.exports = { register, login ,insertMenu,resAllMenu,uploadfoodImag,uploadAvatar,logout};