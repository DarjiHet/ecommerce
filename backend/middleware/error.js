const ErrorHandler = require("../utils/errorhander");

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

// wrong mongodb id error or cast error
if(err.name == "CastError"){
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message,400);
}

// Mongoose duplicate key error
if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
    err = new ErrorHandler(message,400);
}

// Wrong JWT error
if(err.code === "JsonWebTokenError"){
    const message = `Json wen token is invalid, try again`;
    err = new ErrorHandler(message,400);
}

// JWT Expire token
if(err.code === "JsonWebTokenError"){
    const message = `Json wen token is expired, try again`;
    err = new ErrorHandler(message,400);
}

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};