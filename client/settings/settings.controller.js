(function(){
  app.controller('settingsCtrl', ['$scope', 'meanData', '$window', 
    function($scope, meanData, $window){
    var _this = this;
    _this.settings;

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
  }]);
})();