const express = require('express');
const path = require('path');

const port = 8080;


const app = express()
app.use(express.static(path.resolve(__dirname, '../dist')));


app.listen(port, () => {
  console.log(`Listening on : http://127.0.0.1:${port}`)
})
