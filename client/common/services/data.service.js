(function () {
  app.service('meanData', ['$http',
      function meanData($http) {
    
    var _this = this;
    
    _this.financialServerUrl = '/rest/finance';

    var doFinancialPrediction = function(startDate, endDate) {
      return $http.get(_this.financialServerUrl + '/budget?sd=' + startDate + '&ed=' + endDate);
    }
    
    var comsumptionCapacityByDate = function(date) {
      return $http.get(_this.financialServerUrl + '/budget/coms-cap?date=' + date);
    }

    var canHasTransaction = function(transactions) {
      return $http.put(_this.financialServerUrl + '/budget/trans-perm', transactions);
    }

    var salaryNeedForPlan = function(plan) {
      return $http.put(_this.financialServerUrl + '/budget/salary-need', plan);
    }

    /* Recurring Payment */
    var getRecurringPayments = function() {
      return $http.get(_this.financialServerUrl + '/recurring');
    }

    var addRecurringPayment = function(recurring) {
      return $http.post(_this.financialServerUrl + '/recurring', recurring);
    }

    var updateRecurringPayment = function(recurring) {
      return $http.put(_this.financialServerUrl + '/recurring', recurring);
    }

    var deleteRecurringPayment = function(id) {
      return $http.delete(_this.financialServerUrl + '/recurring/' + id);
    }

    /* Transaction */
    var getTransactions = function(isPending) {
      return $http.get(_this.financialServerUrl + '/transaction?isPending' + isPending);
    }

    var addTransaction = function(transaction) {
      return $http.post(_this.financialServerUrl + '/transaction', transaction);
    }

    var updateTransaction = function(transaction) {
      return $http.put(_this.financialServerUrl + '/transaction', transaction);
    }

    var deleteTransaction = function(id) {
      return $http.delete(_this.financialServerUrl + '/transaction/' + id);
    }

    /* Account */
    var getAccounts = function() {
      return $http.get(_this.financialServerUrl + '/account');
    }

    var addAccount = function(account) {
      return $http.post(_this.financialServerUrl + '/account', account);
    }

    var updateAccount = function(account) {
      return $http.put(_this.financialServerUrl + '/account', account);
    }

    var deleteAccount = function(id) {
      return $http.delete(_this.financialServerUrl + '/account/' + id);
    }

    var getAccountsNotCreditCard = function() {
      return $http.get(_this.financialServerUrl + '/account/not-cc');
    }

    /* Account Default */
    var getAccountDefault = function() {
      return $http.get(_this.financialServerUrl + '/account-default');
    }

    var addAccountDefault = function(accountDefault) {
      return $http.post(_this.financialServerUrl + '/account-default', accountDefault);
    }

    var deleteAccountDefault = function(id) {
      return $http.delete(_this.financialServerUrl + '/account-default/' + id);
    }

    /* Reward Rule */
    var getRewardRules = function() {
      return $http.get(_this.financialServerUrl + '/reward-rule');
    }

    var addRewardRule = function(rewardRule) {
      return $http.post(_this.financialServerUrl + '/reward-rule', rewardRule);
    }

    var updateRewardRule = function(rewardRule) {
      return $http.put(_this.financialServerUrl + '/reward-rule', rewardRule);
    }

    var deleteRewardRule = function(id) {
      return $http.delete(_this.financialServerUrl + '/reward-rule/', id);
    }

    /* Setting */
    var getSettings = function(need) {
      return $http.get(_this.financialServerUrl + '/settings?need=' + need);
    }

    var updateSettings = function(settings) {
      return $http.put(_this.financialServerUrl + '/settings', settings);
    }

    var backUpDB = function(id) {
      return $http.put(_this.financialServerUrl + '/settings/db-backup?id=' + id);
    }

    var restoreDB = function(id) {
      return $http.put(_this.financialServerUrl + '/settings/db-restore?id=' + id);
    }

    return {
      doFinancialPrediction: doFinancialPrediction,
      getRecurringPayments: getRecurringPayments,
      addRecurringPayment: addRecurringPayment,
      deleteRecurringPayment: deleteRecurringPayment,
      getTransactions: getTransactions,
      addTransaction: addTransaction,
      updateTransaction: updateTransaction,
      deleteTransaction: deleteTransaction,
      getAccountDefault: getAccountDefault,
      addAccountDefault: addAccountDefault,
      deleteAccountDefault: deleteAccountDefault,
      getAccounts: getAccounts,
      addAccount: addAccount,
      updateAccount: updateAccount,
      deleteAccount: deleteAccount,
      getRewardRules: getRewardRules,
      addRewardRule: addRewardRule,
      updateRewardRule: updateRewardRule,
      deleteRewardRule: deleteRewardRule,
      getAccountsNotCreditCard: getAccountsNotCreditCard,
      getSettings: getSettings,
      updateSettings: updateSettings,
      canHasTransaction: canHasTransaction,
      comsumptionCapacityByDate: comsumptionCapacityByDate,
      salaryNeedForPlan: salaryNeedForPlan,
      backUpDB: backUpDB,
      restoreDB: restoreDB
    }
  }])
})();