require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../database/db.js');
const helper = require('../helper/index');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(404).send('Email is required');
  } else if (!helper.checkValidEmail(email)) {
    return res.status(400).send('Invalid Email');
  }
  if (!password) {
    res.status(404).send('Password is required');
  }

  db('user')
    .select('*')
    .where({
      email: email,
      is_active: true,
      is_deleted: false,
    })
    .then((user) => {
      user = user[0];
      if (!user) {
        return res.status(404).send('Invalid email or password');
      }
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isAdmin: user.is_admin,
          },
          process.env.JWT_PRIVATE_KEY,
          {
            expiresIn: '10h',
          }
        );
        return res.status(200).send({ token });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
