const express = require('express');
const router = express.Router();
const { Badges } = require('../database/index'); 

router.get('/', (req, res) => {
  Badges.findAll({})
    .then((badges) => {
      res.status(200).send(badges)
    })
    .catch((error) => {
      console.error('could not get all badges', error)
      res.sendStatus(500);
    })
})

//grabs latest badge created
router.get('/find/last', (req, res) => {
  Badges.findAll({
    limit: 1,
    order: [['id', 'DESC']]
  })
    .then((lastBadge) => {
      res.send(lastBadge).status(200);
    })
    .catch((err) => {
      console.error('Could not Get last badge submitted', err);
      res.sendStatus(500);
    });
})

//create new badge
router.post('/', (req, res) => {
  Badges.create(req.body)
    .then(() => {
      console.log('successfully added new badges');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('badges post handler failed', error)
      res.sendStatus(500);
    })
})

//get by promptId
router.get('/:promptId', (req, res) => {
  const { promptId } = req.params;
  Badges.findOne({
    where: {
      promptId: promptId
    }
  })
    .then((badgeData) => {
      res.status(200).send(badgeData);
    })
    .catch(() => [
      res.sendStatus(500)
    ])
})


//post to update winner status in badge
router.post('/:id/:action', (req, res) => {
  const { id , action } = req.params;
  const { newValue } = req.body

  Badges.findOne({where: { id: id}})
  .then((badge) => {
      if (!badge) {
        return res.status(404).send({ error: 'Badge not found' });
      }

      badge[action] = newValue

      return badge.save()
        .then(() => {
          res.status(200).send({ message: 'winner selected' });
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

module.exports = router;