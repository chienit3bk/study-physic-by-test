const mongoose = require('mongoose');

const Salary = mongoose.model('Salary',new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  coefficients_salary: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  }, 
  year: {
    type: Number,
    required: true
  }
}))

module.exports.Salary = Salary