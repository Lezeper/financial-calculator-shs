var _ = require('lodash');
var moment = require('moment');

var dateValidator = function(date) {
  if(_.isNil(date))
    return null;
  return date instanceof moment ? date : moment(new Date(date));
}

module.exports.getCurrentDate = function() {
  return moment();
}

module.exports.dateFormat = function(date, format) {
  if(moment(date, format).isValid)
    return moment(date, format);
  else
    console.error("Date Format is not Valid!");
}

module.exports.dateString = function(date, flag){
  // flag 0: return string; add weekday, 2/17/2017 Tuesday
  // flag 1: return string; month day year, 2/2/2017
  date = dateValidator(date);
  if(_.isNil(date))
    return console.log("Can't regonize...");
  
  if (flag === 0)
    return date.format('MM/DD/YYYY, dddd');
  if (flag === 1)
    return date.format('MM/DD/YYYY');
}

module.exports.timeUsage = function(startTime, endTime, unit) {
  console.info("Time Usage: " + dateValidator(endTime).diff(startTime, unit));
}

module.exports.nextPostedDay = function(date) {
  date = dateValidator(date);
  if(date.format('dddd') === 'Friday') {
    return date.add(4, 'days');
  } else if(date.format('dddd') === 'Saturday'){
    return date.add(3, 'days');
  } else {
    return date.add(2, 'days');
  }
}

module.exports.nextBusinessDay = function(date) {
  date = dateValidator(date);
  if(date.format('dddd') === 'Friday') {
    return date.add(3, 'days');
  } else if(date.format('dddd') === 'Saturday'){
    return date.add(2, 'days');
  } else {
    return date.add(1, 'days');
  }
}

module.exports.removeSpace = function(str) {
  return str.replace(/\s+/g, '');
}

module.exports.clone = function(obj) {
  if(obj instanceof Date)
    return new Date(obj);
  if(obj instanceof moment)
    return new moment(obj);
  return JSON.parse(JSON.stringify(obj));
}

module.exports.accountType = function(type) {
  if (type === 'cc')
    return 'CreditCard';
  if(type === 'cash')
    return 'Cash';
  if(type === 'checking')
    return 'Checking';
  if(type === 'saving')
    return 'Saving';
  if(type === 'gift')
    return 'GiftCard';
}

module.exports.transactionType = function(type) {
  if(type === 'debit')
    return 'Debit';
  if(type === 'credit')
    return 'Credit';
}

module.exports.isTargetDateBetween = function(startDate, endDate, targetDate) {
  if(_.isNil(endDate) || _.isNil(startDate) || _.isNil(targetDate))
    return console.error("Date is not valid");
  
  startDate = startDate instanceof moment ? startDate : moment(new Date(startDate));
  endDate = endDate instanceof moment ? endDate : moment(new Date(endDate));
  targetDate = targetDate instanceof moment ? targetDate : moment(new Date(targetDate));
  return targetDate.diff(startDate, 'days') >= 0 && endDate.diff(targetDate, 'days') >= 0;
}

module.exports.dateValidator = dateValidator;