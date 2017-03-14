var mongoose = require('mongoose');

var RewardRule = mongoose.model('RewardRule');

module.exports.getRewardRulesReq = function(req, res) {
  RewardRule.find({}, function(err,rewardRules){
    if(err)
      return res.status(500).send(err);
    res.status(200).send({
      msg: "RewardRules Found.",
      data: rewardRules
    });
  });
}

var addRewardRule = function(rewardRule) {
  var _rewardRule = new RewardRule();
  _rewardRule.description = rewardRule.description;
  _rewardRule.rewardType = rewardRule.rewardType;
  _rewardRule.rewardMax = rewardRule.rewardMax;
  _rewardRule.redeemMin = rewardRule.redeemMin;
  _rewardRule.startDate = rewardRule.startDate;
  _rewardRule.endDate = rewardRule.endDate;
  _rewardRule.rewardStrategy = rewardRule.rewardStrategy;

  return _rewardRule.save();
}

module.exports.addRewardRule = function(rewardRule) {
  return addRewardRule(rewardRule);
}

module.exports.addRewardRuleReq = function(req, res) {
  addRewardRule(req.body).then(function(){
    res.status(200).send({
      msg: "RewardRules Created.",
      data: rRewardRule
    });
  }, function(err){
    res.status(500).send(err);
  });
}

module.exports.updateRewardRuleReq = function(req, res) {
  var _id = req.body._id;
  delete req.body._id;
  RewardRule.findOneAndUpdate({_id: _id}, req.body, function(err, rRewardRule){
    if(err)
      return res.status(500).send(err);
    res.status(200).send({
      msg: "RewardRules Updated.",
      data: rRewardRule
    });
  });
}

module.exports.deleteRewardRuleReq = function(req, res) {
  RewardRule.findOneAndRemove({_id: req.params.id}, function(err){
    if(err)
      return res.status(500).send(err);
    res.status(200).send({
      msg: "RewardRules Deleted."
    });
  });
}