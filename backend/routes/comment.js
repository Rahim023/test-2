const express = require('express');
const Comment = require('../models/comment');
const auth = require('../middlewear/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { text, email } = req.body;
  try {
    const comment = await Comment.create({ text, email, user: req.userId });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to post comment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'name email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

module.exports = router;