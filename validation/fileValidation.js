const path = require('path');
const fs = require('fs');

const imageValidation = (req,res,next) =>{
    try {
        const image = req.file;
        const type = image.mimetype.split("/")[1];
        const size = image.size;
        
        if (!["jpg","png"].includes(type)) {
        fs.unlinkSync(req.file.path);
        throw {status:400 ,message: "Invalid image type , you selected image type is: " + type +", should be select png or jpg"};
        };
        
        if (size > 65770) {
            fs.unlinkSync(req.file.path);
            throw {status : 400 , message : "Invalid image size , you selected image size is: " + size + ", should be lower than 50 KB"}
        };

    next();
    } catch (error) {
        next({status : 400,message : error.errors || error.message});
        
    }
};


module.exports = imageValidation ;