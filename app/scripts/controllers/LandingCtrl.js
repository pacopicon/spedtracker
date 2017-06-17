spedtracker.controller("LandingCtrl", ["$scope", "$rootScope", "$q", "FirebaseRef", "UserCrud", "$state",
  function($scope, $rootScope, $q, FirebaseRef, UserCrud, $state) {

  // var ref = new Firebase("https://spedtracker.firebaseio.com");
  // var auth = $firebaseAuth(ref);

  auth = FirebaseRef.getAuth();
  users = UserCrud.getAllUsers();

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
    // promise.then(function() {
    //
    // });
  }

  // $scope.name = '';
  // $scope.lastName = '';
  // $scope.email = '';
  // $scope.password = '';
  // $scope.state = '';
  // $scope.city = '';
  // $scope.school = '';


  // $scope.signup = function(email, password) {
  //   console.log("auth", auth);
  //   promise = auth.createUserWithEmailAndPassword(email, password);
  //   promise.catch(e => console.log(e.message));
  //   console.log("createUserPromise = ", promise);
  //
  // }

  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      var user = user
      // var user = auth.currentUser;

      console.log("current user uid =", user.uid);

      // $scope.logoutAppear = true;

      // var displayName = user.displayName;
      // var email = user.email;
      // var password = user.password;
      // var emailVerified = user.emailVerified;
      // var photoURL = user.photoURL;
      // var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      UserCrud.addUser(uid);

      if (uid = user.uid) {
        $scope.currentUser = user
      }

      // var providerData = user.providerData;

      // userCount = 0;
      //
      // if (users.length == 0) {
      //   UserCrud.addUser(uid);
      // } else if (users.length > 0) {
      //   for (var i = 0; i < users.length; i++) {
      //     if (user.uid == users[i].uid) {
      //       return
      //     } else {
      //       userCount++;
      //     }
      //   }
      //   if (userCount == users.length) {
      //     UserCrud.addUser(uid);
      //   }
      // }



      // if statement that checks whether uid already exists.  If not:

      // ...
    } else {
      // User is signed out.
      // ...
    }
    // console.log("user.getToken() = ", user.getToken());
  });


  $scope.createUser = function() {
    // UserCrud.addUser($scope.name, $scope.lastName, $scope.email, $scope.password, $scope.state, $scope.city, $scope.school);

    user = $scope.currentUser

    user.name = $scope.name;
    user.lastName = $scope.lastName;
    user.email = $scope.email
    user.password = $scope.password
    user.state = $scope.state
    user.city = $scope.city
    user.school = $scope.school



    users.$save(user)
    $state.go('testTracker');
  };


  if (typeof user !== "undefined") {
    user.sendEmailVerification().then(function() {
      console.log("verification e-mail sent");
    }, function(error) {
      console.log(error);
    });
  }


  $scope.signOut = function() {
    auth.signOut();
  };

// Hero material

  $scope.hero = {};
  $scope.hero.title = "spedtracker!"

}
]);
