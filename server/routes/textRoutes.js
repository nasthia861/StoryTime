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

//post to update likes and dislikes
router.post('/:id', (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  Text.findOne({where: { id: id}})
  .then((text) => {
      if (!text) {
        return res.status(404).send({ error: 'Text not found' });
      }

      if (action === 'like') {
        text.likes += 1;
      } else if (action === 'dislike') {
        text.likes -= 1;
      }

      return text.save()
        .then(() => {
          res.status(200).send({ message: 'Action successful' });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send({ error: 'Internal server error' });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: 'Internal server error' });
    });
});

//Get all text by a user
router.get('/user/:userId', (req,res) => {
  const { userId } = req.params;
  Text.findAll({
    where: {
      userId: userId
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

//grabbing all the texts with a specific postId and round 
router.get('/', (req, res) => {
  const promptId = req.query.promptId;
  const round = req.query.round;
  Text.findAll({
    where: {
      promptId: promptId,
      round: round
    }
  })
    .then((textArr) => {
      if(textArr.length > 0){
        res.status(200).send(textArr);
      } else {
        console.log('promptId and round had no match')
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      console.error('get text with promptId and round failed', error);
      res.sendStatus(500);
    })
})

module.exports = router; 
