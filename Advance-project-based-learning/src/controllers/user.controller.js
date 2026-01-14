import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from  "../utils/aysncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import fs from 'fs';

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}
const registerUser = asyncHandler(async (req, res) =>{
    
    const {username, email, fullName, password} = req.body;
    //console.log(req.body); do it to see how body looks like
    if([username, email, password, fullName].some((field) => field?.trim() === ""))
    throw new ApiError(400, "All fields are required")
    
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser)
    {
        if(req.files?.avatar?.[0]?.path)
        {
            //delete the uploaded avatar file from local uploads folder if user already exists
            fs.unlinkSync(req.files.avatar[0].path)
        } 
        if(req.files?.coverImage?.[0]?.path)
        {
            //delete the uploaded avatar file from local uploads folder if user already exists
            fs.unlinkSync(req.files.coverImage[0].path)
        }    
        throw new ApiError(409, "Username or email already exists")
    }   
    //console.log(req.files); do it to see how files look like
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    /*also check like this 
    let coverImageLocalPath
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    */ 

    if(!avatarLocalPath)
    throw new ApiError(400, "Avatar file is required")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar)
    throw new ApiError(400, "Avatar file is required")
    const user = await User.create({
        fullName: fullName, // only fileName is also written because in ES6 if key and value are same then we can write only once   
        avatar: avatar.url,
        coverImage: coverImage?.url,
        password,
        email,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user")

    res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})

const loginUser = asyncHandler(async (req,res) => {
    const {username, email, password} = req.body;
    if(!username && !email)
    throw new ApiError(400, "Username or email is required")

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if(!user)
    throw new ApiError(404, "User does not exist")
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid)
    throw new ApiError(401, "Invalid credentials")
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const options = {
        httpOnly : true,
        secure : true
    }
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    res.status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, {user: loggedInUser, accessToken: accessToken, refreshToken: refreshToken}, "User logged in successfully")
    )
})

export { registerUser}