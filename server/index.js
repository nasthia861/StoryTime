const express = require('express');
const path = require('path');

const port = 8080;


const app = express()
app.use(express.static(path.resolve(__dirname, '../dist')));

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.listen(port, () => {
  console.log(`Listening on : http://localhost:${port}`)
})

