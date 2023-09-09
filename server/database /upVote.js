const express = require('express');
const router = express.Router();

const {Text} = require('../database/index');

//end point temporary until testing
router.post('/text/likes/:textId', (req, res) => {
  const { id } = req.params;
  const action = req.body.action;

  Text.findByPk(id) //find post by PRIMARY KEY
  .then((post) => {
    //validate post exist => send 404 otherwise
    if (!post) {
      res.status(404).json({error: 'Post not Found'});
    }
    //if post exist and action => 'like'
    if ( action === 'like') {
      //access like property from post object and increment count
      post.likes += 1
    } else if (action  === 'dislike') {//if post exist and action => 'dislike'
      //access like property from post object and increment count
      post.likes -= 1;
      res.status(200).json({message: 'Action successful'})
    }

  })//error handling
  .catch((err) => {
    console.error(err);
    res.status(500).json({error: 'Internal server error'})
  })
})

module.exports = router; 
