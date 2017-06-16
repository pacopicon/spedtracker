spedtracker.factory("FirebaseRef", ["$firebaseArray", "$firebaseObject",
  function($firebaseArray, $firebaseObject) {

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

    var studentsRef = firebase.database().ref().child("students");
    var students = $firebaseArray(studentsRef);

    var auth = firebase.auth();

    var usersRef = firebase.database().ref().child("users");
    var users = $firebaseArray(usersRef);


    return {
      getStudents: function() {
        return students;
      },

      getStudentsRef: function() {
        return studentsRef;
      },

      getAuth: function() {
        console.log("auth = ", firebase.auth());
        return auth;
      },

      getUsers: function() {
        return users;
      },

      getUsersRef: function() {
        return usersRef;
      }

    };

  } // end of FirebaseRef function
]); // end of factory initialization
