import {nanoid} from "nanoid";


const generateNanoId = (length)=>{
    return nanoid(length);
}

export{generateNanoId};