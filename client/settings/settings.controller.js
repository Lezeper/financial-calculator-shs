(function(){
  app.controller('settingsCtrl', ['$scope', 'meanData', '$window', 'utilService',
    function($scope, meanData, $window, utilService){
    var _this = this;
    _this.settings;
    _this.canTransaction;
    _this.backupDBVersion;

    meanData.getSettings().then(function(res){
      _this.settings = res.data.data[0];
      _this.settings.accountConfirmDate = new Date(res.data.data[0].accountConfirmDate);
    });

    _this.updateSettings = function() {
      meanData.updateSettings(_this.settings).then(function(res){
        alert(res.data.msg);
        $window.location.reload();
      });
    }

    _this.canHasTransaction = function(transaction){
      utilService.loading = true;
      meanData.canHasTransaction(transaction).then(function(res){
        if(res.data.length == 0)
          return alert("You can't has this transaction");
        _this.avaliableAccounts = res.data;
        utilService.loading = false;
        
      });
    }

    _this.comsumptionCapacityByDate = function(date) {
      utilService.loading = true;
      date = moment().add(1, 'day');
      meanData.comsumptionCapacityByDate(date).then(function(res){
        _this.settings.comsumptionCapacity = res.data.balance;
        utilService.loading = false;
      });
    }

    _this.backupDB = function() {
      utilService.loading = true;
      if(_this.settings._id) {
        meanData.backUpDB(_this.settings._id).then(function(res){
          alert(res.data.msg);
          utilService.loading = false;
          $window.location.reload();
        });
      }
    }

    _this.restoreDB = function() {
      utilService.loading = true;
      if(_this.settings._id) {
        meanData.restoreDB(_this.settings._id).then(function(res){
          utilService.loading = false;
          alert(res.data.msg);
          $window.location.reload();
        });
      }
    }
  }]);
})();