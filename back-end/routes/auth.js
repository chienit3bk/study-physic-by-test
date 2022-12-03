const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user')
const { Timekeeping } = require('../models/timekeeping')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid username or password")

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send("Invalid username or password")

  const timekeeping = new Timekeeping({
    user_id: user._id
  })
  await timekeeping.save()

  const token = user.generateAuthToken();
  user.isActive = true;
  await user.save();

  res.json({ token: token, timekeeping_id: timekeeping._id, name: user.name, isAdmin: user.isAdmin });
})

function validate(req) {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  }
  return Joi.validate(req, schema)
}

module.exports = router;