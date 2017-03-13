var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'ngSanitize']);
(function () {
  app.controller('footerCtrl', ['$scope', 'meanData', '$rootScope',
        function ($scope, meanData, $rootScope) {
    $scope.year = new Date().getFullYear();
  }]);

  app.controller('mainCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

  }]);

  app.directive('dateInput', function(){
      return {
          restrict : 'A',
          scope : {
              ngModel : '='
          },
          link: function (scope) {
              if (scope.ngModel) scope.ngModel = new Date(scope.ngModel);
          }
      }
  });
})();