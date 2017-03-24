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
  last4Num: Number,
  type: {
    type: String,
    required: true
  },
  dueDate: Number,
  closingDate: Number,
  creditLine: Number,
  minPayment: Number,
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
  backupPaymentAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  order: {
    type: Number,
    default: 0
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