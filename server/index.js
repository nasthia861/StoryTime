const express = require('express');
const path = require('path');
const { app } = require('./routes/routes');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('./routes/userRoutes');

const port = 8080;

app.use(express.static(path.resolve(__dirname, '../dist')));

// Initialize session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Passport.js local strategy for user login
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session storage
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on : http://localhost:${port}`)
})

