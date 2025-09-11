const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Email and password validation functions
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (pw) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);

// POST /api/login
exports.loginUser = async (req, res) => {
  console.log('Login route hit');
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, include 1 uppercase letter and 1 number' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/register
exports.registerUser = async (req, res) => {
  console.log('Register route hit');
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, include 1 uppercase letter and 1 number' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};