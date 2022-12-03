const Joi = require('joi');
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  license_plate: {
    type: String,
    required: true,
  },
  time_in: {
    type: Date,
    required: true,
    default: function(){return +new Date() + 7*60*60*1000}
  },
  ticket_type: {
    type: String,
    default: 'ngay',
    enum: ['ngay', 'thang'],
    required: true, 
  }, 
  vehicle_type: {
    type: String,
    default: 'xe may',
    enum: ['xe may', 'o to', 'xe dap'],
    required: true
  },
  IDs: {
    type: String,
    minlength: 6, 
  },
  due_date: {
    type: Date,
    required: function () {
      return this.ticket_type === 'thang'
    },
    // default: function(){return +new Date() + 32*60*60*1000*30}
  },
  used: {
    type: Boolean,
    required: true,
    default: false
  }
})

const Ticket = mongoose.model('Tickets', ticketSchema);

function validateTicket(ticket) {
  const schema = {
    license_plate: Joi.string().required(),
    vehicle_type: Joi.string().required(),
  }

  return Joi.validate(ticket, schema)
}

function validateMonthTicket(ticket) {
  const schema = {
    license_plate: Joi.string().required(),
    vehicle_type: Joi.string().required(),
    IDs: Joi.string().min(6).required(),
  }
  return Joi.validate(ticket, schema)
}

module.exports.Ticket = Ticket
module.exports.validate = validateTicket
module.exports.validateMonthTicket = validateMonthTicket
