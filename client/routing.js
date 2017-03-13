(function(){
	app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/home', {
          templateUrl: '/home/home.view.html',
          controller: "homeCtrl"
        })
        .when('/prediction', {
          templateUrl: "/prediction/prediction.view.html",
          controller: "predictionCtrl",
          controllerAs: "Prediction"
        })
        .when('/account', {
          templateUrl: "/account/account.view.html",
          controller: "accountCtrl",
          controllerAs: "Account"
        })
        .when('/payment', {
          templateUrl: "/payment/payment.view.html",
          controller: "paymentCtrl",
          controllerAs: "Payment"
        })
        .when('/account-default', {
          templateUrl: "/account-default/account-default.view.html",
          controller: "accountDefaultCtrl",
          controllerAs: "AccountDefault"
        })
        .when('/settings', {
          templateUrl: "/settings/settings.view.html",
          controller: "settingsCtrl",
          controllerAs: "Settings"
        })
        .otherwise('/');

      $locationProvider.html5Mode(true);

  }]);
})();