import { ApiError } from "../utils/ApiError.js";
import { generateNanoId } from "../utils/helper.js";
import { getCustomShortUrl , saveShortUrl } from "../dao/shortUrl.doa.js";


const createShortUrlWithoutUser = async (url) =>{
    const shortUrl = generateNanoId(7);
    if(!shortUrl){
        throw new ApiError(404 , "ShortUrl is not generated");
    }
    await saveShortUrl(shortUrl , url);
    return shortUrl;

}

const createShortUrlWithUser = async(url , userId , slug=null)=>{
     const shortUrl = slug || generateNanoId(7);
     const exists = await getCustomShortUrl(slug);
     if(exists){
        throw new ApiError(403  , "This custom url already exists");
     }
    //  console.log("us" , userId);
     await saveShortUrl(shortUrl , url , userId);
     return shortUrl;
}

export {createShortUrlWithUser , createShortUrlWithoutUser};