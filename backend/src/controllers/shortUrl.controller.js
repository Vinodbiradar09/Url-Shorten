import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {createShortUrlWithUser , createShortUrlWithoutUser} from "../services/shortUrl.service.js"
import dotenv from "dotenv";
import { getShortUrl } from "../dao/shortUrl.doa.js";
dotenv.config();


const createShortUrl = asyncHandler(async( req , res)=>{
    //get the data url from frontend 
    // make a variable , agar user hai tho createShortUrlWithUser , usme data ka url bej and req.user._id bej
    // agar user nahi hai tho sirf url bej 
    // send res of App.Url + shortUrl 
    const data = req.body;
    if(!data){
        throw new ApiError(403 , "url data field is required");
    }
    let shortUrl;
    if(req.user){
         console.log("user" , req.user);
        shortUrl = await createShortUrlWithUser(data.url , req.user._id , data.slug);
    } else {
        console.log("h" , req.user);
        shortUrl = await createShortUrlWithoutUser(data.url);
    }

    res.status(200).json(new ApiResponse(200 , {shortUrl : process.env.APP_URL + shortUrl} , "successfully url generated"));

})


const redirectFromShortUrl = asyncHandler(async ( req , res)=>{
    const {id} = req.params;
    if(!id){
        throw new ApiError(403 , "Invalid Id or unavailable");
    }
    const url = await getShortUrl(id);
    if(!url){
        throw new ApiError(404 , "Failed to get the shortUrl for redirect");
    }
    console.log('re' , url);
    console.log("ur" , url.full_url);
    res.status(302).redirect(url.full_url);
})


const createCustomShortUrl = asyncHandler(async ( req , res)=>{
    const {url,slug} = req.body;

    const shortUrl = await createShortUrlWithoutUser(url,customUrl)

    res.status(200).json(new ApiResponse(200 , {shortUrl : process.env.APP_URL + shortUrl} , "Successfully got the custom short url"));

})



export{createShortUrl , redirectFromShortUrl , createCustomShortUrl};