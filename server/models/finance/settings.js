var mongoose = require('mongoose');

var SettingsSchema = new mongoose.Schema({
  accountConfirmDate: {
    type: Date,
    default: new Date()
  },
  transactionCategory: {
    type: [String],
    default: []
  }
});

mongoose.model('Settings', SettingsSchema);