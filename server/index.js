const express = require('express');
const path = require('path');
const { app } = require('./routes/routes');

const port = 8080;

app.use(express.static(path.resolve(__dirname, '../dist')));

app.listen(port, () => {
  console.log(`Listening on : http://localhost:${port}`)
})

