import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from  "../utils/aysncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) =>{
    
    const {username, email, fullName, password} = req.body;
    if([username, email, password, fullName].some((field) => field?.trim() === ""))
    throw new ApiError(400, "All fields are required")
    
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser)
    throw new ApiError(409, "Username or email already exists")

    const avatarLocalPath = req.files?.avatar[0]?.path
    //const coverImageLocalPath = req.files?.coverImage[0]?.path this code is risky if coverImage is not provided
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
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

export { registerUser}