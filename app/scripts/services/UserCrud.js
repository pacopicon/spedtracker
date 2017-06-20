spedtracker.factory("UserCrud", ["FirebaseRef", "$state",
  function(FirebaseRef, $state) {

  var auth = FirebaseRef.getAuth();

  var firebase = FirebaseRef.getFirebase();

  auth.onAuthStateChanged(user => {
    if (user) {
      var currentUser = auth.currentUser;
      console.log("currentUser in onAuthStateChanged = ", currentUser);
    } else {
      console.log("AuthStateChange failed");
    }
  });



  var isAuthenticated = false;

  var loginAnonymously = function(name, lastName, email, password) {
    promise = auth.signInAnonymously();
    promise.catch(e => console.log(e.message));
    console.log("promise = ", promise);
    var currentUser = auth.currentUser;
    console.log("currentUser in loginAnonymously = ", currentUser);
    var isAuthenticated = true;
  };

  return {

    getAllUsers: function() {
      return users
    },

    loginAnonymously: function() {
      loginAnonymously();
    },

    createUserProfile: function(name, email, password) {
      auth.onAuthStateChanged(user => {
        if (user) {
          var currentUser = auth.currentUser;
          console.log("currentUser in onAuthStateChanged = ", currentUser);
        } else {
          console.log("AuthStateChange failed");
        }
      });
      var currentUser = auth.currentUser;
      var userId = currentUser.uid;

      function writeUserData(userId, name, email, password) {
        firebase.database().ref('users/' + userId).set({
          username: name,
          email: email,
          password : password
        });
      };
      $state.go("testTracker");
    },

    isAuthenticated: function() {
      return isAuthenticated;
    }

  } // end of Return
} // end of firebase function
]); // end of factory initialization
