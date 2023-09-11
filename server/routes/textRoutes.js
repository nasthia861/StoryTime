const express = require('express');
const router = express.Router();

const {Text} = require('../database/index');

//get text by text id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Text.findOne({
    where: {id: id}
  })
  .then((textObj) => {
    res.status(200).send(textObj);
  })
  .catch((err) => {
    console.error(err.message);
    res.status(404);
  })
})

//end point temporary until testing
router.post('/:id', (req, res) => {
  const { id, likes } = req.params;
  const { action } = req.body;

  // if (!['likes', 'dislikes'].includes(action)) {
  //   res.status(400)
  // }

  Text.findOne({where: { id: id}})
  .then((text) => {
      if (!text) {
        return res.status(404).json({ error: 'Text not found' });
      }

      if (action === 'like') {
        text.likes += 1;
      } else if (action === 'dislike') {
        text.likes -= 1;
      }

      return text.save()
        .then(() => {
          res.status(200).json({ message: 'Action successful' });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

//Get all text by a user
router.get('/', (req,res) => {
  const { user_Id} = req.params;
  Text.findAll({})
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
