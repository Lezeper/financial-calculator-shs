(function(){
  app.controller('accountDefaultCtrl', ['$scope', 'meanData', '$uibModal', '$window',
    function($scope, meanData, $uibModal, $window){
    var _this = this;

    _this.rewardRulesInDB;
    _this.accountDefaultList;

    _this.rewardStrategy = {
      rewardCategory: [],
      rewardRatio: 0
    }

    _this.rewardRule = {
      rewardMax: -1,
      redeemMin: -1,
      startDate: new Date('11/11/1111'),
      endDate: new Date('09/09/9999'),
      rewardStrategy: _this.rewardStrategy
    }

    _this.newRewardRules = [];

    _this.addRewardRuleRow = function() {
      _this.newRewardRules.push(angular.copy(_this.rewardRule));
    }

    _this.deleteRewardRuleRow = function(index) {
      _this.newRewardRules.splice(index, 1);
    }

    meanData.getAccountDefault().then(function(res){
      _this.accountDefaultList = res.data.data;
    });

    meanData.getRewardRules().then(function(res){
      _this.rewardRulesInDB = res.data.data;
    });

    _this.removeAccountDefault = function(id) {
      meanData.deleteAccountDefault(id).then(function(res){
        alert(res.data.msg);
        $window.location.reload();
      }, function(err){
        console.error(err);
      });
    }

    _this.submitAccountDefault = function(newAccountDefault) {
      var selectedRewardRuleIdList = [];

      _this.rewardRulesInDB.forEach(function(rrdb){
        if(rrdb.isSelected)
          selectedRewardRuleIdList.push(rrdb._id);
      });

      var obj = {
        newAccountDefault: newAccountDefault,
        selectedRewardRuleIdList: selectedRewardRuleIdList,
        newRewardRules: _this.newRewardRules
      }

      meanData.addAccountDefault(obj).then(function(res){
        alert(res.data.msg);
        $window.location.reload();
      }, function(err){
        console.error(err.data);
      });
    };

    _this.showRewardRuleModal = function(rewardRule){
			$uibModal.open({
        animation: false,
				templateUrl: '/account-default/reward-rule.modal.view.html',
				controller: function(){
          var _this = this;
          _this.rewardRule = rewardRule;
        },
        controllerAs: 'RewardRuleModal',
				size: 'lg'
			});
		};
  }]);
})();