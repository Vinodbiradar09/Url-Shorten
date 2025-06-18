import  ShortUrl  from "../models/urlshort.model.js"

export const getAllUsersDao =  async (userId)=>{
  return await ShortUrl.find({user : userId});
}