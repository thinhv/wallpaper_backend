const Post = require('../../models/Post');
const { after, afterEach, before, beforeEach, describe, it } = require('mocha');
const sinon = require('sinon');
const { expect, assert } = require('chai');
const {
  connectDatabase,
  closeDatabase,
  clearDatabase,
} = require('../dbHandler');

const postResolver = require('../../resolvers/Post');

let imageService = {
  uploadImage: () => {},
  deleteImage: () => {},
};
