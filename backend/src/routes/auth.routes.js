import {Router} from "express"
import {registerUser , loginUser , logoutUser , updatePassword , updateAccountDetails , refreshAccessToken , updateUserAvatar ,getCurrentUser} from "../controllers/auth.controller.js"
import {upload} from "../middleware/multer.middleware.js";
import {verifyJWT} from "../middleware/auth.middleware.js"



const router = Router();

router.route("/registerUser").post(
    upload.single("avatar"),
    registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post( verifyJWT , logoutUser );

router.route("/updatePassword").post(verifyJWT , updatePassword);

router.route("/updateAccountDetails").patch(verifyJWT , updateAccountDetails);

router.route("/refreshTokens").post(verifyJWT , refreshAccessToken );

router.route("/updateuserAvatar").patch(verifyJWT , upload.single("avatar"),updateUserAvatar );

router.route("/getcurrentUser").get(verifyJWT , getCurrentUser );
export default router;