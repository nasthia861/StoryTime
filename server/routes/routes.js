const express = require('express');
const promptRoutes = require('./promptRoutes');
const textRoutes = require('./textRoutes');
const userRoutes = require('./userRoutes');
const badgesRoutes = require('./badgesRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/text', textRoutes);
app.use('/user', userRoutes);
app.use('/prompt', promptRoutes);
app.use('/badges', badgesRoutes);

module.exports.app = app;