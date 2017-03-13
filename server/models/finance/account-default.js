var mongoose = require('mongoose');

var AccountDefaultSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  rewardType: {
    type: String
  },
  rewardRules: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'RewardRule'
    }
  ]
});

mongoose.model('AccountDefault', AccountDefaultSchema);