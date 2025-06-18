import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import cors from "cors"

dotenv.config("./.env")


const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // your React app
    credentials: true // 👈 this allows cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())


import authRoute from "./src/routes/auth.routes.js";
import shortUrlRoute from "./src/routes/shortUrl.routes.js"
import userRoute from "./src/routes/user.routes.js"
import {redirectFromShortUrl} from "./src/controllers/shortUrl.controller.js"

app.use("/api/v1/auth" , authRoute);

app.use("/api/v1/url" , shortUrlRoute);

app.use("/api/v1/user" , userRoute);

app.get("/:id" , redirectFromShortUrl);




app.listen(3000, ()=>{
    connectDB();
     console.log("Server is running on http://localhost:3000");
})

