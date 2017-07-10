TestTrakker.factory("FirebaseRef", ["$firebaseArray", "$state",
  function($firebaseArray, $state) {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyC9bwyy9NHISIZbKFerdIU_jjAdDeZq-To",
      authDomain: "testtrakker.firebaseapp.com",
      databaseURL: "https://testtrakker.firebaseio.com",
      projectId: "testtrakker",
      storageBucket: "testtrakker.appspot.com",
      messagingSenderId: "446548077493"
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

    // auth.onAuthStateChanged(user => {
    //   if (user) {
    //     var currentUser = auth.currentUser;
    //     console.log("currentUser in onAuthStateChanged = ", currentUser);
    //     var uid = currentUser.uid
    //
    //   } else {
    //     console.log("AuthStateChange failed");
    //   }
    // });

    var provider = new firebase.auth.FacebookAuthProvider();
    // var userGender = provider.addScope('gender');
    // console.log("gender? ")

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
      $state.transitionTo('tracker');
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
          // firebase.database().ref('users/' + uid);
          const usersRef = firebase.database().ref('users/' + uid);
          const users = $firebaseArray(usersRef);
          const studentsRef = firebase.database().ref('users/' + uid).child("students");
          const students = $firebaseArray(studentsRef);
          console.log("studentsRef = ", studentsRef)
          return students;

        } else {
          console.log("AuthStateChange failed");
        }
      });
    };

    return {
      closeSession: function() {
        // return students;
        auth.onAuthStateChanged(user => {
          if (user) {
            var uid = user.uid
            // const studentsRef = firebase.database().ref('users/' + uid).child("students");
            const studentsRef = firebase.database().ref().child("users").child("uid").child("students");
            const students = $firebaseArray(studentsRef);
            // students.$remove().then(function() {
            //   firebase.auth().signOut().then(function() {
            //
            //     console.log("signed out.");
            //     $state.go('landing');
            //   }).catch(function(error) {
            //     console.log("Error, could not sign out properly.");
            //   });
            // });


          } else {
            console.log("AuthStateChange failed");
          }
          // deleteAllStudents();

        });
      },

      // addUser: function() {
      //   auth.onAuthStateChanged(user => {
      //     if (user) {
      //       var currentUser = auth.currentUser;
      //       var uid = currentUser.uid
      //       const usersRef = firebase.database().ref('users/' + uid);
      //       const users = $firebaseArray(usersRef);
      //       if(users.length == 0) {
      //         users.$add({
      //           name:     user.displayName,
      //           email:    user.email,
      //           uid:      user.uid,
      //           photoUrl: user.photoURL
      //         }).then(function(usersRef) {
      //           var id = usersRef.key;
      //           console.log("Added user with id " + id);
      //           students.$indexFor(id);
      //         });
      //       } else {
      //         for (var i = 0; i < users.length; i++) {
      //           if (currentUser.uid == users[i].uid) {
      //             return
      //           }
      //         }
      //         users.$add({
      //           name:     user.displayName,
      //           email:    user.email,
      //           uid:      user.uid,
      //           photoUrl: user.photoURL
      //         }).then(function(usersRef) {
      //           var id = usersRef.key;
      //           console.log("Added user with id " + id);
      //           students.$indexFor(id);
      //         });
      //       }
      //
      //     } else {
      //       console.log("AuthStateChange failed");
      //     }
      //   });
      // },

      getAuth: function() {
        console.log("auth = ", firebase.auth());
        return auth;
      },

      oAuthSignIn: function() {
        oAuthSignIn();
      }

    }; // end of return

  } // end of FirebaseRef function
]); // end of factory initialization
