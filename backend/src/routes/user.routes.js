import { Router } from "express";
import {verifyJWT} from "../middleware/auth.middleware.js";
import {getAllUsersUrl} from "../controllers/user.controller.js"

const router = Router();

router.route("/urls").post(verifyJWT , getAllUsersUrl);

export default router;

