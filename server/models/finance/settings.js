var mongoose = require('mongoose');

var SettingsSchema = new mongoose.Schema({
  accountConfirmDate: {
    type: Date,
    default: new Date()
  },
  transactionCategory: {
    type: [String],
    default: []
  },
  dbVersion: String
});

mongoose.model('Settings', SettingsSchema);