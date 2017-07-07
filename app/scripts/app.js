var TestTrakker = angular.module("TestTrakker", ["ui.router", "firebase", "ui.bootstrap", "ngAnimate", "ngSanitize", "mgcrea.ngStrap", "chart.js", "ngCookies"]);

TestTrakker.config(function($stateProvider, $locationProvider, $datepickerProvider, $popoverProvider, $urlRouterProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $stateProvider
        .state('landing', {
            url: '/',
            controller: 'LandingCtrl',
            templateUrl: '/templates/landing.html'
        })
        .state('testtrakker', {
            url: '/testtrakker',
            controller: 'StudentCtrl',
            templateUrl: '/templates/testtrakker.html'
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

// testtrakker.run(function ($rootScope, $state, FirebaseRef) {
//   $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
//     if (toState.authenticate && !FirebaseRef.isAuthenticated()){
//       // User isn’t authenticated
//       $state.transitionTo("landing");
//       event.preventDefault();
//     }
//   });
// });

testtrakker.config(['ChartJsProvider', function (ChartJsProvider) {
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
