// this is the helper function for try catch part 
const asyncHandler = (requestHandler) =>{
   return ( req , res , next) =>{
        Promise.resolve(requestHandler(req , res , next))
        .catch((err) => next(err));
    }
}

export {asyncHandler};

