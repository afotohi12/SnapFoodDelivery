const userModel = require("../module/userModel");
const purchaseModel = require("../module/purchesModel");
const resModel = require("../module/resturantModel");
const menuModel = require("../module/menuModel");
const commentModel = require("../module/commentModel");
const coponModel = require("../module/coponModel");
const commentSchema = require("../validation/schema/commentSchema");
const loginSchema = require("../validation/schema/loginSchema");
const signupSchema = require("../validation/schema/signupSchema");
const purchesSchema = require("../validation/schema/purchesSchema");
const addressSchema = require("../validation/schema/addressSchema");
const { hashString, comphash, genToken } = require("../utils/encrypt");
const yup = require('yup');
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const passwordGenerator = require("../utils/passGen");

//Signup User 
const signup = async (req, res, next) => {
  try {
    const { name, family, age,subject ,address,city, userName, email, password, confirmPassword, phoneNumber } = req.body;
    await signupSchema.validate({ name, family, age, subject ,address,city, userName, email, password, confirmPassword, phoneNumber }, { abortEarly: false });

    if (password != confirmPassword) throw { message: "password Not Equel" };

    //حالت معمول 
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

      await userModel.create({ 
        name, family, age,
        address :[{subject,address,city}], 
        userName, email, phoneNumber, password: hashString(password), });
      res.status(201).json({ success: true, message: "user created" });
  } catch (error) {
    next({ status: 400, message: error.errors || error.message });
  };
};

//Login user 
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


//add Extra user address 
const addextraaddress = async (req, res, next) => {
    try {
      const {username,subject,newaddress,city} = req.body;
      await addressSchema.validate({subject,newaddress,city}, { abortEarly: false });
      const user = await userModel.findOne({ userName: username }, { createdAt: 0, updatedAt: 0, __v: 0 });
      if(!user) throw {message : "User not found"}; 
                    
        // Add the new address
        const address = [...user.address];
        address.push({ subject : subject,address: newaddress, city: city });
      
        // Update the user with the new address
        await userModel.updateOne(
          { userName: username },{ $set: { address } }
        );
     
      res.status(200).json({ success: true, message: "New address added successfully (`--`)" });
    } catch (error) {
      next({status : 400 ,message : error.errors || error.message});
    }

  };


//delete user address 
const deleteaddress = async (req, res, next) => {
try {
  // const {id}  = req.params;
  // if(!isValidObjectId(id)) throw {message : "Invalid Address Id"}
  // const addressS = await userModel.find({address : {$elemMatch : { _id : id}}},{address : 1});
  // console.log(addressS);
  // const addressIndex = addressS.address.findIndex(item => item._id === id);
  
  // console.log(addressIndex);

}catch (error) {
  next({status : 400 ,message : error.errors || error.message});
}

};

//update user address 
const updateaddress = async (req, res, next) => {
  try {
    
    
  } catch (error) {
    next({status : 400 ,message : error.errors || error.message});
  }
  
  };


//Logout user 
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


//user change Password 
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
//delete User 
const deleteAcount = async (req, res, next) => {
  try {
    const result = await userModel.deleteOne({ userName: req.userName });

    if (!result.deletedCount) throw { message: "User deleted Unsuccessfull" };
    res.status(200).json({ status: 200, success: true, message: "user deleted Successfully", });

  } catch (error) {
    next({ status: 400, message: error.errors || error.message });
  }
};
//change Profile user 
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
//Check User Login 
const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ username: req.username }, { password: 0, updatedAt: 0, createdAt: 0, __v: 0 });

    if (!user) throw { message: "user not found" };
    res.status(200).json(user);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};
//User Profile 
const getuser = async (req, res, next) => {
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
//All user Profile 
const alluser = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    next({ message: error.message });
  }
};


//Email Verification 
const verifyEmail = async (req, res, next) => {
  try {
    console.log("verifyEmail");
  } catch (error) {

  }
};

//User Forget PassWord 
const forgetPassword = async (req, res, next) => {
  try {
   

 

  } catch (error) {
    next({ status: 400, message: error.errors })
  }
};



//biuld random password generator
const passGen = async (req, res, next) => {
  try {
    const password = await passwordGenerator();
    res.status(200).json(password);
  } catch (error) {
    next({ status: 400, message: error.message || error.errors });
  }
};

//buy order for User 
const basket = async (req, res, next) => {
  try {
    const { userId, resId, menuId, menuCount, price, paymentMethod, bankName, payment } = req.body;
    //Check Wrong Id 
    const ids = [userId, resId, menuId];
    ids.forEach((id) => {
      ValidObjectId(id);
    });

    function ValidObjectId(id) {
      if (!isValidObjectId(id)) {
        throw { message: "Wrong Id" };
      };
    };

    await purchesSchema.validate({ menuCount, price, paymentMethod, bankName, payment }, { abortEarly: false });

    const user = await userModel.findOne({ _id: userId });
    if (!user) throw { message: "user not Found" };

    const resturant = await resModel.findOne({ _id: resId });
    if (!resturant) throw { message: "Resturant Not Found " };

    const menu = await menuModel.findOne({ _id: menuId });
    if (!menu) throw { message: "Menu Not Found " };

    await purchaseModel.create({ userId, resId, menuId, menuCount, price, paymentMethod, bankName, payment });

    res.status(201).json({ success: true, message: "Order Successful" });

  } catch (error) {
    next({ status: 400, message: error.message || error.errors });
  }
};
//All of menu user order return 
const allmenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    //Check Wrong Id 
    if (!isValidObjectId(id)) throw { message: "Wrong Id" };

    const allMenu = await menuModel.find({ userId: id });
    if (!allMenu) throw { message: "Nothing To Show " };
    res.status(201).json(allMenu);
  } catch (error) {
    next({ status: 400, message: error.message || error.errors });
  }
};


//All paying order for user 
const allpurchase = async (req, res, next) => {
  try {
    const { id } = req.params;
    //Check Wrong Id 
    if (!isValidObjectId(id)) throw { message: "Wrong Id" };
    const allpurchase = await purchaseModel.find({ userId: id });
    if (!allpurchase) throw { message: "Nothing To Show " };
    res.status(201).json(allpurchase);
  } catch (error) {
    next({ status: 400, message: error.message || error.errors });
  }
};


//all Comment from User 
const allCommentUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    //Check Wrong Id 
    if (!isValidObjectId(id)) throw { message: "Wrong Id" };
    const allComment = await commentModel.find({ userId: id });
    if (!allComment) throw { message: "Nothing To Show " };
    res.status(201).json(allComment);
  } catch (error) {
    next({ status: 400, message: error.message || error.errors });
  }
};


//insert Comment from User 
const insertComment = async (req, res, next) => {
  try {
    const { userId, resId, menuId, comment, score, accept } = req.body;
    //Check Wrong Id 
    const ids = [userId, resId, menuId];
    ids.forEach((id) => {
      ValidObjectId(id);
    });

    function ValidObjectId(id) {
      if (!isValidObjectId(id)) {
        throw { message: "Wrong Id" };
      };
    };

    await commentSchema.validate({ comment, score, accept });

    const user = await userModel.findOne({ _id: userId });
    if (!user) throw { message: "user not Found" };

    const resturant = await resModel.findOne({ _id: resId });
    if (!resturant) throw { message: "Resturant Not Found " };

    const menu = await menuModel.findOne({ _id: menuId });
    if (!menu) throw { message: "Menu Not Found " };

    await commentModel.create({ userId, resId, menuId, comment, score, accept });
    res.status(200).json({ success: true, message: "Comnent insert successfully" });
  } catch (error) {
    next({ status: 400, message: error.message || error.errors });
  };

};



//user Check CoponCode 
const checkCopon = async (req, res, next) => {
  try {
    const { copon } = req.body;

    const today = new Date();
    const date = today.toISOString().split('T')[0];


    const expCoponExist = await coponModel.findOne({ coponCode: copon });
    if (!expCoponExist) throw { message: "Copon Code is Not Valid" };

    if (expCoponExist.count >= expCoponExist.maxCount || expCoponExist.endTime < date) {
      throw { message: "Coupon code is either expired or full" };
    }
    
    res.status(200).json({ success: true, message: "Copon Code is Valid" });

  } catch (error) {
    next({ status: 400, message: error.message || error.errors });
  }

};


module.exports = {
  signup, login, logout, passGen, changePassword, allmenu, deleteAcount, changeProfile,
  getProfile, basket, allpurchase, getuser, allCommentUser, alluser, forgetPassword, verifyEmail,
  insertComment, checkCopon,addextraaddress,deleteaddress
};
