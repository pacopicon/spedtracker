spedtracker.controller("LandingCtrl", ["$scope", "$rootScope", "$q", "FirebaseRef", "$state",
  function($scope, $rootScope, $q, FirebaseRef, $state) {

// BEGIN Email and Password Signup and login functions for later use:

    // $scope.login = function(email, password) {
    //   console.log("auth", auth);
    //   promise = auth.signInWithEmailAndPassword(email, password);
    //   promise.catch(e => console.log(e.message));
    //   console.log("promise = ", promise);
    // };

    // $scope.signup = function(email, password) {
    //   console.log("auth", auth);
    //   promise = auth.createUserWithEmailAndPassword(email, password);
    //   promise.catch(e => console.log(e.message));
    //   console.log("createUserPromise = ", promise);
    //
    // }

    // if (typeof user !== "undefined") {
    //   user.sendEmailVerification().then(function() {
    //     console.log("verification e-mail sent");
    //   }, function(error) {
    //     console.log(error);
    //   });
    // }

// END Email and Password Signup and login functions for later use:

// BEGIN Landing.html variables

    $scope.inputType = 'password';

    $scope.hideShowPassword = function(){
      if ($scope.inputType == 'password')
        $scope.inputType = 'text';
      else
        $scope.inputType = 'password';
    };

    $scope.createAnAccount = false;

    $scope.oAuthSignIn = function() {
      FirebaseRef.oAuthSignIn();
      $scope.createAnAccount = true;

    };


    $scope.createUserProfile = function() {
      if ($scope.name && $scope.email) {
        FirebaseRef.createUserProfile($scope.name, $scope.email);
      } else {
        $scope.alert = true;
        $timeout(function turnOffAlert() {$scope.alert = false}, 5000);
      }
    };


    $scope.signOut = function() {
      auth.signOut();
    };

// BEGIN Hero material

    $scope.hero = {};
    $scope.hero.title = "spedtracker!"

// END Hero material

  }
]);
