(function(){
    app.controller("recurringPaymentCtrl", ['$scope', '$uibModalInstance', 'meanData', '$window',
        function($scope, $uibModalInstance, meanData, $window){
        
        var _this = this;
        _this.newRecurringPayment = {};
        _this.transactionCategoryList;
        _this.accounts;

        meanData.getSettings('transactionCategory').then(function(res){
            _this.transactionCategoryList = res.data.data[0].transactionCategory;
        });

        meanData.getAccounts().then(function(res){
            _this.accounts = res.data.data.accountsDetails;
        });

        _this.submit = function() {
            meanData.addRecurringPayment(_this.newRecurringPayment).then(function(res){
                alert(res.data.msg);
                $window.location.reload();
            }, function(err){
                console.error(err);
            });
        }

        _this.cancelModal = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }]);
})();