'use strict';

const Post = require('../models/Post');
const { ObjectId } = require('mongoose').Types;

const fs = require('fs');
const { uploadImage, deleteImage } = require('../utils/ImageService');
const mongoose = require('mongoose');

const posts = async (args, { req, res, authController }) => {
  const start = args.start || 0;
  const limit = args.limit || 10;
  const posts = await Post.find()
    .skip(start)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('postedByUser');

  try {
    const user = await authController.checkAuth(req, res);
    return posts.map((post) => {
      post.likedByMe = post.likedByUsers.includes(new ObjectId(user._id));
      return post;
    });
  } catch (error) {
    return posts;
  }
};

const post = async (args, _) => {
  const post = await Post.findById(args.id).populate('postedByUser');
  return post;
};

const createPost = async (args, { req, res, authController }) => {
  const { file, description } = args;
  const { filename, mimetype, createReadStream } = await file.file;
  const stream = createReadStream();
  const data = await uploadImage(stream, filename, mimetype);

  const user = await authController.checkAuth(req, res);

  const post = await Post.create({
    postedByUser: user._id,
    description,
    imageUrl: data.Location,
  });

  return post;
};

const updatePost = async (args, { req, res, authController }) => {
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

const deletePost = async (args, { req, res, authController }) => {
  const user = await authController.checkAuth(req, res);

  const post = await Post.findById(args.id);

  if (post.postedByUser.toString() == user._id) {
    await Post.deleteOne({ _id: post._id });
    return post;
  } else {
    throw new Error('Forbidden');
  }
};

const likePost = async (args, { req, res, authController }) => {
  const user = await authController.checkAuth(req, res);
  let post = await Post.findById(args.id);

  const likeIndex = await post.likedByUsers.indexOf(new ObjectId(user._id));

  if (likeIndex > -1) {
    post.likedByUsers.splice(likeIndex, 1);
  } else {
    post.likedByUsers.push(user._id);
  }
  return await post.save();
};

module.exports = {
  posts,
  post,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
