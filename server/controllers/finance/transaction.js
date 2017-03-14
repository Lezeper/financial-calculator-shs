var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');
var _ = require('lodash');
var UtilCtrl = require('../util');

var getTransactions = function(isPending) {
  return new Promise(function(resolve, reject){
    var conditions = {};
    if(!_.isNil(isPending)) {
      conditions = {'isPending': isPending};
    }
    return Transaction.find(conditions).populate('payBy').exec(function(err, transactions){
      if(err)
			  reject(err);
      resolve(transactions);
    });
  });
}

module.exports.getTransactions = getTransactions;

module.exports.getTransactionsReq = function(req, res) {
  getTransactions(req.query.isPending).then(function(transactions){
		res.status(200).json({
			msg: "Transaction Found.",
      data: transactions
		});
  }, function(err){
    res.status(500).send(err);
  });
}

module.exports.addTransactionReq = function(req, res) {
  var transaction = new Transaction();
  transaction.type = req.body.type;
  transaction.category = UtilCtrl.removeSpace(req.body.category);
  transaction.description = req.body.description;
  transaction.date = req.body.date;
  transaction.amount = req.body.amount;
  transaction.payBy = req.body.payBy;
  transaction.isPending = _.isNil(req.body.isPending) ? false : req.body.isPending;

  transaction.save(function(err, rTransaction){
    if(err)
			return res.status(500).send(err);
		res.status(200).json({
			msg: "Transaction Added.",
      data: rTransaction
		});
  });
}

module.exports.updateTransactionReq = function(req, res) {
  var _id = req.body._id;
  Transaction.findOneAndUpdate({_id: _id}, req.body, function(err, rTransaction){
    if(err)
			return res.status(500).send(err);
		res.status(200).json({
			msg: "Transaction Updated.",
      data: rTransaction
		});
  });
}

module.exports.deleteTransactionReq = function(req, res) {
  Transaction.findOneAndRemove({_id: req.params.id}, function(err){
    if(err)
			return res.status(500).send(err);
		res.status(200).json({
			msg: "Transaction Deleted."
		});
  });
}