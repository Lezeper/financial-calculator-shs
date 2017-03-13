(function(){
  app.controller('settingsCtrl', ['$scope', 'meanData', '$window', 
    function($scope, meanData, $window){
    var _this = this;
    _this.settings;
    _this.canTransaction;

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
      meanData.canHasTransaction(new Date(), transaction.endDate, transaction).then(function(res){
        if(res.data.length == 0)
          return alert("You can't has this transaction");
        _this.avaliableAccounts = res.data;
      });
    }
  }]);
})();