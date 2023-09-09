const express = require('express');
const router = express.Router();

const {Text} = require('./index')


router.post('/text/:textId/likes', (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
//find post by primary key
  Text.findByPk(id)
  .then((post) => {
    //validate post exist => send 404 otherwise
    if (!post) {
      res.status(404).json({error: 'Post not Found'});
    } else if ( action === 'like') {
      //access like property from post object and increment count
      post.likes += 1
    }

  })
})
