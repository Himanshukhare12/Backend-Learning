import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath)=>{
    try{
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // Remove file from local uploads folder
        //do console.log(response.url to see the public url of uploaded file)
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch(error){
        console.error("Error uploading to Cloudinary:", error);
        if(localFilePath)
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export { uploadOnCloudinary };