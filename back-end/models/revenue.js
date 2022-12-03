const Joi = require('joi');
const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
    default: function(){return +new Date() + 7*60*60*1000}
  },
  revenue: {
    type: Number,
    required: true, 
    min: 0
  }, 
  ticket_type: {
    type: String,
    required: true
  },
  vehicle_type: {
    type: String,
    required: true
  }
})

const Revenue = mongoose.model('Revenues', revenueSchema);

function validateTicket(revenue) {
  const schema = {
    revenue: Joi.number().integer().required(),
  }
  return Joi.validate(revenue, schema)
}

module.exports.Revenue = Revenue
module.exports.validate = validateTicket