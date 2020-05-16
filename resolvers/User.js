const User = require('../models/User');
const authController = require('../controllers/authController');
const bcrypt = require('bcrypt');
const saltRound = 12;
const { uploadImage, deleteImage } = require('../utils/ImageService');

const user = async ({ id }, _) => {
  console.log(id);
  const user = await User.findById(id);
  return user;
};

const registerUser = async (args, { req, res }) => {
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

const updateUserImage = async (args, { req, res }) => {
  const user = await authController.checkAuth(req, res);
  console.log(user);
  if (user.profileImageUrl) {
    console.log(`user.profileImageUrl:`);
    console.log(user.profileImageUrl);
    deleteImage(user.profileImageUrl);
  }
  const { file } = args;
  const { filename, mimetype, createReadStream } = await file.file;
  const { Location } = await uploadImage(
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

const login = async (args, { req, res }) => {
  req.body = args;
  const authResponse = await authController.login(req, res);
  return {
    id: authResponse.user._id,
    ...authResponse.user,
    token: authResponse.token,
  };
};

const updateUser = async ({ bio, firstName, lastName }, { req, res }) => {
  const user = await authController.checkAuth(req, res);
  return await User.findByIdAndUpdate(
    user._id,
    { bio, firstName, lastName },
    { new: true }
  );
};

module.exports = {
  user,
  login,
  registerUser,
  updateUser,
  updateUserImage,
};
