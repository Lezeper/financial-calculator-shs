var mongoose = require('mongoose');

var rewardRuleSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  rewardType: String,
  rewardMax: {
    type: Number,
    default: -1
  },
  redeemMin: {
    type: Number,
    default: -1
  },
  startDate: {
    type: Date,
    default: new Date('1/1/1')
  },
  endDate: {
    type: Date,
    default: new Date('9/9/9999')
  },
  earned: {
    type: Number,
    default: 0
  },
  rewardStrategy: {
    rewardCategory: [String],
    rewardRatio: Number
  }
});

mongoose.model('RewardRule', rewardRuleSchema);