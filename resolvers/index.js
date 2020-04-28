'use strict';

const { GraphQLUpload } = require('graphql-upload');

module.exports = {
  Upload: GraphQLUpload,
  ...require('./User.js'),
  ...require('./Post.js'),
  ...require('./Upload'),
};
