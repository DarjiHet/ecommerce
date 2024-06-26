const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxLength:[30,"Name Cannot exceed 30 characters"],
        minLength:[4,"Name Should have more then 4 characters"],
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a Valid Email"],
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password should ge greator than 8 characters"],
        select:false,
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }

    // the password will converted in 10 digit has format thats why we use 10 at the end
    this.password = await bcrypt.hash(this.password, 10);
})

// JWT TOKEN
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

// compareing Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hasing and adding resetPasswordToken to userSchema

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User",userSchema);