(function () {
  app.directive('navigation', function () {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/navigation/navigation.view.html'
    }
  });

  app.controller('navCtrl', ['$scope', '$location', '$window', '$rootScope',
  function($scope, $location, $window, $rootScope){
	
    $rootScope.isActive = function(viewLocation){
      if(viewLocation === '/')
        return $location.path() === viewLocation;
        for(var i = 0; i < $location.path().split('/').length; i++) {
          if($location.path().split('/')[i] === viewLocation)
            return true;
        }
      return false;
    };
  }])
})();