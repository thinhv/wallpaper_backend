'use strict';

const fs = require('fs');
const { uploadImage, deleteImage } = require('../utils/ImageService');

const storeFS = ({ stream, filename }) => {
  const uploadDir = __dirname + '/../media/photos';
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', (error) => reject(error))
      .on('finish', () => resolve({ path }))
  );
};

const upload = async (args, _) => {
  const { file, description } = args;
  const { filename, mimetype, createReadStream } = await file.file;
  const stream = createReadStream();
  const data = await uploadImage(stream, filename, mimetype);
  console.log(data);
  return { url: data.Location }; // <--- image url
};

module.exports = {
  upload,
};
