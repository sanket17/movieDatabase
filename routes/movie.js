const express = require('express');
const router = express.Router();
const bookshelf = require('../database/bookshelf');
const knex = require('../database/db.js');
const helper = require('../helper/index');

const Movie = bookshelf.model('Movie', {
  tableName: 'movie',
  idAttribute: 'id',
  actors: function () {
    return this.belongsToMany(Actor, 'movie_actor', 'movie_id', 'actor_id');
  },
});

const Actor = bookshelf.model('Actor', {
  tableName: 'actor',
  movies: function () {
    return this.belongsToMany(
      Movie,
      'movie_actor',
      'movie_actor',
      'actor_id',
      'movie_id'
    );
  },
});

router.get('/', helper.auth, (req, res) => {
  Movie.fetchAll({ withRelated: ['actors'], where: { is_deleted: false } })
    .then((movies) => {
      return res.status(200).send(movies);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send(err);
    });
});

router.get('/:id', helper.auth, (req, res) => {
  Movie.fetchAll({
    withRelated: ['actors'],
    where: { is_deleted: false, id: req.params.id },
  })
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

router.post('/', helper.auth, helper.isAdmin, (req, res) => {
  const { name, banner, releaseYear, genre, director, actor } = req.body;

  if (!name || !releaseYear || !genre || !director || !actor) {
    return res.status(400).send('Please fill all the fields');
  }
  knex
    .transaction((trx) => {
      knex('movie')
        .transacting(trx)
        .insert({
          name,
          banner,
          release_year: releaseYear,
          genre,
          director,
        })
        .returning('id')
        .then((id) => {
          if (id && actor.length > 0) {
            id = id[0].id;
            const movie_actor = actor.map((actor) => {
              return {
                movie_id: parseInt(id),
                actor_id: parseInt(actor),
              };
            });
            return knex('movie_actor').transacting(trx).insert(movie_actor);
          }
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then((response) => res.status(200).send(response))
    .catch((err) => console.log(err));
});

router.patch('/:id', helper.auth, helper.isAdmin, (req, res) => {
  const { name, banner, releaseYear, genre, director, actor } = req.body;

  if (!name || !releaseYear || !genre || !director || !actor) {
    return res.status(400).send('Please fill all the fields');
  }

  try {
    knex('movie')
      .update({
        name,
        banner,
        release_year: releaseYear,
        genre,
        director,
      })
      .where('id', req.params.id)
      .then((response) => {
        if (response && actor.length > 0) {
          const movie_actor = actor.map((actor) => {
            return {
              movie_id: parseInt(req.params.id),
              actor_id: parseInt(actor),
            };
          });
          return knex('movie_actor')
            .where('movie_id', req.params.id)
            .del()
            .then(() => {
              return knex('movie_actor').insert(movie_actor);
            });
        }
      });
  } catch (error) {
    return res.status(400).send(error);
  } finally {
    res.status(200).send('Movie details updated successfully.');
  }
});

router.delete('/:id', helper.auth, helper.isAdmin, (req, res) => {
  knex('movie')
    .update({
      is_active: false,
      is_deleted: true,
    })
    .where('id', req.params.id)
    .then(() => {
      return res.status(204).send('Movie deleted successfully');
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

module.exports = router;
