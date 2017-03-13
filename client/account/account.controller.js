(function(){
    app.controller("accountCtrl", ['$scope', '$uibModal', 'mockService', '$sce', 'meanData', '$window',
		function($scope, $uibModal, mockService, $sce, meanData, $window){
		
		_this = this;

		meanData.getAccounts().then(function(res){
			_this.accounts = res.data.data.accountsDetails;
			_this.accountUpdatedDate = res.data.data.date;
		});

		_this.removeAccount = function(id) {
			if($window.confirm("Do you want to delete account?")){
				meanData.deleteAccount(id).then(function(res){
					alert(res.data.msg);
					$window.location.reload();
				}, function(err){
					console.error(err);
				});
			}
		}

		_this.fastUpadteProperty = function(property, oldVal, account) {
			var newVal = $window.prompt("Update " + property, oldVal);
			if(newVal != null){

				account[property] = newVal;
				account.updatedDate = new Date();

				meanData.updateAccount(account).then(function(res){
					alert(res.data.msg);
					$window.location.reload();
				}, function(err){	
					console.error(err);
				});
			}
		}

		_this.showAccountModal = function(title, account){
			$uibModal.open({
				templateUrl: '/account/save/save.account.view.html',
				controller: 'saveAccountCtrl',
				controllerAs: 'SaveAccount',
				resolve: {
					saveAccountPageTitle: function(){
						return title;
					},
					account: function() {
						return account;
					},
				},
				size: 'lg'
			});

		};
  }]);
})();