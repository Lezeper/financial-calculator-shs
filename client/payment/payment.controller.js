(function(){
	app.controller("paymentCtrl", ['$scope', '$uibModal', '$log', 'meanData', '$window',
	function($scope, $uibModal, $log, meanData, $window){
		var _this = this;

		_this.showAddTransaction = function() {
			$uibModal.open({
				templateUrl: '/payment/save/transaction/transaction.view.html',
				controller: 'transactionCtrl',
				controllerAs: 'Transaction',
				size: 'lg'
			});
		};

		_this.showAddRecurring = function() {
			$uibModal.open({
				templateUrl: '/payment/save/recurring-payment/recurring-payment.view.html',
				controller: 'recurringPaymentCtrl',
				controllerAs: 'RecurringPayment',
				size: 'lg'
			});
		};

		_this.removeTransaction = function(id) {
			meanData.deleteTransaction(id).then(function(res){
				alert(res.data.msg);
				$window.location.reload();
			});
		}

		_this.removeRecurring = function(id) {
			meanData.deleteRecurringPayment(id).then(function(res){
				alert(res.data.msg);
				$window.location.reload();
			});
		}

		_this.salaryNeedForPlan = function(plan) {
			meanData.salaryNeedForPlan(plan).then(function(res){
				plan.result = res.data.data;
			});
		}

		meanData.getRecurringPayments().then(function(res){
			_this.recurringPayments = res.data.data;
		});

		meanData.getTransactions().then(function(res){
			_this.transactioins = res.data.data;
		});

		meanData.getAccountsNotCreditCard().then(function(res){
			_this.nonCreditCardAccounts = res.data.data;
		});
	}]);
})();