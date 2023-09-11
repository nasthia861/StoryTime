const express = require('express');
const passport = require('passport');
const { User } = require('../database/index')

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ username, password: hashedPassword });

    return res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// User login
router.post('/login', passport.authenticate('local'), (req, res) => {
  return res.json({ message: 'Login successful.' });
});

// User logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful.' });
});

module.exports = router;