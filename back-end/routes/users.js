const { User, validate } = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt');
const express = require('express');
const { Timekeeping } = require('../models/timekeeping');
const router = express.Router();

// lấy toàn bộ danh sách nhân viên

router.get('/', [auth, admin], async (req, res) => {
  const users = await User.find({ isAdmin: false }).select('-password -isAdmin')
  res.send(users)
})

// tạo nhân viên mới
router.post('/create', [auth, admin],  async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({username: req.body.username })
  if (user) return res.status(400).send("username already exists")

  user = new User(_.pick(req.body, ['name', 'username', 'password', 'phone_number', 'address']))

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();

  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'username']))
})

// có thể gửi thông tin từ nhiều trường, gửi cái nào cập nhật cái đó
router.put('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if(!user) return res.status(400).send('The user with the given ID was not found.')
  
  
  user.phone_number = req.body.phone_number ? req.body.phone_number : user.phone_number;
  user.username = req.body.username ? req.body.username : user.username;
  user.name = req.body.name ? req.body.name : user.name;
  user.address = req.body.address ? req.body.address : user.address;
  user.coefficients_salary = req.body.coefficients_salary ? req.body.coefficients_salary : user.coefficients_salary;


  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  await user.save()

  res.send(_.pick(user, ['name', 'username', 'phone_number', 'address', 'coefficients_salary']))
})

router.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if(!user) return res.status(400).send('The user with the given ID was not found.')

  await user.remove()

  res.send(user)
})

// đăng xuất
router.put('/logout/:timekeeping_id', auth, async (req, res) => {
  console.log(1111)
  let user = await User.findById(req.user._id)
  user.isActive = false
  await user.save()

  let timekeeping = await Timekeeping.findById(req.params.timekeeping_id)
  timekeeping.end_time = +new Date() + 7 * 60 * 60 * 1000,
  console.log(timekeeping.end_time)

  await timekeeping.save()
  res.send(user)
})

module.exports = router