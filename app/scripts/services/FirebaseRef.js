<<<<<<< HEAD
spedtracker.factory("FirebaseRef", ["$firebaseArray", "$window",
  function($firebaseArray, $window) {

// Initialize Firebase
=======
spedtracker.factory("FirebaseRef", ["$firebaseArray", "$state",
  function($firebaseArray, $state) {

    // Initialize Firebase
>>>>>>> 16c626ead6378d0eb8b972d6d598080c30604125
    var config = {
      apiKey: "AIzaSyDu2ZzSnoFkDWE3_IqMlz-gQpaadVl2Uvc",
      authDomain: "spedtracker.firebaseapp.com",
      databaseURL: "https://spedtracker.firebaseio.com",
      projectId: "spedtracker",
      storageBucket: "spedtracker.appspot.com",
      messagingSenderId: "71048131235"
    };
<<<<<<< HEAD
    firebase.initializeApp(config);

    // $window.onload = function() {
    //
    // }

    var databaseRef = function() {
      var auth = firebase.auth();

      auth.onAuthStateChanged(user => {
        if (user) {
          var currentUser = auth.currentUser;
          console.log("currentUser in onAuthStateChanged = ", currentUser);
        } else {
          console.log("AuthStateChange failed");
        }
      });
      return {
        auth: firebase.auth(),
        userId: 0 || firebase.auth().currentUser.uid,
        studentsRef: firebase.database().ref('users/' + userId).child("students"),
        students: $firebaseArray(studentsRef),
        firebase: firebase
      }
    }
=======

    firebase.initializeApp(config);

    var auth = firebase.auth();

    auth.onAuthStateChanged(user => {
      if (user) {
        var currentUser = auth.currentUser;
        console.log("currentUser in onAuthStateChanged = ", currentUser);
        var uid = currentUser.uid
        setUser(uid);
      } else {
        console.log("AuthStateChange failed");
      }
    });

    var setUser = function(uid) {
      firebase.database().ref('users/' + uid);
    };

    if (typeof uid !== "undefined") {
      var studentsRef = firebase.database().ref('users/' + uid).child("students");
      var students = $firebaseArray(studentsRef);
    }

    var isAuthenticated = false;

    var loginAnonymously = function() {
      promise = auth.signInAnonymously();
      promise.catch(e => console.log(e.message));
      console.log("promise = ", promise);
      var currentUser = auth.currentUser;
      console.log("currentUser in loginAnonymously = ", currentUser);
      uid = currentUser.uid;
      var isAuthenticated = true;
    };
>>>>>>> 16c626ead6378d0eb8b972d6d598080c30604125

    return {
      getStudents: function() {
        return databaseRef().students;
      },

      getStudentsRef: function() {
        return databaseRef().studentsRef;
      },

      getAuth: function() {
        console.log("auth = ", firebase.auth());
        return databaseRef().auth;
      },

<<<<<<< HEAD
      getFirebase: function() {
        return databaseRef().firebase;
=======
      loginAnonymously: function() {
        loginAnonymously();
      },

      createUserProfile: function(name, email, password) {

        var writeUserData = function(uid, name, email, password) {
          firebase.database().ref('users'/ + uid).set({
            username: name,
            email: email,
            password: password
          });
          $state.go('testTracker');
        };

        auth.onAuthStateChanged(user => {
          if (user) {
            var currentUser = auth.currentUser;
            var uid = currentUser.uid;
            writeUserData(uid, name, email, password);
            if (!(firebase.database().ref('users/' + uid))) {
              setUser(uid);
            }
          } else {
            console.log("AuthStateChange in CreateUserProfile failed");
          }
        });

      },

      updateUser: function(oldUser, newName, newEmail) {

        oldUser.name = newName;
        oldUser.email = newEmail;
        oldUser.pass = newPass;

        users.$save(oldUser).then(function(ref) {
          console.log("users.$save called");
        });
      },

      isAuthenticated: function() {
        return isAuthenticated;
>>>>>>> 16c626ead6378d0eb8b972d6d598080c30604125
      }

      // getUsers: function() {
      //   return users;
      // },
      //
      // getUsersRef: function() {
      //   return usersRef;
      // }

    }; // end of return

  } // end of FirebaseRef function
]); // end of factory initialization
