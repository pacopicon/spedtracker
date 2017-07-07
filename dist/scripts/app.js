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
            // templateUrl: '/templates/testtrakker.html'
            templateUrl: '/testtrakker.html'
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
