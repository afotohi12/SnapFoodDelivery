const resModel = require("../module/resturantModel");
const resLoginSchema = require("../validation/resLoginSchema");
const resSignupSchema = require("../validation/resSignupSchema");
const { hashString, comphash, genToken } = require("../module/encrypt");
const yup = require('yup');
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");


//ثبت نام رستوران 
const register = async(req,res,next) => {
    try {
        const {resName,ownerName,ownerFamily,resAddress,resUserName,resJavazNum,resEmail,resPassword,resConfirmPassword,resPhoneNumber,resType}= req.body;
        await resSignupSchema.validate({resName,ownerName,ownerFamily,resAddress,resUserName,resJavazNum,resEmail,resPassword,resConfirmPassword,resPhoneNumber,resType},{abortErly : false});

        const existRest = await resModel.findOne({$or : [{resName},{resUserName},{resJavazNum},{resEmail},{resPhoneNumber}]});
        if (existRest){
            if (existRest.resName === resName){
                throw new Error("Resturant Name Is Exist ");
            }
            if (existRest.resUserName === resUserName){
                throw new Error("Resturant UserName Is Exist ");
            }
            if (existRest.resJavazNum === resJavazNum){
                throw new Error("Resturant Javaz Number Is Exist ");
            }
            if (existRest.resEmail === resEmail){
                throw new Error("Resturant Email Is Exist ");
            }
            if (existRest.resPhoneNumber === resPhoneNumber){
                throw new Error("Resturant PhoneNumber Is Exist ");
            }
        };

        await resModel.create({resName,ownerName,ownerFamily,resAddress,resUserName,resJavazNum,resEmail,resPassword : hashString(resPassword),resPhoneNumber,resType,});
        res.status(201).json({succes : true , status : 200 ,message : "resturant Register SuccessFully"});

    } catch (error) {
        next({status : 400 , message : error.errors || error.message });
    }
};

const login = async (req,res,next) => {
try {
    const {resEmail,resPassword} = req.body;
    await resLoginSchema.validate({resEmail,resPassword} , {abortEarly : false});

    const resUser = await resModel.findOne({resEmail},{ createdAt: 0, updatedAt: 0, __v: 0 });
    if (!resUser) throw {message : "Resturant Not Found"};
    if(!comphash(resPassword,resUser.resPassword)) throw {message : "Your PassWord inCorect !"};

    resUser.token = genToken(resUser.resUserName);
    resUser.save();
    const resUserSend = JSON.parse(JSON.stringify(resUser));
    delete resUserSend.resPassword;

    res.status(201).json({succes : true, message : "Login SuccessFull"});
} catch (error) {
    next({status : 400 , message : error.errors || error.message});
}
};

module.exports = {register,login};