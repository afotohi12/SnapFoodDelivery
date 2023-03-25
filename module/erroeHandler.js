

const notFound = (req,res) => {
    res.status(404).json({message : "not Found Address"})
};

const errorRes = (error,req,res,next) => {
    const status = error.status || 500;
    const message = error.message || "internal error";
    res.status(status).json({
        status,
        success : false,
        message,

    });
};


module.exports = {notFound, errorRes};