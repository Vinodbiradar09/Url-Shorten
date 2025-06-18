import mongoose , {Schema , model} from "mongoose";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const userSchema = new Schema(
    
    { 
        name : {
            type : String,
            required : true,
        },
        email : {
            type : String,
            unique : true,
            required : true,
        },
        password : {
            type : String,
            required : true
        },
        avatar : {
            type : String,
            required : true,
        },
        refreshTokens : {
            type : String,
        }
    } , 
    
    
    {timestamps : true}

)

userSchema.pre("save" , async function (next) {
    
    if(!this.isModified("password") ) return next();

  this.password = await bcrypt.hash(this.password , 10)
  next();
})




userSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password , this.password);
}
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            name : this.name,
            email : this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}


const User = model("User" , userSchema);

export {User};