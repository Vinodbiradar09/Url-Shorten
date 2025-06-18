import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


import urlSchema from "../models/urlshort.model.js";
 

const saveShortUrl = async (shortUrl, longUrl, userId) => {
   try {
     const newUrl = new urlSchema({
      full_url: longUrl,
      short_url: shortUrl,
     })
     
     if(userId) {
      newUrl.user = userId;
     }
     
     // Fix: Always save, not just when userId exists
     await newUrl.save();
    //  return newUrl; // Return the saved document
     
   } catch (error) {
    if (error.code === 11000) {
        throw new ApiError(409, `Slug "${shortUrl}" is already taken`);
    }
    throw error;
   }
}

const getShortUrl = async (shortUrlID)=>{
    return await urlSchema.findOneAndUpdate({short_url : shortUrlID} , {$inc : {clicks : 1}});
}

const getCustomShortUrl = async (slug) =>{
 return await urlSchema.findOne({short_url : slug});
}


export {saveShortUrl , getCustomShortUrl , getShortUrl};