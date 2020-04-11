const fs = require('fs');
const uploadMethod = require('../utils/FileUploader');

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
  const data = await uploadMethod(stream, filename, mimetype);
  return data.Location; // <--- image url
};

module.exports = {
  upload,
};
