var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Settings = mongoose.model('Settings');
var _ = require('lodash');
var Path = require('path');
var config = require('../../config');
var exec = require('child_process').exec;
var fs = require('fs');
var UtilCtrl = require('../util');

var getSettings = function(need){
  need = _.isNil(need) || need === 'undefined' ? {} : need;

  return Settings.find({}, need).limit(1).exec();
}

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports.getSettings = getSettings;

module.exports.getSettingsReq = function(req, res) {
  getSettings(req.query.need).then(function(settings){
    res.status(200).send({
      msg: "Settings Found.",
      data: settings
    });
  })
  .catch(function(err){
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
    delete req.body._id;
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

module.exports.backupDB = function(req, res) {
	var date = UtilCtrl.getCurrentDate();
	var cmd = 'mongodump -h ' + config.hosting + ' -d ' + config.databaseName 
	                    + ' -u ' + config.username + ' -p ' + config.password 
	                          + ' -o DB_Backup/' + date;

	deleteFolderRecursive(Path.join(__dirname, '../../../DB_Backup'));

	exec(cmd, function(error, stdout, stderr) {
		Settings.findOneAndUpdate({_id: req.query.id}, {dbVersion: date}, function(err, settings){
      if(err)
        return res.status(500).send(err);
      res.status(200).send({
        msg: "DB Backup.",
        data: settings
      });
    });
	});
}

module.exports.restoreDB = function(req, res) {
  getSettings().then(function(settings){
    settings = settings[0];
    if(_.isNil(settings.dbVersion))
      return res.status(500).send();
      
    var cmd = 'mongorestore -h ' + config.hosting + ' -d ' + config.databaseName 
	                    + ' -u ' + config.username + ' -p ' + config.password 
	                          + ' DB_Backup/' + settings.dbVersion + "/" + config.databaseName + " --drop";
                            console.log(cmd);
    exec(cmd, function(error, stdout, stderr) {
      res.status(200).send({
        msg: "DB Restored."
      });
    });
  });
}