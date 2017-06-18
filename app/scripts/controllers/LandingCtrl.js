spedtracker.controller("LandingCtrl", ["$scope", "$rootScope", "$q", "FirebaseRef", "UserCrud", "$state",
  function($scope, $rootScope, $q, FirebaseRef, UserCrud, $state) {

  var auth = FirebaseRef.getAuth();
  var users = UserCrud.getAllUsers();

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

  // $scope.login = function(email, password) {
  //   console.log("auth", auth);
  //   promise = auth.signInWithEmailAndPassword(email, password);
  //   promise.catch(e => console.log(e.message));
  //   console.log("promise = ", promise);
  // };

  $scope.createAnAccount = false;

  $scope.loginAnonymously = function() {
    promise = auth.signInAnonymously();
    promise.catch(e => console.log(e.message));
    console.log("promise = ", promise);
    $scope.createAnAccount = true;
    listenForAuthStateChange();
    var currentUser = auth.currentUser;
    uid = currentUser.uid;
    UserCrud.addUser(uid);

  };
  // $scope.signup = function(email, password) {
  //   console.log("auth", auth);
  //   promise = auth.createUserWithEmailAndPassword(email, password);
  //   promise.catch(e => console.log(e.message));
  //   console.log("createUserPromise = ", promise);
  //
  // }

  var listenForAuthStateChange = function() {
    auth.onAuthStateChanged(user => {
      if (user) {
        var currentUser = auth.currentUser;
        uid = currentUser.uid;

        // var displayName = user.displayName;
        // var email = user.email;
        // var password = user.password;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;

      } else {

        console.log("AuthStateChange failed");

        return
        // User is signed out.
        // ...
      }
    // console.log("user.getToken() = ", user.getToken());
  })
};

  $scope.createUser = function() {
    var currentUser = auth.currentUser;
    var uid = currentUser.uid;
    console.log("currentUser.getToken()", currentUser.getToken());
    users.$loaded().then(function() {
      for (var i = 0; i < users.length; i++) {
        if (currentUser.uid == users[i].uid) {
          users[i].name = $scope.name;
          users[i].lastName = $scope.lastName;
          users[i].email = $scope.email;
          users[i].password = $scope.password;
          users[i].state = $scope.state;
          users[i].city = $scope.city;
          users[i].school = $scope.school;
          users[i].loginLog += 1;

          if ($scope.name && $scope.lastName && $scope.email && $scope.password && $scope.state && $scope.city && $scope.school) {
            users.$save(users[i]).then(function() {
              $state.go('testTracker');
            });
          } else {
            $scope.alert = true;
            $timeout(function turnOffAlert() {$scope.alert = false}, 5000);
          }
        }
      }
    });
  };


  // if (typeof user !== "undefined") {
  //   user.sendEmailVerification().then(function() {
  //     console.log("verification e-mail sent");
  //   }, function(error) {
  //     console.log(error);
  //   });
  // }


  $scope.signOut = function() {
    auth.signOut();
  };

// Hero material

  $scope.hero = {};
  $scope.hero.title = "spedtracker!"

}
]);
