// controllers/postController.js
const Post = require('../models/Post');

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
exports.createPost = async (req, res) => {
  const { title, content, category, coverImageUrl } = req.body;
  try {
    // Use req.user.id (set by authMiddleware) as the author
    const author = req.user.id;
    const newPost = new Post({ title, author, content, category, coverImageUrl });
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ message: 'Post not found' });
    return res.status(500).send('Server error');
  }
};

// ────────────────────────────────────────────────────────────────────

// @route   GET /api/posts/me
// @desc    Get all posts by *current* user
// @access  Private
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// @route   PUT /api/posts/:id
// @desc    Update a post (only if owned by user)
// @access  Private
exports.updatePost = async (req, res) => {
  const { title, content, category, coverImageUrl } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only allow the author to update
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Update fields if provided
    post.title = title !== undefined ? title : post.title;
    post.content = content !== undefined ? content : post.content;
    post.category = category !== undefined ? category : post.category;
    if (coverImageUrl !== undefined) post.coverImageUrl = coverImageUrl;

    const updated = await post.save();
    return res.json(updated);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ message: 'Post not found' });
    return res.status(500).send('Server error');
  }
};

// @route   DELETE /api/posts/:id
// @desc    Delete a post (only if owned by user)
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only allow the author to delete
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await post.remove();
    return res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ message: 'Post not found' });
    return res.status(500).send('Server error');
  }
};
