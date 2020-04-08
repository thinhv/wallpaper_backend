'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  imageUrl: { type: String, required: true },
  description: { type: String },
  likeByUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Post', postSchema);
