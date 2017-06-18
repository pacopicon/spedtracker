spedtracker.controller("LandingCtrl", ["$scope", "$rootScope", "$q", "FirebaseRef", "UserCrud", "$state",
  function($scope, $rootScope, $q, FirebaseRef, UserCrud, $state) {

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

    $scope.forward = false;

    $scope.choseLoginMethod = function(method) {
      if (method == "with password") {
        $scope.loginWithPassword = true;
        $scope.forward = true;
      } else {
        $scope.loginWithPassword = false;
        $scope.forward = true;
      }
    }

    $scope.createAnAccount = false;

// END Landing.html variables


    // var auth = FirebaseRef.getAuth();
    // var users = UserCrud.getAllUsers();
    //
    // $scope.loginAnonymously = function() {
    //   promise = auth.signInAnonymously();
    //   promise.catch(e => console.log(e.message));
    //   console.log("promise = ", promise);
    //   $scope.createAnAccount = true;
    //   listenForAuthStateChange();
    //   var currentUser = auth.currentUser;
    //   uid = currentUser.uid;
    //   UserCrud.addUser(uid);
    //
    // };
    //
    // var listenForAuthStateChange = function() {
    //   auth.onAuthStateChanged(user => {
    //     if (user) {
    //       var currentUser = auth.currentUser;
    //       uid = currentUser.uid;
    //     } else {
    //       console.log("AuthStateChange failed");
    //       return
    //     }
    // };
    //
    // $scope.createUser = function() {
    //   var currentUser = auth.currentUser;
    //   var uid = currentUser.uid;
    //   console.log("currentUser.getToken()", currentUser.getToken());
    //   users.$loaded().then(function() {
    //     for (var i = 0; i < users.length; i++) {
    //       if (currentUser.uid == users[i].uid) {
    //         users[i].name = $scope.name;
    //         users[i].lastName = $scope.lastName;
    //         users[i].email = $scope.email;
    //         users[i].password = $scope.password;
    //         users[i].state = $scope.state;
    //         users[i].city = $scope.city;
    //         users[i].school = $scope.school;
    //         users[i].loginLog += 1;
    //
    //         if ($scope.name && $scope.lastName && $scope.email && $scope.password && $scope.state && $scope.city && $scope.school) {
    //           users.$save(users[i]).then(function() {
    //             $state.go('testTracker');
    //           });
    //         } else {
    //           $scope.alert = true;
    //           $timeout(function turnOffAlert() {$scope.alert = false}, 5000);
    //         }
    //       }
    //     }
    //   });
    // };

    $scope.loginAnonymously = function() {
      $scope.createAnAccount = true;
      UserCrud.loginAnonymously();
    };


    $scope.createUserProfile = function() {
      if ($scope.name && $scope.lastName && $scope.email && $scope.password && $scope.state && $scope.city && $scope.school) {
        UserCrud.createUserProfile($scope.name, $scope.lastName, $scope.email, $scope.password, $scope.state, $scope.city, $scope.school);
        // $state.go('testTracker');
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
