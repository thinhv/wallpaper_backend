'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  imageUrl: { type: String, required: true },
  description: { type: String },
  likedByUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  postedByUser: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
