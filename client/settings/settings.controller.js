(function(){
  app.controller('settingsCtrl', ['$scope', 'meanData', '$window', 
    function($scope, meanData, $window){
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
      meanData.canHasTransaction(transaction).then(function(res){
        if(res.data.length == 0)
          return alert("You can't has this transaction");
        _this.avaliableAccounts = res.data;
      });
    }

    _this.comsumptionCapacityByDate = function(date) {
      date = moment().add(1, 'day');
      meanData.comsumptionCapacityByDate(date).then(function(res){
        _this.settings.comsumptionCapacity = res.data.balance;
      });
    }

    _this.backupDB = function() {
      if(_this.settings._id) {
        meanData.backUpDB(_this.settings._id).then(function(res){
          alert(res.data.msg);
          $window.location.reload();
        });
      }
    }

    _this.restoreDB = function() {
      if(_this.settings._id) {
        meanData.restoreDB(_this.settings._id).then(function(res){
          alert(res.data.msg);
          $window.location.reload();
        });
      }
    }
  }]);
})();