const express = require('express');
const promptRoutes = require('./promptRoutes');
const textRoutes = require('./textRoutes');
const userRoutes = require('./userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/text', textRoutes);
app.use('/user', userRoutes);
app.use('/prompt', promptRoutes);

module.exports.app = app;