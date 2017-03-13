var mongoose = require('mongoose');

var RecurringSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  category: String,
  description: String,
  recurringDate: {
    type: String,
    required: true
  },
  recurringPeriod: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  payAhead: {
    type: Number,
    default: 0
  },
  payBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account'
  },
  startDate: {
    type: Date,
    default: new Date('1/1/1')
  },
  endDate: {
    type: Date,
    default: new Date('9/9/9999')
  }
});

mongoose.model('Recurring', RecurringSchema);