const express = require('express');
const router = express.Router();

const {Text} = require('../database/index') // temporary 

//end point temporary until testing
router.post('/like:id', (req, res) => {
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

//Get all text by a user
router.get('/text', (req,res) => {
  const { user_Id} = req.params;
  Text.findAll({
    where: {
      userId: user_Id
    }
  })
    .then((textData) => {
      res.send(textData).status(200);
    })
    .catch((err) => {
      console.error('Could not Get all texts', err);
      res.sendStatus(500);
    });
})

router.post('/', (req, res) => {
  const { newText } = req.body;
  Text.create(newText)
    .then(() => {
      console.log('successfully added new text');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('text post handler failed', error)
      res.sendStatus(500);
    })
})

//grabbing all the texts with a specific postId
router.get('/prompt/:promptId', (req, res) => {
  const { promptId } = req.params;
  Text.findAll({
    where: {
      promptId: promptId
    }
  })
    .then((textArr) => {
      if(textArr.length > 0){
        res.status(200).send(textArr);
      } else {
        console.log('promptId had no match')
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      console.error('get text with promptId failed', error);
      res.sendStatus(500);
    })
})

module.exports = router; 