import { v2 as cloudinary } from 'cloudinary'

import fs from 'fs'
import path from 'path'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_KEY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadonclodinary = async (localFilePath) => {
    try {
          if (!localFilePath) {
      console.log(" File path not provided")
      return null
    }
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto'
            })
            console.log("file is uploaded on clodinary", response.url)
            return response
        
    } catch (error) {

   fs.unlinkSync(localFilePath)
   return null
    }
}


export default uploadonclodinary