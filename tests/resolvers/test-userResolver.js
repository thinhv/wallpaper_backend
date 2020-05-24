const User = require('../../models/User');
const { after, afterEach, before, beforeEach, describe, it } = require('mocha');
const sinon = require('sinon');
const { expect, assert } = require('chai');
const {
  connectDatabase,
  closeDatabase,
  clearDatabase,
} = require('../dbHandler');

// SUT
const userResolver = require('../../resolvers/User');

let imageService = {
  uploadImage: () => {},
  deleteImage: () => {},
};
let validRegisterPayload = {
  firstName: 'Thinh',
  lastName: 'Vo',
  username: 'thinh',
  email: 'ducthinh2410@gmail.com',
  password: '123456',
  bio: 'I am Thinh Vo',
  userType: 'user',
  profileImageUrl: 'https://voducthinh.com',
};
let req = {};
let res = {};
let authController = {
  login: (req, res) => {},
  checkAuth: (req, res) => {},
};

describe('User test case', () => {
  before(async function () {
    await connectDatabase();
  });

  after(async function () {
    await closeDatabase();
  });

  afterEach(async function () {
    await clearDatabase();
  });

  beforeEach(function () {
    validRegisterPayload = {
      firstName: 'Thinh',
      lastName: 'Vo',
      username: 'thinh',
      email: 'thinh.vo@gmail.com',
      password: '123456',
      bio: 'I am Thinh Vo',
      userType: 'user',
      profileImageUrl: 'https://voducthinh.com',
    };
  });

  describe('when user is not found by id', function () {
    it('should return null', async function () {
      const user = await userResolver.user(
        { _id: '' },
        { req, res, authController }
      );
      expect(user).to.be.null;
    });
  });

  describe('when register parameters are valid', function () {
    it('should return a correct response user object together with token', async function () {
      const authController = {
        login: (req, res) => {
          return {
            user: { id: 'fake-id', ...validRegisterPayload },
            token: 'fake-token',
          };
        },
      };
      const response = await userResolver.registerUser(validRegisterPayload, {
        req,
        res,
        authController,
      });
      assert.deepEqual(response, {
        id: 'fake-id',
        token: 'fake-token',
        ...validRegisterPayload,
      });
    });
  });

  describe('when User.save fails and return an empty object', function () {
    it('should return an error', function (done) {
      // NOTE: Maybe use in-memory database?
      const saveStub = sinon.stub(User.prototype, 'save').returns(null);
      userResolver
        .registerUser(validRegisterPayload, { req, res, authController })
        .then(
          function (result) {
            done(new Error('It should not be a success'));
          },
          function (err) {
            done();
          }
        )
        .finally(function () {
          saveStub.restore();
        });
    });
  });

  describe('when register with existing email or username', function () {
    it('should return error', function (done) {
      // NOTE: Maybe use in-memory database?
      const existsStub = sinon
        .stub(User, 'exists')
        .withArgs({ email: 'ducthinh2410@gmail.com', username: 'thinh' })
        .returns(true);
      userResolver
        .registerUser(validRegisterPayload, {})
        .then(
          function (result) {
            done(new Error('It should not be a success'));
          },
          function (_) {
            done();
          }
        )
        .finally(function () {
          existsStub.restore();
        });
    });
  });

  describe('when update user image without valid token', function () {
    it('should return error', function (done) {
      const authController = {};
      userResolver.updateUserImage({}, { req, res, authController }).then(
        function (_) {
          done(new Error('It should not be a success'));
        },
        function (_) {
          done();
        }
      );
    });
  });

  describe('when update user image with current user image', function () {
    it('should call delete user image', async function () {
      const fakeImageUrl = 'https://muzify.eu/profileimage.png';
      const checkAuthStub = sinon
        .stub(authController, 'checkAuth')
        .returns({ profileImageUrl: fakeImageUrl });
      const uploadImageStub = sinon
        .stub(imageService, 'uploadImage')
        .returns({ Location: 'http://muzify.eu/uploaded.png' });
      const imageServiceMock = sinon.mock(imageService);
      imageServiceMock.expects('deleteImage').once();
      await userResolver.updateUserImage(
        {
          file: {
            file: {
              filename: 'abc',
              mimetype: 'img',
              createReadStream: () => {},
            },
          },
        },
        {
          res,
          res,
          authController,
          imageService,
        }
      );
      imageServiceMock.verify();
      uploadImageStub.restore();
      checkAuthStub.restore();
    });
  });

  describe('when update bio firstName and last name', function () {
    it('should return updated user object', async function () {
      let newUser = await User(validRegisterPayload).save();
      const checkAuthStub = sinon
        .stub(authController, 'checkAuth')
        .returns(newUser);
      const payload = {
        bio: 'bio',
        firstName: 'A',
        lastName: 'B',
      };

      const updatedUser = await userResolver.updateUser(payload, {
        req,
        res,
        authController,
      });
      newUser.bio = 'bio';
      newUser.firstName = 'A';
      newUser.lastName = 'B';
      assert.deepEqual(updatedUser, updatedUser);
      checkAuthStub.restore();
    });
  });

  describe('when login', function () {
    it('return correct user object and token', async function () {
      const user = {
        _id: 'id',
        username: 'test',
      };
      const checkAuthStub = sinon
        .stub(authController, 'login')
        .returns({ user, token: '123' });
      const response = await userResolver.login(
        {},
        {
          req,
          res,
          authController,
        }
      );
      assert.deepEqual(response, {
        id: 'id',
        username: 'test',
        token: '123',
        _id: 'id',
      });
      checkAuthStub.restore();
    });
  });
});
