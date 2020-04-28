'use strict';

const User = require('../models/User');
const Post = require('../models/Post');

const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const saltRound = 12;

const user = async ({ id }, _) => {
  const user = await User.findById(id);
  return user;
};

const registerUser = async (args, { req, res, authController }) => {
  const userExists = await User.exists({
    username: args.username,
    email: args.email,
  });

  if (userExists) {
    throw new Error('User already exists');
  }

  const hash = await bcrypt.hash(args.password, saltRound);
  const userWithHash = {
    ...args,
    password: hash,
    userType: 'user',
  };
  const newUser = User(userWithHash);
  const result = await newUser.save();
  if (result !== null) {
    req.body = args;
    const authResponse = await authController.login(req, res);
    return {
      id: authResponse.user._id,
      ...authResponse.user,
      token: authResponse.token,
    };
  } else {
    throw new Error('Unable to create user');
  }
};

const updateUserImage = async (
  args,
  { req, res, authController, imageService }
) => {
  const user = await authController.checkAuth(req, res);
  if (user.profileImageUrl) {
    await imageService.deleteImage(user.profileImageUrl);
  }
  const { file } = args;
  const { filename, mimetype, createReadStream } = await file.file;
  const { Location } = await imageService.uploadImage(
    createReadStream(),
    filename,
    mimetype
  );
  return await User.findByIdAndUpdate(
    user._id,
    { profileImageUrl: Location },
    { new: true }
  );
};

const login = async (args, { req, res, authController }) => {
  req.body = args;
  const authResponse = await authController.login(req, res);
  return {
    id: authResponse.user._id,
    ...authResponse.user,
    token: authResponse.token,
  };
};

const updateUser = async (
  { bio, firstName, lastName },
  { req, res, authController }
) => {
  const user = await authController.checkAuth(req, res);
  return await User.findByIdAndUpdate(
    user._id,
    { bio, firstName, lastName },
    { new: true }
  );
};

const userProfile = async ({ username, _ }) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('User not found by username');
  }

  const posts = Post.find({ postedByUser: new ObjectId(user._id) }).populate(
    'postedByUser'
  );

  return {
    user,
    posts,
  };
};

module.exports = {
  user,
  login,
  registerUser,
  updateUser,
  updateUserImage,
  userProfile,
};
