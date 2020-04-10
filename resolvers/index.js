const { GraphQLUpload } = require('graphql-upload');

module.exports = {
  Upload: GraphQLUpload,
  ...require('./User'),
  ...require('./Upload'),
};
