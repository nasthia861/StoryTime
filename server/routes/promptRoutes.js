const express = require('express');
const router = express.Router();
const { Prompt } = require('../database/index'); 

router.post('/', (req, res) => {
  const { newPrompt } = req.body;
  Prompt.create(newPrompt)
    .then(() => {
      console.log('successfully added new prompt');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('prompt post handler failed', error)
      res.sendStatus(500);
    })
})

module.exports = router;