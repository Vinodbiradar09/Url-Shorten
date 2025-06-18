import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js";
import { cookieOptions } from "../config/cookie.config.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();




const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(403, "failed to generate tokens becoz userId is invalid")
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();


        user.refreshTokens = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating the access token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get the name and email , password and avatar from body check it 
    //now check if the existing user is there or not 
    // if not then create new user and upload avatar on cloudinary 
    // check if user is created or not 
    // now send res

    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All the fields are required to create the User");
    }

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required ");
    }

    const existingUser = await User.findOne(
        {
            $or: [{ email }, { name }]
        }
    );

    if (existingUser) {
        throw new ApiError(403, "User already exists you can't create new account");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        console.log("avatar", avatar);
        console.log("local", avatarLocalPath);
        throw new ApiError(404, "Failed to upload on cloudinary");
    }




    const user = await User.create({
        name: name,
        email: email,
        avatar: avatar.secure_url,
        password: password,

    })


    const createdUser = await User.findById(user._id).select("-password -refreshTokens");

    if (!createdUser) {
        throw new ApiError(404, "Failed to create user");
    }

    res.status(200).json(new ApiResponse(200, {createdUser}, "User created successfully"));


})


const loginUser = asyncHandler(async (req, res) => {
    // get the details of the name email and password check it 
    // find the user , by the email 
    // if found match the password 
    // generate the access token and refresh token for the loggedIn user Id 

    const { email, password } = req.body;

    if ([email, password].some((field) => field.trim() === "")) {
        throw new ApiError(401, "All the fields are required to Login the user");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(403, "The user is not registered please register the user after that login");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {

        throw new ApiError(404, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

    if (!accessToken && !refreshToken) {
        throw new ApiError(403, "empty accessToken and refreshtoken");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshTokens");

    return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "successfully logged in the user"));



})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshTokens: 1,
            }
        },
        {
            new: true,
        }
    )



    return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // first get the refresh token from cookies , check it 
    // now verify using jwt and get the user 
    // now match the refresh token from browser and db 
    // and now generate the new access token using the above method by sending the user._id 
    // and send res 

    const incomingRefreshTokens = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshTokens) {
        throw new ApiError(403, "Invalid refresh tokens or not available")
    }

    try {

        const decodedToken = jwt.verify(incomingRefreshTokens, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(403, "Unauthorized user or invalid tokens");
        }

        if (incomingRefreshTokens !== user.refreshTokens) {
            console.log("in", incomingRefreshTokens)
            console.log("ac", user.refreshTokens);
            throw new ApiError(401, "Inavlid refresh tokens");
        }
        const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

        console.log('new', refreshToken);
        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(200, { accessToken: accessToken, refreshToken: refreshToken }, "Access Token refreshed ")
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const updatePassword = asyncHandler(async (req, res) => {
    // first get the oldpassword and newpassword , check it 
    // find the user from middleware check it 
    // now verify the oldpassword , check for correctness 
    // now update the new password and save it 
    // send a res

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword && !newPassword) {
        throw new ApiError(403, "old password and new password is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "UnAuthroized user");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(404, "Inavlid oldpassword");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    // get the name and email from frontend , check it 
    // now findById and update , check it if updated or not 
    // send res

    const { name, email } = req.body;
    const update = {};

    if (name) {
        update.name = name;
    }

    if (email) {
        update.email = email;
    }

    if (!Object.keys(update).length === 0) {
        throw new ApiError(400, "At least one field (name or email) is required to update");
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            name: update.name,
            email: update.email,
        }
    },
        {
            new: true,
        }).select("-password -refreshTokens");

    if (!user) {
        throw new ApiError(403, "failed to update the user details")
    }

    res.status(200).json(new ApiResponse(200, user, "Successfully updated the user details"));
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    // first get the newavatarfile path  from body , check it 
    // upload in cloudinary , check it 
    // using set operator update it 
    // and delete from cloudinary also 
    // and send res

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(403, "local path is not available");
    }

    const oldAvatarUrl = req.user.avatar;

    if (!oldAvatarUrl) {
        throw new ApiError(403, "Old avatar is empty");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(404, "failed to upload on cloudinary");
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar.secure_url,
        }
    },
        {
            new: true,
        }
    )
    if (!user) {
        throw new ApiError(404, "Failed to update the user avatar");
    }

    const deletedOldAvatar = await deleteOnCloudinary(oldAvatarUrl);
    if (!deletedOldAvatar) {

        throw new ApiError(404, "failed to delete the old avatar on cloudinary");
    }

    res.status(200).json(new ApiResponse(200, user, "suucessfully updated the new avatar"));
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(403, "Failed to get the current user");
    }

    res.status(200).json(new ApiResponse(200, user, "current user got successfully"));
})


export { registerUser, loginUser, logoutUser, updatePassword, updateAccountDetails, refreshAccessToken, updateUserAvatar, getCurrentUser };

