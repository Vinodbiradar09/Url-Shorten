import mongoose, {Schema , model} from "mongoose";

const shortUrlSchema = new Schema(
    
    {
       full_url : {
        type : String,
        required : true,
       },

       short_url : {
        type : String,
        required : true,
        unique : true,
        index : true,
       },
       clicks : {
        type : Number,
        required : true,
        default : 0,
       },
       
       user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
       }
    } ,
    
    
    {timestamps : true}

)

const ShortUrl = model("ShortUrl" , shortUrlSchema);

export default ShortUrl;

