spedtracker.factory("FirebaseRef", ["$firebaseArray", "$window",
  function($firebaseArray, $window) {

// Initialize Firebase
    var config = {
      apiKey: "AIzaSyDu2ZzSnoFkDWE3_IqMlz-gQpaadVl2Uvc",
      authDomain: "spedtracker.firebaseapp.com",
      databaseURL: "https://spedtracker.firebaseio.com",
      projectId: "spedtracker",
      storageBucket: "spedtracker.appspot.com",
      messagingSenderId: "71048131235"
    };
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

      getFirebase: function() {
        return databaseRef().firebase;
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
