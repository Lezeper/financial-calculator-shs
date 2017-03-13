var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
  updatedDate: {
    type: Date,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  closingDate: {
    type: Date
  },
  creditLine: {
    type: Number
  },
  minPayment: {
    type: Number
  },
  pendingTransactions: [],
  balance: {
    type: Number,
    default: 0
  },
  lastBalance: {
    type: Number,
    default: 0
  },
  apr0Valid: {
    type: Boolean,
    default: false
  },
  apr0Date: {
    startDate: Date,
    endDate: Date
  },
  threshold: {
    type: Number,
    default: 0
  },
  payBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  rewards: {
    type: Number,
    default: 0
  },
  rewardRules: [
    {
      rule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RewardRule'
      },
      earned: {
        type: Number,
        default: 0
      }
    }
  ]
});

mongoose.model('Account', AccountSchema);