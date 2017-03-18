var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var AccountDefault = mongoose.model('AccountDefault');
var rewardRuleCtrl = require('./reward-rule');

var getAccountDefault = function() {
  return AccountDefault.find().populate('rewardRules').exec();
}

module.exports.getAccountDefault = getAccountDefault;

module.exports.getAccountDefaultReq = function(req, res) {
  getAccountDefault().then(function(accountDefaults){
    res.status(200).send({
      msg: "Account Default Found.",
      data: accountDefaults
    });
  })
  .catch(function(err){
    res.status(500).send(err);
  });
}

module.exports.addAccountDefaultReq = function(req, res) {
  var accountDefault = new AccountDefault();
  var reqNewAccountDefault = req.body.newAccountDefault;
  var reqSelectedRewardRuleIdList = req.body.selectedRewardRuleIdList;
  var reqNewRewardRules = req.body.newRewardRules;

  accountDefault.accountName = reqNewAccountDefault.accountName;
  accountDefault.type = reqNewAccountDefault.type;
  accountDefault.rewardType = reqNewAccountDefault.rewardType;
  accountDefault.rewardRules = [];

  // put selected Default Reward Rule
  reqSelectedRewardRuleIdList.forEach(function(selectedRewardRuleId){
    accountDefault.rewardRules.push(selectedRewardRuleId);
  });

  // create new reward rule one by one
  var rewardRulePromiseList = [];
  reqNewRewardRules.forEach(function(newRewardRule){
    rewardRulePromiseList.push(rewardRuleCtrl.addRewardRule(newRewardRule));
  });

  // wait for all the reward rule created
  Promise.all(rewardRulePromiseList).then(function(resDataList){
    resDataList.forEach(function(resData){
      accountDefault.rewardRules.push(resData._id);
    });

    accountDefault.save(function(err, rAccount){
      if(err)
        return res.status(500).send(err);
      res.status(200).send({
        msg: "Account Default Created.",
        data: rAccount
      });
    });
  });
}

module.exports.updateAccountDefaultReq = function(req, res) {
  var _id = req.body._id;
  delete req.body._id;
  AccountDefault.findOneAndUpdate({_id: _id}, req.body, function(err, accountDefault){
    if(err)
      return res.status(500).send(err);
    res.status(200).send({
      msg: "Account Default Updated.",
      data: accountDefault
    });
  });
}

module.exports.deleteAccountDefaultReq = function(req, res) {
  AccountDefault.findOneAndRemove({_id: req.params.id}, function(err){
    if(err)
      return res.status(500).send(err);
    res.status(200).send({
      msg: "Account Default Deleted."
    });
  });
}