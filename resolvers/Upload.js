const fs = require('fs');

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
  console.log('Hello world');
  const { file, description } = args;
  const { filename, mimetype, createReadStream } = await file.file;
  console.log(file);
  const stream = createReadStream();
  const pathObj = await storeFS({ stream, filename });
  const fileLocation = pathObj.path;
  return fileLocation;
};

module.exports = {
  upload,
};
