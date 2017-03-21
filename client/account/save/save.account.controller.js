(function(){
    app.controller("saveAccountCtrl", ['$scope', 'saveAccountPageTitle', 'account', '$uibModalInstance', 'meanData', '$window',
        function($scope, saveAccountPageTitle, account, $uibModalInstance, meanData, $window){
        // initial data here...
        var _this = this;
        _this.account = account;
        _this.nAccount = {};
        _this.nAccount.pendingTransactions = [];
        _this.saveAccountFlag = {};
        _this.saveAccountPageTitle = saveAccountPageTitle;
        _this.transactionCategoryList = [];
        _this.accountDefault;
        _this.payByAccounts;

        var setSaveAccountFlag = function(bool) {
            if(typeof bool !== 'boolean')
                return;
            _this.saveAccountFlag = {
                "accountName": bool,
                "last4Num": bool,
                "dueDate": bool,
                "closingDate": bool,
                "minPayment": bool,
                "creditLine": bool,
                "balance": bool,
                "lastBalance": bool,
                "threshold": bool,
                "resetEdit": bool,
                "resetSubmit": !bool,
                "submit": !bool,
                "edit": bool,
                "apr0Valid": bool,
                "apr0Date": bool,
                "pendingTransactions": bool,
                "rewards": bool,
                "rewardRules": bool,
                "payBy": bool,
            };
        }

        var newPendingTransaction = {
            type: "Debit",
            category: null,
            description: null,
            date: null,
            amount: 0
        }

        _this.addPendingTransactionRow = function() {
            _this.nAccount.pendingTransactions.push(angular.copy(newPendingTransaction));
        }

        _this.deletePendingTransactionRow = function(index) {
            _this.nAccount.pendingTransactions.splice(index, 1);
        }

        _this.updateAccount = function(account) {
            meanData.updateAccount(account).then(function(res){
                alert(res.data.msg);
                $window.location.reload();
            }, function(err){
                console.error(err);
            });
        }

        _this.addAccount = function(account) {
            meanData.addAccount(account).then(function(res){
                alert(res.data.msg);
                $window.location.reload();
            },function(err){
                console.error(err.data.message);
                console.error(err.data);
            });
            _this.cancelModal();
        }

        _this.cancelModal = function() {
            $uibModalInstance.dismiss('cancel');
        }

        _this.resetEdit = function(editAccount, origin) {
            Object.keys(editAccount).forEach(function(prop){
                editAccount[prop] = origin[prop];
            });
        }

        _this.selectedAccountDefault = function() {
            _this.accountDefault.forEach(function(ad){
                if(ad.accountName === _this.nAccount.accountName) {
                    _this.nAccount.type = ad.type;
                    _this.nAccount.rewardRules = [];
                    ad.rewardRules.forEach(function(adRewardRule){
                        _this.nAccount.rewardRules.push({
                            rule: adRewardRule,
                            earned: 0,
                            startDate: new Date(adRewardRule.startDate),
                            endDate: new Date(adRewardRule.endDate)
                        });
                    });
                }
            });
        }

        _this.deleteAccount = function(account) {
            meanData.deleteAccountDefault(account._id).then(function(res){
                // after delete
            });
        }

        // edit or check account details
        if(account) {
            setSaveAccountFlag(true);
            // date format
            _this.account = angular.copy(account);
            _this.nAccount = angular.copy(account);
        } else {
            // add new account
            setSaveAccountFlag(false);
        }

        meanData.getAccountDefault().then(function(ad){
            _this.accountDefault = ad.data.data;
        });
        meanData.getAccountsNotCreditCard().then(function(ancc){
            _this.payByAccounts = ancc.data.data;
        });
        meanData.getSettings('transactionCategory').then(function(tc){
            _this.transactionCategoryList = tc.data.data[0].transactionCategory;
        });
    }]);
})();