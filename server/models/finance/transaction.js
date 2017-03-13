var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  category: String,
  description: String,
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account'
  },
  isPending: Boolean
});

mongoose.model('Transaction', TransactionSchema);