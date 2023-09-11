const express = require('express');
const promptRoutes = require('./promptRoutes');
const textRoutes = require('./textRoutes');
const userRoutes = require('./userRoutes');
const auth = require('./auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/text', textRoutes);
app.use('/user', userRoutes);
app.use('/prompt', promptRoutes);
app.use('/auth', auth); // Create a separate route file for authentication

module.exports.app = app;