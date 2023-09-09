const express = require('express');
const app = express();
const { User } = require('./database')

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(distPath));

//User GET request
app.get('/users/:id', (req, res) => {
  //Create id variable to be used as conditional
  const { id } = req.params;
  User.findOne({
    where: {
      userId: id
    }
  })
  .then((userInfo) => {
    res.send(userInfo).status(200);
  })
  .catch((err) => {
    console.error('Could not GET user data', err);
    res.sendStatus(500);
  })
});