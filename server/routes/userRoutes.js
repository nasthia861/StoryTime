const express = require('express');
const router = express.Router();
const { User } = require('../database/index')

//User GET request
// router.get('/', (req, res) => {
//   //Create id variable to be used as conditional
//   const { id } = req.params;
//   User.findAll({
//     where: {
//       userId: id
//     },
//     include: [{
//       model: Entry,
//       where: {user_id: id},
//       include: [{
//         model: Text,
//       }]
//     }],
//     required: true
//   })
//   .then((userInfo) => {
//     res.send(userInfo).status(200);
//   })
//   .catch((err) => {
//     console.error('Could not GET user data', err);
//     res.sendStatus(500);
//   })
// });

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

// API route to get user information
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    // Return user data if authenticated
    res.json({ user: req.user });
  } else {
    // Return an empty object if not authenticated
    res.json({});
  }
});

module.exports = router;