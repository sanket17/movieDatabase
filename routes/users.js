const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bookshelf = require('../database/bookshelf');
const knex = require('../database/db');

const helper = require('../helper/index');

const User = bookshelf.model('User', {
  tableName: 'user',
});

router.post('/', async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    password,
    confirmPassword,
  } = req.body;

  if (!firstName) {
    return res.status(400).send('First Name is required.');
  }
  if (password !== confirmPassword) {
    return res.status(400).send('Entered Password did not match.');
  }

  if (!email) {
    return res.status(422).send('Email is required');
  } else if (!helper.checkValidEmail(email)) {
    return res.status(400).send('Invalid Email');
  }
  if (!helper.checkValidPhone(contactNumber)) {
    return res.status(400).send('Invalid Contact Number');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  knex
    .transaction((trx) => {
      knex('user')
        .transacting(trx)
        .where('email', email)
        .then((user) => {
          if (user.length === 0) {
            return knex('user')
              .transacting(trx)
              .insert({
                first_name: firstName,
                last_name: lastName || null,
                email: email,
                contact_number: contactNumber,
                password: hashedPassword,
                is_admin: req.body.isAdmin || false,
              })
              .then(async () => {
                return await knex('user')
                  .transacting(trx)
                  .where('email', email);
              });
          } else {
            return 'User already exists';
          }
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then((response) => res.status(200).send(response))
    .catch((err) => console.log(err));
});

router.get('/', (req, res, next) => {
  User.fetchAll()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).send(error);
    });
});

router.get('/:id', (req, res, next) => {
  User.query({ where: { id: req.params.id } })
    .fetchAll()
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

router.patch('/:id', (req, res, next) => {
  const { firstName, lastName, email, contactNumber } = req.body;

  if (!helper.checkValidPhone(contactNumber)) {
    return res.status(400).send('Invalid Contact Number');
  }

  knex('user')
    .where({ id: req.params.id, is_active: true, is_deleted: false })
    .update({
      first_name: firstName,
      last_name: lastName || null,
      email: email,
      contactNumber: contactNumber,
      isAdmin: req.body.isAdmin || false,
    })
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

router.delete('/:id', (req, res, next) => {
  knex('user')
    .where({ id: req.params.id, is_active: true, is_deleted: false })
    .update({ isActive: false, isDeleted: true })
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
});

module.exports = router;
