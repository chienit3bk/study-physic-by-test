const jwt = require('jsonwebtoken');
const config = require('config')
const Joi = require('joi');
const mongoose = require('mongoose');

const schemaUser = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024, // hash
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  phone_number: {
    type: String,
    minlength: 10, 
  }, 
  address: {
    type: String,
    minlength: 5, 
    maxlength: 255
  },
  coefficients_salary: {
    type: Number,
    default: 20000
  }
})

schemaUser.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
  return token
}

const User = mongoose.model('Users', schemaUser)

function validateRegister(register) {
  const schema = {
    name: Joi.string().min(5).required(),
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    phone_number: Joi.string().min(10).required(),
    address: Joi.string().required()
  }

  return Joi.validate(register, schema)
}

module.exports.User = User
module.exports.validate = validateRegister