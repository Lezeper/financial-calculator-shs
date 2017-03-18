var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Recurring = mongoose.model('Recurring');
var UtilCtrl = require('../util');

var getRecurringPayments = function() {
    return Recurring.find().populate('payBy').exec();
}

module.exports.getRecurringPayments = getRecurringPayments;

module.exports.getRecurringPaymentsReq = function(req, res) {
  getRecurringPayments().then(function(recurrings){
    res.status(200).send({
      msg: "Recurring Found.",
      data: recurrings
    });
  })
  .catch(function(err){
    res.status(500).send(err);
  })
}

module.exports.addRecurringPaymentReq = function(req, res) {
  var recurring = new Recurring();
  recurring.type = req.body.type;
  recurring.category = UtilCtrl.removeSpace(req.body.category);
  recurring.description = req.body.description;
  recurring.recurringDate = req.body.recurringDate;
  recurring.recurringPeriod = req.body.recurringPeriod;
  recurring.amount = req.body.amount;
  recurring.payAhead = req.body.payAhead;
  recurring.payBy = req.body.payBy;
  recurring.startDate = req.body.startDate;
  recurring.endDate = req.body.endDate;

  recurring.save(function(err, rRecurring){
    if(err)
      return res.status(500).send(err);
    res.status(200).send({
      msg: "Recurring Created.",
      data: rRecurring
    });
  });
}

module.exports.updateRecurringPaymentReq = function(req, res) {
  var _id = req.body._id;
  delete req.body._id;
  Recurring.findOneAndUpdate({_id: _id}, req.body, function(err, rRecurring){
    if(err)
      return res.status(500).send(err);
    res.status(200).send({
      msg: "Recurring Updated.",
      data: rRecurring
    });
  });
}

module.exports.deleteRecurringPaymentReq = function(req, res) {
  Recurring.findOneAndRemove({_id: req.params.id}, function(err){
    if(err)
      return res.status(500).send(err);
    res.status(200).send({
      msg: "Recurring Deleted."
    });
  });
}