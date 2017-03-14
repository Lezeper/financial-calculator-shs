/* Please make sure all date object in this controller is moment object */

var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var UtilCtrl = require('../util');
var TransactionCtrl = require('./transaction');
var RecurringCtrl = require('./recurring');
var AccountDefault = require('./account-default');
var AccountCtrl = require('./account');

// high level data init here...
var currentFinanceSafe = true;
var currentCalculatingDate;
var lowestBalanceAccounts = new Map(); // {_id, date, accountName, balance}

var deleteChanged = function(accounts) {
  accounts.forEach(function(account){
    if(typeof account.changed !== 'undefined')
      delete account.changed;
  });
}

var isPayRecurringDate = function(currentDate, recurringPayment) {
  var tempRecurringtDate = UtilCtrl.clone(recurringPayment.recurringDate);

  if(recurringPayment.recurringPeriod === 'months') {
    var payDate = UtilCtrl.dateFormat(tempRecurringtDate, 'D').subtract(recurringPayment.payAhead, 'days');
    if(payDate.format('D')*1  === currentDate.format('D')*1 
      && UtilCtrl.isTargetDateBetween(recurringPayment.startDate, recurringPayment.endDate, currentDate)) {
        return true;
    }
  }
  if(recurringPayment.recurringPeriod === 'weeks') {
    var payDate = UtilCtrl.dateFormat(tempRecurringtDate, 'dddd').subtract(recurringPayment.payAhead, 'days');    
    if(payDate.format('dddd') === currentDate.format('dddd') 
      && UtilCtrl.isTargetDateBetween(recurringPayment.startDate, recurringPayment.endDate, currentDate)) {
        return true;
    }
  }
  return false;
  
}

var calculateReward = function(ccRule, transaction, rewardRatio, account) {
  var temp = UtilCtrl.clone(ccRule.earned);
  ccRule.earned += transaction.amount * rewardRatio;
  // it don't have max reward limitation
  if(ccRule.rule.rewardMax != -1) {
    if(ccRule.earned >= ccRule.rewardMax) 
      ccRule.earned = ccRule.rewardMax;
  }
  if(account.pendingRewards)
    return account.pendingRewards += (ccRule.earned - temp);
  else
    return account.pendingRewards = (ccRule.earned - temp);
}

var categoryRewardCalculator = function(account, transaction, currentCalculatingDate) {
  // sort reward rules make sure the higher reward ratio come first
  account.rewardRules.sort(function(r1, r2){
    return r2.rule.rewardStrategy.rewardRatio - r1.rule.rewardStrategy.rewardRatio;
  });

  // go through credit card rules
  for(var i = 0; i < account.rewardRules.length; i++) {
    // go through reward categories to match transaction category
    for(var k = 0; k < account.rewardRules[i].rule.rewardStrategy.rewardCategory.length; k++) {
      // if it has category reward
      if(UtilCtrl.removeSpace(account.rewardRules[i].rule.rewardStrategy.rewardCategory[k]) === UtilCtrl.removeSpace(transaction.category)) {
        // if this category reward still not expire
        if(UtilCtrl.isTargetDateBetween(account.rewardRules[i].rule.startDate, account.rewardRules[i].rule.endDate, currentCalculatingDate)) {
          return calculateReward(account.rewardRules[i], transaction, account.rewardRules[i].rule.rewardStrategy.rewardRatio/100, account);
        }
      }
      // if code runs here, then it means no category reward
      if(UtilCtrl.removeSpace(account.rewardRules[i].rule.rewardStrategy.rewardCategory[k]) === 'All') {
        if(UtilCtrl.isTargetDateBetween(account.rewardRules[i].rule.startDate, account.rewardRules[i].rule.endDate, currentCalculatingDate)) {
          return calculateReward(account.rewardRules[i], transaction, account.rewardRules[i].rule.rewardStrategy.rewardRatio/100, account);
        }
      }
    }
  }
}

var updateByAccountType = function(accountType, transactionType, updateProperty, amount) {
  // transaction is debit behavior
  // for credit card need to add number
  // for others account need to subtract number
  if(transactionType === UtilCtrl.transactionType('debit')) {
    if(accountType === UtilCtrl.accountType('cc')) {
      updateProperty += amount;
    } else {
      updateProperty -= amount;
    }
  } else {
    if(accountType === UtilCtrl.accountType('cc')) {
      updateProperty -= amount;
    } else {
      updateProperty += amount;
    }
  }
  return updateProperty; // it could be negative
}

var addChanged = function(accountType, transactionType, updateProperty, amount) {
  updateProperty = !isNaN(updateProperty) ? updateProperty : 0;
  return updateByAccountType(accountType, transactionType, updateProperty, amount);
}

// in transaction date, it may have recurring date format ("5"), so need other date
var findAccountAndUpdateBalance = function(transaction, accounts, currentCalculatingDate) {
  accounts.forEach(function(account){
    if(account._id == transaction.payBy._id){
      account.balance = updateByAccountType(account.type, transaction.type, account.balance, transaction.amount);
      // TODO: should we remove this? it must be credit to a credit card.
      if(account.type == UtilCtrl.accountType('cc')){
        // if the credit line is safe...
        if(account.creditLine <= (account.balance + transaction.amount))
          currentFinanceSafe = false;
        // categoryRewardCalculator(account, transaction, currentCalculatingDate);
      }
      if(account.balance <= 0)
        currentFinanceSafe = false;
      account.changed = addChanged(account.type, transaction.type, account.changed, transaction.amount);
    }
  });
}

var findAccountAndAddPayment = function(transaction, accounts, currentCalculatingDate) {
  // if this transaction is credit card and debit, then add to pending
  if(transaction.type == UtilCtrl.transactionType('debit') 
      && transaction.payBy.type == UtilCtrl.accountType('cc')) {
    for(var i = 0; i < accounts.length; i++) {
      if(accounts[i]._id == transaction.payBy._id){
        accounts[i].pendingTransactions.push(UtilCtrl.clone({
          date: currentCalculatingDate,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          type: transaction.type
        }));
        break;
      }
    }
  } else {
    // if this transaction is debit, or not credit card
    findAccountAndUpdateBalance(transaction, accounts, currentCalculatingDate);
  }
}

// find out the payment account to pay this credit card
var findAccountPayCreditCart = function(accounts, cc, needPay, description) {
  var result = [];
  accounts.forEach(function(account){
    if(account._id == cc.payBy._id){
      account.balance -= needPay; // pay from account

      if(account.balance <= 0)
        currentFinanceSafe = false;
      
      account.changed = addChanged(account.type, UtilCtrl.transactionType('debit'), account.changed, needPay);
      cc.balance -= needPay; // payoff credit card

      // whether this balance is lowest
      if(lowestBalanceAccounts.has(account._id)){
        if(lowestBalanceAccounts.get(account._id).balance*1 > account.balance){
          lowestBalanceAccounts.set(account._id, 
            UtilCtrl.clone({
              date: currentCalculatingDate, balance: account.balance, accountName: account.accountName
            })
          );
        }
      } else {
        lowestBalanceAccounts.set(account._id, 
          UtilCtrl.clone({
            date: currentCalculatingDate, balance: account.balance, accountName: account.accountName
          })
        );
      }

      result.push({description: description, type: UtilCtrl.transactionType('credit'), 
            amount: needPay, payBy: {accountName: cc.accountName, _id: cc._id}});
      result.push({description: "Payment for "+ cc.accountName, type: UtilCtrl.transactionType('debit'), 
            amount: needPay, payBy: {accountName: account.accountName, _id: cc._id}});
    }
  });
  return result;
}

var payExtraForUtilRatio = function(cc, accounts) {
  // it means it will remain some balance according to the threshold
  var thresholdBalance = cc.creditLine * cc.threshold / 100;
  var needPay = 0;

  // how much balance you can have shows on the statement
  if(thresholdBalance < cc.balance) {
    // need to pay more for making balance on the statemnent lower
    needPay += (cc.balance - thresholdBalance);
  }
  
  cc.changed = addChanged(cc.type, UtilCtrl.transactionType('credit'), cc.changed, needPay);
  return findAccountPayCreditCart(accounts, cc, needPay, "Pay Extra For Util Ratio");
}

var makeDueDatePayment = function(cc, accounts) {
  var needPay = 0;
  var description;
  // if user want to use apr 0
  if(cc.apr0Valid && UtilCtrl.isTargetDateBetween(cc.apr0Date.startDate, cc.apr0Date.endDate, cc.dueDate)) {
    needPay = cc.minPayment;
    if(needPay > cc.balance)
      needPay = cc.balance;
    cc.lastBalance = (cc.balance - needPay);
    description = "Min Payment"
  } else {
    needPay = cc.lastBalance;
    cc.lastBalance = 0;
    description = "Last Statment Payment";
  }
  cc.changed = addChanged(cc.type, UtilCtrl.transactionType('credit'), cc.changed, needPay);
  return findAccountPayCreditCart(accounts, cc, needPay, description);
}

// will check everyday
var convertPendingToBlance = function(accounts, currentDate) {
  accounts.forEach(function(account){

    if(_.isNil(account.pendingTransactions))
      account.pendingTransactions = [];

    // go through each pending transactions
    var removedPending = [];
    for(var i = 0; i < account.pendingTransactions.length; i++){
      var tempDate = UtilCtrl.nextPostedDay(UtilCtrl.clone(UtilCtrl.dateValidator(account.pendingTransactions[i].date)));
      // if time is matched
      var t = currentDate.diff(tempDate, 'days') >= 0;
      if(currentDate.diff(tempDate, 'days') >= 0){
        account.balance += account.pendingTransactions[i].amount;
        account.changed = addChanged(account.type, UtilCtrl.transactionType('debit'), account.changed, account.pendingTransactions[i].amount);
        removedPending.push(i);
        
        // calculate rewards after pending convert to balance
        categoryRewardCalculator(account, account.pendingTransactions[i], currentDate);
      }
    }
    if(removedPending.length > 0) {
      // remove from back then it will not effect index
      for(var j = removedPending.length; j >= 0; j--){
        account.pendingTransactions.splice(removedPending[j--], 1);
      }
    }
  });
}

var doFinancialPredict = function(startDate, endDate, latestAccountsInfo, transactions, recurringPayments) {
  // initial data here and will return those back
  var statements = []; // properties: date, accountsDetails, transactions
  var events = []; // date and status
  var financeDangerDate = [];
  lowestBalanceAccounts = new Map(); // {_id, balance}
  currentFinanceSafe = true; // no negative balance on checking or saving account

  var maxCushionDay = 5;

  // make sure date format is correct
  startDate = UtilCtrl.dateValidator(startDate);
  endDate = UtilCtrl.dateValidator(endDate);

  var latestAccountsInfoDate = UtilCtrl.dateValidator(latestAccountsInfo.date);
  // start date can not earlier than lastest accounts date
  if(startDate.diff(new Date(latestAccountsInfo.date), 'days') < 0)
    return console.error("start date can not earlier than lastest accounts date");
  // end date can not earlier than lastest accounts date and start date
  if(endDate.diff(new Date(latestAccountsInfo.date), 'days') < 0 || endDate.diff(new Date(startDate.date), 'days') < 0)
    return console.error("end date can not earlier than lastest accounts date and start date");
  
  // statements.push(UtilCtrl.clone(latestAccountsInfo));
  var duration = endDate.diff(latestAccountsInfoDate, 'days');
  currentCalculatingDate = UtilCtrl.clone(latestAccountsInfoDate);
  // the temp account for calculating
  var tempAccountsDetails = UtilCtrl.clone(latestAccountsInfo.accountsDetails);

  // calculating statement each day
  for(var i = 0; i < duration; i++) {
    // break the loop if too many crise found
    if(maxCushionDay < 0)
      break;

    currentCalculatingDate.add(1, 'days');

    // initial data here...
    var currentStatement;
    
    var currentTransactions = [];
    // clean needPay property
    deleteChanged(tempAccountsDetails);
    // pending convert to balance check
    convertPendingToBlance(tempAccountsDetails, currentCalculatingDate);

    // check whether there is a transaction in this time (one-off payment)
    for (var j = 0; j < transactions.length; j++) {
      if(UtilCtrl.dateValidator(transactions[j].date).diff(currentCalculatingDate, 'days') === 0) {
        findAccountAndAddPayment(transactions[j], tempAccountsDetails, currentCalculatingDate);
        currentTransactions.push(transactions[j]);
      }
    }
    
    // check whether have recurring payment in this time
    for (var k = 0; k < recurringPayments.length; k++) {
      // if recurring date match current date
      if(isPayRecurringDate(currentCalculatingDate, recurringPayments[k])){
        findAccountAndAddPayment(recurringPayments[k], tempAccountsDetails, currentCalculatingDate);     
        currentTransactions.push(recurringPayments[k]);
      }
    }

    // Check wether should pay the credit card
    for (var h = 0; h < tempAccountsDetails.length; h++) {
      // it is not checking or cash
      if(!_.isNil(tempAccountsDetails[h].dueDate)) {
        var currentDueDate = UtilCtrl.dateValidator(UtilCtrl.clone(tempAccountsDetails[h].dueDate));
        var currentClosingDate = UtilCtrl.dateValidator(UtilCtrl.clone(tempAccountsDetails[h].closingDate));
        // due date need to pay min payment or last statement balance
        if((currentDueDate.diff(currentCalculatingDate, 'days') == 0)) {
          var dueDatePaymentInfo = UtilCtrl.clone(makeDueDatePayment(tempAccountsDetails[h], tempAccountsDetails));
          currentTransactions.push(dueDatePaymentInfo[0]);
          currentTransactions.push(dueDatePaymentInfo[1]);
          // assign new due date
          var tempCurrentDueDate = UtilCtrl.clone(currentDueDate);
          tempAccountsDetails[h].dueDate = UtilCtrl.dateString(tempCurrentDueDate.add(1, 'months'), 1);
        }
        // closing date need to check utilization ratio
        if((currentClosingDate.diff(currentCalculatingDate, 'days') == 0)) {
          var closingDatePaymentInfo = UtilCtrl.clone(payExtraForUtilRatio(tempAccountsDetails[h], tempAccountsDetails));
          currentTransactions.push(closingDatePaymentInfo[0]);
          currentTransactions.push(closingDatePaymentInfo[1]);
          // assign new due date
          var tempCurrentClosingDate = UtilCtrl.clone(currentClosingDate);            
          tempAccountsDetails[h].closingDate = UtilCtrl.dateString(tempCurrentClosingDate.add(1, 'months'), 1);
        }
        // next day of closing date, generate statment and calculate rewards
        var tempCurrentClosingDate = UtilCtrl.clone(currentClosingDate);  
        if((currentCalculatingDate.diff(tempCurrentClosingDate.add(-1, 'months'), 'days') == 1)) {
          // rewards
          if(tempAccountsDetails[h].pendingRewards){
            tempAccountsDetails[h].rewards += UtilCtrl.clone(tempAccountsDetails[h].pendingRewards);
            tempAccountsDetails[h].pendingRewards = 0;
          }
        }
      }
    }
    currentStatement = {date: UtilCtrl.dateString(currentCalculatingDate, 0), accountsDetails: tempAccountsDetails, 
            transactions: currentTransactions};

    // push current statement to statements if there is blance change
    if (currentCalculatingDate.diff(startDate, 'days') >= 0 && currentTransactions.length > 0){
      statements.push(UtilCtrl.clone(currentStatement));
      // Calendar Finance Status Settings
      var financeStatus;
      if(currentFinanceSafe){
        financeStatus = "cal-finance-safe";
      } else {
        financeStatus = "cal-finance-warning";
        financeDangerDate.push(UtilCtrl.dateString(currentCalculatingDate, 1));
      }
      events.push({date: UtilCtrl.dateString(currentCalculatingDate, 1), financeStatus: financeStatus});
    }

    if(!currentFinanceSafe)
      maxCushionDay--;
  }

  var lowestBalanceInAccountList = [];
  lowestBalanceAccounts.forEach(function(value, key){
    lowestBalanceInAccountList.push({
      balance: value.balance,
      date: value.date,
      accountName: value.accountName,
      _id: key
    });
  });
  
  var result = UtilCtrl.clone({
    events: events,
    financeDangerDate: financeDangerDate,
    statements: statements,
    // lowestBalanceAccounts: lowestBalanceAccounts
    lowestBalanceInAccountList: lowestBalanceInAccountList
  });
  
  return result;
}

module.exports.canHasTransaction = function(req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var amount = req.body.amount;
  var date = req.body.date;
  var category = req.body.category;

  if(_.isNil(startDate))
    startDate = UtilCtrl.getCurrentDate();
  if(_.isNil(endDate))
    return console.error("End Date not defined");
  
  endDate = UtilCtrl.getCurrentDate().add(endDate, 'month');
  
  if(!_.isNil(date) && !_.isNil(amount)){
    Promise.all([
      AccountCtrl.getAccounts(),
      TransactionCtrl.getTransactions(),
      RecurringCtrl.getRecurringPayments(),
    ]).then(function(resData){
      // [{avaliableAccount}, [lowestBalanceInAccountList], [statements]]
      var avaliableAccounts = [];
      var transaction = {
        amount: amount,
        date: date,
        category: category, // maybe can use reward to pay
        type: "Debit",
        payBy: null
      };
      
      UtilCtrl.clone(resData[0]).accountsDetails.forEach(function(account, index){
        var transactions = UtilCtrl.clone(resData[1]);
        var latestAccountsInfo = UtilCtrl.clone(resData[0]);
        var recurringPayments = UtilCtrl.clone(resData[2]);

        transaction.payBy = account;
        transactions.push(UtilCtrl.clone(transaction));

        var predictResult = UtilCtrl.clone(doFinancialPredict(startDate, endDate, latestAccountsInfo, transactions, recurringPayments));
        
        if(predictResult.financeDangerDate.length == 0) {
          avaliableAccounts.push(UtilCtrl.clone({
            avaliableAccount: account,
            lowestBalanceInAccountList: predictResult.lowestBalanceInAccountList,
            statements: predictResult.statements
          }));
        }

        if(index == resData[0].accountsDetails.length-1){
          res.status(200).send(avaliableAccounts);
        }
      });
    });
  }
}

module.exports.doFinancialPredict = function(req, res) {
  if(!_.isNil(req.query.sd) && !_.isNil(req.query.ed)) {
    Promise.all([
      AccountCtrl.getAccounts(),
      TransactionCtrl.getTransactions(),
      RecurringCtrl.getRecurringPayments(),
    ]).then(function(resData){
      var latestAccountsInfo = resData[0];
      var transactions = resData[1];
      var recurringPayments = resData[2];
      
      var result = doFinancialPredict(req.query.sd, req.query.ed, latestAccountsInfo, transactions, recurringPayments);

      res.status(200).send(result);
    });
  } else {
    res.status(500).send({
      msg: "Start Date or End Date not found."
    });
  }
}