TestTracker.factory("FirebaseRef", ["$firebaseArray", "$state",
  function($firebaseArray, $state) {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyC8izlYeWydf2XPRvc_hW2vcqoh3MAAlSc",
      authDomain: "testtracker-28d26.firebaseapp.com",
      databaseURL: "https://testtracker-28d26.firebaseio.com",
      projectId: "testtracker-28d26",
      storageBucket: "",
      messagingSenderId: "682955988664"
    };

    firebase.initializeApp(config);

    var auth = firebase.auth();

    var user = auth.currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null && typeof user !== "undefined") {
      var name = user.displayName;
      var email = user.email;
      var photoUrl = user.photoURL;
      var uid = user.uid;
      const studentsRef = firebase.database().ref('users/' + uid).child("students");
      const students = $firebaseArray(studentsRef);
    }

    auth.onAuthStateChanged(user => {
      if (user) {
        var currentUser = auth.currentUser;
        console.log("currentUser in onAuthStateChanged = ", currentUser);
        var uid = currentUser.uid
        // setUserAndStudents(uid);
        // authHandler(authData)
      } else {
        console.log("AuthStateChange failed");
      }
    });

    var provider = new firebase.auth.FacebookAuthProvider();

    var oAuthSignIn = function() {

      auth.signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log("Signed in as:", result.user.uid);
      var authData = {
        token: token,
        user: user
      }
      setUserAndStudents(result.user.uid);
      $state.go('testTracker');
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

    var setUserAndStudents = function(uid) {
      auth.onAuthStateChanged(user => {
        if (user) {
          var currentUser = auth.currentUser;
          console.log("currentUser in onAuthStateChanged = ", currentUser);
          var uid = currentUser.uid
          firebase.database().ref('users/' + uid);
          const studentsRef = firebase.database().ref('users/' + uid).child("students");
          const students = $firebaseArray(studentsRef);
          console.log("studentsRef = ", studentsRef)
          return students;
        } else {
          console.log("AuthStateChange failed");
        }
      });
    };

    // var writeUserData = function(uid, name, email) {
    //
    //   console.log("writeUserData hit");
    //
    //   auth.onAuthStateChanged(user => {
    //     if (user) {
    //       var currentUser = auth.currentUser;
    //       console.log("currentUser in onAuthStateChanged = ", currentUser);
    //       var uid = currentUser.uid
    //       // setUserAndStudents(uid);
    //       // authHandler(authData)
    //
    //
    //     } else {
    //       console.log("AuthStateChange failed");
    //
    //     }
    //   });
    //
    //   firebase.database().ref('users'/ + uid).set({
    //     username: name,
    //     email: email
    //   });
    //   $state.go('testTracker');
    // };

    return {
      // getStudents: function() {
      //   // return students;
      //   auth.onAuthStateChanged(user => {
      //     if (user) {
      //       // var currentUser = user;
      //       // console.log("currentUser in onAuthStateChanged = ", user);
      //       var uid = user.uid
      //       // return setUserAndStudents(uid);
      //       // var uid = currentUser.uid
      //       // firebase.database().ref('users/' + uid);
      //       const studentsRef = firebase.database().ref('users/' + uid).child("students");
      //       const students = $firebaseArray(studentsRef);
      //       // console.log("students = ", students);
      //       // console.log("firebase.database().ref().child", firebase.database().ref().child);
      //       return students;
      //       // authHandler(authData)
      //     } else {
      //       console.log("AuthStateChange failed");
      //     }
      //   });
      // },

      // getCurrentUser: function() {
      //   return auth.currentUser;
      // },

      getAuth: function() {
        console.log("auth = ", firebase.auth());
        return auth;
      },

      oAuthSignIn: function() {
        oAuthSignIn();
      },

      // createUserProfile: function(name, email) {
      //
      //   auth.onAuthStateChanged(user => {
      //     if (user) {
      //       var currentUser = auth.currentUser;
      //       console.log("currentUser in onAuthStateChanged = ", currentUser);
      //       var uid = currentUser.uid
      //       writeUserData(uid, name, email);
      //       // setUserAndStudents(uid);
      //       // authHandler(authData)
      //     } else {
      //       console.log("AuthStateChange failed");
      //     }
      //   });
      //
      // },

      // updateUser: function(oldUser, newName, newEmail) {
      //
      //   oldUser.name = newName;
      //   oldUser.email = newEmail;
      //   oldUser.pass = newPass;
      //
      //   users.$save(oldUser).then(function(ref) {
      //     console.log("users.$save called");
      //   });
      // },

    }; // end of return

  } // end of FirebaseRef function
]); // end of factory initialization
