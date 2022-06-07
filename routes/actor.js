const express = require('express');
const router = express.Router();
const knex = require('../database/db.js');
const helper = require('../helper/index');

router.get('/', helper.auth, (req, res) => {
  knex('actor')
    .select('*')
    .then((actor) => {
      return res.status(200).send(actor);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

router.get('/:id', helper.auth, (req, res) => {
  knex('actor')
    .select('*')
    .where('id', req.params.id)
    .then((people) => {
      return res.status(200).send(people);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

router.post('/', helper.auth, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('Invalid Request');
  }

  knex('actor')
    .insert({
      name,
    })
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

router.patch('/:id', helper.auth, (req, res) => {
  const { name } = req.body;

  knex('actor')
    .update({
      name,
    })
    .where({ id: req.params.id })
    .then((people) => {
      return res.status(200).send(people);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

router.delete('/:id', helper.auth, (req, res) => {
  knex
    .transaction((trx) => {
      knex('movie_actor')
        .transacting(trx)
        .where('actor_id', req.params.id)
        .del()
        .then(() => {
          knex('actor')
            .transacting(trx)
            .where('id', req.params.id)
            .del()
            .then(() => {
              trx.commit();
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(() => res.status(204).send('Deleted Successfully'))
    .catch((err) => console.log(err));
});

module.exports = router;
