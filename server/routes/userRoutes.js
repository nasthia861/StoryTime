const express = require('express');
const router = express.Router();
const { User } = require('../database/index')

//User GET request
router.get('/users', (req, res) => {
  //Create id variable to be used as conditional
  const { id } = req.params;
  User.findAll({
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

router.get('/users/:id', (req, res) => {
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

module.exports = router;