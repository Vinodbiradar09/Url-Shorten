

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {getAllUsersDao} from "../dao/user.doa.js"


const getAllUsersUrl = asyncHandler(async ( req , res)=>{
    const {_id} = req.user;

    if(!_id){
        throw new ApiError(403 , "Failed to get the all users url");
    }

    const urls = await getAllUsersDao(_id);

    if(!urls){
        throw new ApiError(403 , "Failed to get urls from DB");
    }

    res.status(200).json(new ApiResponse(200 , urls , "Successfully got the urls"));
})

export {getAllUsersUrl};