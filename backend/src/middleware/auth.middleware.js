import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyJWT = asyncHandler ( async ( req , res , next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(403 , "UnAuthorized access from user");
        }
        const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshTokens");
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(403 , error.message || "Invalid access token")
    }
})