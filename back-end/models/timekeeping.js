const mongoose = require('mongoose');

const timekeepingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  start_time: {
    type: Date,
    required: true,
    default: function(){return +new Date() + 7*60*60*1000}
  },
  end_time: {
    type: Date,
    required: true,
    default: function(){return +new Date() + 15*60*60*1000}
  }
})

const Timekeeping = mongoose.model('Timekeepings', timekeepingSchema)

module.exports.Timekeeping = Timekeeping
// module.exports. 