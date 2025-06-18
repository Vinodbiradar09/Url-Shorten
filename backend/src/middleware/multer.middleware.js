import multer from "multer";

const storage = multer.diskStorage({
    destination : (req , file , cb) =>{
        cb(null , "./public/temp")
    },
    filename : (req , file , cb)=>{
        // crypto.randomBytes(12 , (err , bytes) =>{
        //     const uniqueFileName = bytes.toString("hex") + path.extname(file.originalname);
        //     console.log("unique" , uniqueFileName);
        //     cb(null , uniqueFileName)
        // })

        const uniqueFileName = file.originalname;
        cb(null , uniqueFileName);

    }
})

export  const upload = multer ({storage : storage});