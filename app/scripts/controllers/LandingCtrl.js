TestTrakker.controller("LandingCtrl", ["$scope", "$rootScope", "$q", "FirebaseRef", "$state",
  function($scope, $rootScope, $q, FirebaseRef, $state) {

// BEGIN Landing.html variables

    $scope.inputType = 'password';

    // $scope.hideShowPassword = function(){
    //   if ($scope.inputType == 'password')
    //     $scope.inputType = 'text';
    //   else
    //     $scope.inputType = 'password';
    // };

    $scope.oAuthSignIn = function() {
      FirebaseRef.oAuthSignIn();
    };

// BEGIN Hero material

    $scope.hero = {};
    $scope.hero.title = "TestTrakker"

// END Hero material

  }
]);
