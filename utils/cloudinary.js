import { v2 as cloudinary } from 'cloudinary';

    cloudinary.config({ 
        cloud_name: 'dddil7c88',
        api_key: '117912953955859',
        api_secret: '-S4_nXETy8V2IdzT21CJpbkMiCs'
    })

    const uploadOnCloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            stream.end(fileBuffer);
        });
    };
    
    export default uploadOnCloudinary;