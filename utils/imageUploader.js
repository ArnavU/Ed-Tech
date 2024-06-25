const cloudinary = require("cloudinary").v2;

exports.ulploadImageToCloudinary = async (file, folder, height, quality) => {
    if(height) {
        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }

    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}