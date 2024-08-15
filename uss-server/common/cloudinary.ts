import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
//STEP 1: TEMP. STORE FILE IN LOCAL SERVER
//STEP 2:
//function which uploads file from local server and remove(unlink) from local server on success:
const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null;
        //upload localfile to cloud
        const uploadResponse: any = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        //file uploaded
        console.log("File uploaded on cloud:", uploadResponse.url);
        return uploadResponse;
    } catch (error) {
        //remove locally saved temp file as upload fails:
        fs.unlinkSync(localFilePath);
        return null;
    }
}
export { uploadOnCloudinary };