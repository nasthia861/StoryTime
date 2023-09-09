const express = require('express');
const app = express();
const { Users } = require('./database')

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(distPath));

//User GET request
app.get('/users', (req, res) => {
  //Create id variable to be used as conditional
  const { id } = req.params;
  Users.findAll({
    where: {
      userId: id
    },
    include: [{
      model: Entry,
      where: {user_id: id},
      include: [{
        model: Text,
      }]
    }],
    required: true
  })
  .then((userInfo) => {
    res.send(userInfo).status(200);
  })
  .catch((err) => {
    console.error('Could not GET user data', err);
    res.sendStatus(500);
  })
});