const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  content:     { type: String, required: true },
  category:    { type: String, default: 'General' },
  coverImageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
