const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (files, folder) => {
  //this function is expecting an array of files as and argument. It must be an array, hence the for of loop below.
  //to reinforce the fact that this must be an array, when using the multer middleware, use multer.any().
  //if the array is empty however, it returns undefined, so that the default value defined in the mongoose Models, would kick in! The code for this is right below.
  if (files.length === 0) return undefined;
  try {
    const imageData = [];
    for (const file of files) {
      const bufferInBase64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${bufferInBase64}`;

      //This is the same thing as the above. I just concatenated it for easier readability.
      const dataURL = "data:" + file.mimetype + ";base64," + bufferInBase64;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: `${folder}/`,
      });

      imageData.push({ url: result.secure_url, publicId: result.public_id });

      console.log("Image upload successful: ", result);
    }

    return imageData;
  } catch (error) {
    throw error;
  }
};

const cloudinaryDestroy = async (publicIds) => {
  if (publicIds === null || publicIds.length === 0) return;
  try {
    for (const publicId of publicIds) {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Image Deletion: ", result);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { cloudinaryUpload, cloudinaryDestroy };
