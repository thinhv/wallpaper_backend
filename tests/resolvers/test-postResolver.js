const Post = require('../../models/Post');
const { after, afterEach, before, describe, it } = require('mocha');
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

describe('Post test case', () => {
  before(async function () {
    await connectDatabase();
  });

  after(async function () {
    await closeDatabase();
  });

  afterEach(async function () {
    await clearDatabase();
  });

  describe('dummy test', function () {
    it('dummy test', async function () {
      expect(1 + 2).to.equal(3);
    });
  });
});
