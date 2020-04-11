const AWS = require('aws-sdk');
const uuid = require('uuid');
// Set the region
AWS.config.update({ region: 'eu-north-1' });

// Create S3 service object
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ID,
  secretAccessKey: process.env.S3_SECRET,
});

const upload = (readStream, key, mimetype) => {
  let params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: uuid.v4() + '.' + key.split('.').pop(),
    Body: readStream,
    ContentType: mimetype,
  };
  console.log(key.split('.').pop());
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = upload;
