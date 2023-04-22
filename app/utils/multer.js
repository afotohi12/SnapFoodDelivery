const path = require("path");
const multer = require("multer");
const { uploadFilePath } = require("./encrypt");



const storage = multer.diskStorage({
  //تعیین مسیر ذخیره فایل  
  destination: function (req, file, cb) {
    cb(null, uploadFilePath());
  },
  
  //بدست آوردن پسوند فایل 
  filename: function (req, file, cb) {
    const type = path.extname(file.originalname);
    cb(null, Date.now() + type);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
