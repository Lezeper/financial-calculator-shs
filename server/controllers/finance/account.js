var mongoose = require('mongoose');
var UtilCtrl = require('../util');
var SettingsCtrl = require('./settings');
var Account = mongoose.model('Account');
var _ = require('lodash');

var getAccounts = function() {
  return new Promise(function(resolve, reject){
    Account.find().populate('payBy').populate('rewardRules.rule')
      .exec(function(err, accounts){
      if(err)
        return reject(err);

      SettingsCtrl.getSettings('accountConfirmDate').then(function(settings){
        var result = {};
        result.date = settings[0].accountConfirmDate;
        result.accountsDetails = accounts;
        
        resolve(result);
      }, function(err){
        reject(err);
      });
    });
  });
}

module.exports.getAccounts = getAccounts;

module.exports.getAccountsReq = function(req, res) {
  getAccounts().then(function(result){
    res.status(200).send({
      msg: "Accounts found.",
      data: result
    });
  }, function(err){
    res.status(500).send(err);
  });
}

module.exports.getAccountsNoCreditCardReq = function(req, res) {
  Account.find({'type': {$ne: "CreditCard"}}).populate('pendingTransactions')
    .exec(function(err, accounts){
    if(err)
			return res.status(500).send(err);

    res.status(200).send({
      msg: "Accounts found.",
      data: accounts
    });
  });
}

module.exports.addAccountReq = function(req, res) {
  var account = new Account();
  account.updatedDate = new Date();
  account.accountName = req.body.accountName;
  account.type = req.body.type;
  account.dueDate = req.body.dueDate;
  account.closingDate = req.body.closingDate;
  account.creditLine = req.body.creditLine;
  account.minPayment = req.body.minPayment;
  account.lastBalance = req.body.lastBalance;
  account.pendingTransactions = req.body.pendingTransactions;
  account.balance = req.body.balance;

  if(_.isNil(req.body.apr0Valid))
    account.apr0Valid = false;
  else
    account.apr0Valid = req.body.apr0Valid;

  account.apr0Date = req.body.apr0Date;

  if(account.type !== 'CreditCard')
    account.threshold = 100;
  else
    account.threshold = req.body.threshold;
  
  account.payBy = req.body.payBy;

  if(req.body.rewardRules.length > 0) {
    req.body.rewardRules.forEach(function(rewardRule){
      rewardRule.rule = rewardRule.rule._id;
    });
  }
  account.rewardRules = req.body.rewardRules;

  account.rewards = req.body.rewards;

  account.save(function(err, rAccount){
    if(err)
			return res.status(500).send(err);
		res.status(200).json({
			msg: "Account Created!",
      data: rAccount
		});
  });
}

module.exports.updateAccountReq = function(req, res){
  req.body.updatedDate = new Date();
  var _id = req.body._id;
  delete req.body._id;
  Account.findOneAndUpdate({_id: _id}, req.body, function(err, rAccount){
    if(err)
			return res.status(500).send(err);
		res.status(200).json({
			msg: "Account Updated!",
      data: rAccount
		});
  });
}

module.exports.deleteAccountReq = function(req, res){
  Account.findByIdAndRemove(req.params.id, function(err){
    if(err)
			return res.status(500).send(err);
		res.status(200).json({
			"msg": "Account Deleted!"
		});
  });
}