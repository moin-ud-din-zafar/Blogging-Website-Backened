// routes/posts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// Public
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Private (requires JWT in Authorization header)
// — Note: “/me” must come before “/:id” so that “me” is not treated as an ID
router.get('/me', auth, getUserPosts);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
