const Post = require('../models/Post');
const fs = require('fs');
const upload = require('../utils/FileUploader');
const authController = require('../controllers/authController');
const mongoose = require('mongoose');

const posts = async (args, { req, res }) => {
  const posts = await Post.find().populate('postedByUser');

  try {
    const user = await authController.checkAuth(req, res);
    return posts.map((post) => {
      post.likedByMe = post.likedByUsers.includes(
        mongoose.Types.ObjectId(user._id)
      );
      return post;
    });
  } catch (error) {
    return posts;
  }
};

const post = async (args, { req, res }) => {
  const post = await Post.findById(args.id).populate('postedByUser');

  return post;
};

const createPost = async (args, { req, res }) => {
  const { file, description } = args;
  const { filename, mimetype, createReadStream } = await file.file;
  const stream = createReadStream();
  const data = await upload(stream, filename, mimetype);

  const user = await authController.checkAuth(req, res);

  const post = await Post.create({
    postedByUser: user._id,
    description,
    imageUrl: data.Location,
  });

  return post;
};

const updatePost = async (args, { req, res }) => {
  const user = await authController.checkAuth(req, res);

  const post = await Post.findById(args.id);

  if (post.postedByUser.toString() == user._id) {
    post.description = args.description;
    await post.save();
    return post;
  } else {
    throw new Error('Forbidden');
  }
};

const deletePost = async (args, { req, res }) => {
  const user = await authController.checkAuth(req, res);

  const post = await Post.findById(args.id);

  if (post.postedByUser.toString() == user._id) {
    await Post.deleteOne({ _id: post._id });
    return post;
  } else {
    throw new Error('Forbidden');
  }
};

const likePost = async (args, { req, res }) => {
  const user = await authController.checkAuth(req, res);
  const post = await Post.findById(args.id);

  likeIndex = await post.likedByUsers.indexOf(
    mongoose.Types.ObjectId(user._id)
  );

  if (likeIndex > -1) {
    post.likedByUsers.splice(likeIndex, 1);
  } else {
    post.likedByUsers.push(user._id);
  }

  await post.save();

  return post;
};

module.exports = {
  posts,
  post,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
