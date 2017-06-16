spedtracker.controller("LandingCtrl", ["$scope", "$rootScope", "$firebaseAuth", "FirebaseRef",
  function($scope, $rootScope, $firebaseAuth, FirebaseRef) {

  // var ref = new Firebase("https://spedtracker.firebaseio.com");
  // var auth = $firebaseAuth(ref);

  auth = FirebaseRef.getAuth();

  $scope.email = '';
  $scope.password = '';

  $scope.login = function(email, password) {
    console.log("auth", auth);
    promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
  };

  $scope.signup = function(email, password) {
    promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
  }

  $scope.isUserSignedIn = function() {
    auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
      } else {
        // User is signed out.
        // ...
      }
    });
  }

  // $scope.signup = function(email, password) {
  //   ref.createUser({
  //     email: email,
  //     password: password
  //   }),
  //   function(error, userData) {
  //     if (error) {
  //       console.log("Error creating user: ", error);
  //     } else {
  //       console.log("Successfully created user accoutn with uid: ", userData.uid);
  //       console.log(userData);
  //     }
  //   }
  // };

  // $scope.authObj = $firebaseAuth(ref);

  $scope.hero = {};
  $scope.hero.title = "spedtracker!"

}
]);
