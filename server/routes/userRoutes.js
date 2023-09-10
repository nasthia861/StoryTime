const express = require('express');
const router = express.Router();
const { User } = require('../database/index')

//User GET request
router.get('/', (req, res) => {
  //Create id variable to be used as conditional
  const { id } = req.params;
  User.findAll({})
  .then((userInfo) => {
    res.send(userInfo).status(200);
  })
  .catch((err) => {
    console.error('Could not GET user data', err);
    res.sendStatus(500);
  })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  User.findByPk(id)
    .then((userdata) => {
      res.send(userdata).status(200);
    })
    .catch((err) => {
      console.error('Could not GET user data by id', err)
      res.sendStatus(500);
    })
});

router.post('/', (req, res) => {
  const { newUser } = req.body;
  User.create(newUser)
    .then(() => {
      console.log('succesfully added new user');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('user post handler failed', error)
      res.sendStatus(500);
    })
})

module.exports = router;