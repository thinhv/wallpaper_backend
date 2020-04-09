const User = require('../models/User');

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

module.exports = {
  users,
  user,
};
