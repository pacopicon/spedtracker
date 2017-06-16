spedtracker.controller("LandingCtrl", ["$scope", "$rootScope", "FirebaseRef", "UserCrud",
  function($scope, $rootScope, FirebaseRef, UserCrud) {

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

  $scope.email = '';
  $scope.password = '';

  $scope.login = function(email, password) {
    console.log("auth", auth);
    promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
    console.log("promise = ", promise);
  };

  $scope.signup = function(email, password) {
    console.log("auth", auth);
    promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
    console.log("promise = ", promise);

    var user = auth.currentUser;

    console.log("current user uid =", user.uid);

    user.sendEmailVerification().then(function() {
      console.log("verification e-mail sent");
    }, function(error) {
      console.log(error);
    });

  }

  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in.

      // $scope.logoutAppear = true;

      var displayName = user.displayName;
      var email = user.email;
      var password = user.password;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      // userCount = 0;
      //
      // if (users.length == 0) {
      //   UserCrud.addUser(displayName, email, $scope.password, emailVerified, photoUrl, uid);
      // } else if (users.length > 0) {
      //   for (var i = 0; i < users.length; i++) {
      //     if (user.uid == users[i].uid) {
      //       return
      //     } else {
      //       userCount++;
      //     }
      //   }
      //   if (userCount == users.length) {
      //     UserCrud.addUser(displayName, email, $scope.password, emailVerified, photoUrl, uid);
      //   }
      // }



      // if statement that checks whether uid already exists.  If not:

      // ...
    } else {
      // User is signed out.
      // ...
    }
    console.log("user.getToken() = ", user.getToken());
  });

  $scope.signOut = function() {
    auth.signOut();
  };

// if user forgets e-mail.
  auth.sendPasswordResetEmail(user.email).then(function() {
    // Email sent.
  }, function(error) {
    // An error happened.
  });


// user delete
  var user = firebase.auth().currentUser;

  user.delete().then(function() {
    // User deleted.
  }, function(error) {
    // An error happened.
  });

// re-authentication in case Account Deletion, Primary Email Setup, and Password Change take too long:
  var user = firebase.auth().currentUser;
  var credential;

// Prompt the user to re-provide their sign-in credentials
  user.reauthenticate(credential).then(function() {
    // User re-authenticated.
  }, function(error) {
    // An error happened.
  });



// Hero material

  $scope.hero = {};
  $scope.hero.title = "spedtracker!"

}
]);
