const User = require('../models/User');
const authController = require('../controllers/authController');
const bcrypt = require('bcrypt');
const saltRound = 12;

const users = () => {
  const UserOne = {
    id: 1,
    username: 'trucdeptrai',
    firstName: 'Truc',
    lastName: 'Truong',
    isVerified: true,
    bio: 'My name is Truc Dep Trai',
    userType: 'admin',
    profileImageURL: 'https://google.com',
  };

  return [UserOne];
};

const user = ({ id }) => {
  if (id === 1) {
    return UserOne;
  }
  return null;
};

const UserOne = {
  id: 1,
  username: 'trucdeptrai',
  firstName: 'Truc',
  lastName: 'Truong',
  isVerified: true,
  bio: 'My name is Truc Dep Trai',
  userType: 'admin',
  profileImageURL: 'https://google.com',
};

const registerUser = async (args, { req, res }) => {
  const existingUser = User.findOne({
    username: args.username,
    email: args.email,
  });

  if (existingUser !== undefined) {
    throw Error(``);
  }

  const hash = await bcrypt.hash(args.password, saltRound);
  const userWithHash = {
    ...args,
    password: hash,
    userType: 'user',
  };
  console.log(args);
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

const login = async (args, { req, res }) => {
  req.body = args;
  const authResponse = await authController.login(req, res);
  return {
    id: authResponse.user._id,
    ...authResponse.user,
    token: authResponse.token,
  };
};

module.exports = {
  users,
  user,
  registerUser,
  login,
};
