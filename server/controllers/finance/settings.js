var mongoose = require('mongoose');
var Settings = mongoose.model('Settings');
var _ = require('lodash');

var getSettings = function(need){
  need = _.isNil(need) || need === 'undefined' ? {} : need;

  return Settings.find({}, need).limit(1);
}

module.exports.getSettings = getSettings;

module.exports.getSettingsReq = function(req, res) {
  getSettings(req.query.need).then(function(settings){
    res.status(200).send({
      msg: "Settings Found.",
      data: settings
    });
  }, function(err){
    res.status(500).send(err);
  });
}

module.exports.updateSettingsReq = function(req, res) {
  // if settings not exit, then create
  if(_.isNil(req.body._id)){
    var _settings = new Settings();
    _settings.accountConfirmDate = req.body.accountConfirmDate;
    _settings.transactionCategory = req.body.transactionCategory;

    _settings.save().then(function(settings){
      res.status(200).send({
        msg: "Settings Created.",
        data: settings
      });
    }, function(err){
      res.status(500).send(err);
    });
  } else {
    var _id = req.body._id;
    Settings.findOneAndUpdate({_id: _id}, req.body).then(function(settings){
      res.status(200).send({
        msg: "Settings Updated.",
        data: settings
      });
    }, function(err){
      res.status(500).send(err);
    });
  }
}