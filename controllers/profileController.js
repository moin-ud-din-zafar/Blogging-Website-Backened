// controllers/profileController.js

const User = require('../models/User');
const Post = require('../models/Post');

// @route   GET /api/profile/me
// @desc    Get current user’s basic info + all of their posts
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // 1) The authMiddleware must have set req.user.id to the logged-in user’s ID
    const userId = req.user.id;

    // 2) Fetch the user’s info (omit password, __v, etc.)
    const user = await User.findById(userId)
      .select('-password -__v')
      .lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3) Fetch all posts created by this user
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .lean();

    // 4) Return both in a single response
    return res.json({ user, posts });
  } catch (err) {
    console.error('Error in getProfile:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
