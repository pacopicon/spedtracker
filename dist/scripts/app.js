var spedtracker = angular.module("spedtracker", ["ui.router", "firebase", "ui.bootstrap", "ngAnimate", "ngSanitize", "mgcrea.ngStrap", "chart.js", "ngCookies"]);

spedtracker.config(function($stateProvider, $locationProvider, $datepickerProvider, $popoverProvider, $urlRouterProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
// https://spedtracker.firebaseapp.com/__/auth/action
    $stateProvider
        .state('landing', {
            url: '/',
            controller: 'LandingCtrl',
            templateUrl: '/templates/landing.html'
        })
        .state('testTracker', {
            url: '/testTracker',
            controller: 'StudentCtrl',
            templateUrl: '/templates/testTracker.html'
        })
        .state('clock', {
            url: '/clock',
            controller: 'StudentCtrl',
            templateUrl: '/templates/clock.html'
        })
        .state('pacooverTooltip', {
            url: '/pacooverTooltip',
            controller: 'StudentCtrl',
            templateUrl: '/templates/pacooverTooltip.html'
        })
        .state('testDataPrintout', {
            url: '/testDataPrintout',
            controller: 'StudentCtrl',
            templateUrl: '/templates/testDataPrintout.html'
        });

    angular.extend($datepickerProvider.defaults, {
      dateFormat: 'dd/MM/yyyy',
      startWeek: 1
    });

    angular.extend($popoverProvider.defaults, {
      html: true
    });

});

spedtracker.run(function ($rootScope, $state, UserCrud) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !UserCrud.isAuthenticated()){
      // User isn’t authenticated
      $state.transitionTo("landing");
      event.preventDefault();
    }
  });
});

spedtracker.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts

    // '#C3C300' --> yellow,
    // '#6FC853' --> green
    // '#e05d6f' --> red
    // '#3f4e62'--> black
    ChartJsProvider.setOptions({
      // yellow, green, red, dark navy, brown, purple, blue
      chartColors: ['#C3C300', '#6FC853', '#e05d6f', '#3f4e62',  '#AC6D39', '#8E5EC5', '#4c91cd'],
      responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      showLines: true
    });
  }]);

//(function () {
//    function config($stateProvider, $locationProvider, $urlRouterProvider) {
//        $locationProvider
//            .html5Mode({
//                enabled: true,
//                requireBase: false
//        });
//
//        $stateProvider
//            .state('landing', {
//                url: '/',
//                controller: 'LandingCtrl as landing',
//                templateUrl: '/templates/landing.html'
//            })
//            .state('user', {
//                url: '/user',
//                controller: 'StudentCtrl as user',
//                templateUrl: '/templates/user.html'
//            });
//    }
//
//    angular
//        .module('spedtracker', ['ui.router', 'firebase'])
//        .config(config);
//})();
