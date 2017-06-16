spedtracker.controller("LandingCtrl", function($scope, $rootScope) {

  $scope.hero = {};
  $scope.hero.title = "spedtracker!"

  $scope.email = '';
  $scope.pass =

  $scope.signup = function(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    });
  };

  $scope.login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...  
    });
  };

  $scope.isUserSignedIn = function() = {
    firebase.auth().onAuthStateChanged(function(user) {
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

});


// Other notation:

//(function(){
//    function LandingCtrl() {
//       this.heroTitle = "Organize your life!"
//    }
//
//    angular
//        .module('spedtracker')
//        .controller('LandingCtrl', LandingCtrl);
//})();
