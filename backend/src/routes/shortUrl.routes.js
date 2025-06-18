import { Router } from "express";
import {createShortUrl } from "../controllers/shortUrl.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";

const router = Router();
router.route("/createShortUrl").post( verifyJWT ,  createShortUrl);



export default router;

