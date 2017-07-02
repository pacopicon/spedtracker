spedtracker.factory("FirebaseRef", ["$firebaseArray", "$state",
  function($firebaseArray, $state) {

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

    // if (typeof uid !== "undefined") {
    //   var studentsRef = firebase.database().ref('users/' + uid).child("students");
    //   var students = $firebaseArray(studentsRef);
    // }

    var isAuthenticated = false;

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
      // authHandler(authData);
      setUserAndStudents(result.user.uid);
      var isAuthenticated = true;
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

    // var setUserAndStudents = function(uid) {
    //   firebase.database().ref('users/' + uid);
    //   const studentsRef = firebase.database().ref('users/' + uid).child("students");
    //   console.log("studentsRef = ", studentsRef)
    //   const students = $firebaseArray(studentsRef);
    //   return students;
    // };

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

    var writeUserData = function(uid, name, email) {

      console.log("writeUserData hit");

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

      firebase.database().ref('users'/ + uid).set({
        username: name,
        email: email
      });
      $state.go('testTracker');
    };

    var authHandler = function(authData) {
      console.log('authData = ', authData);
      if(!authData || typeof authData === "undefined") {
        console.log('did not receive authData');
        return;
      }

      var storeRef = database(rebase.app).ref(this.props.storeID);

      storeRef.once('value', (snapshot) => {
        var data = snapshot.val() || {};

        if(!data.owner) {
          storeRef.set({
            owner: authData.user.uid
          });
        }

        this.setState({
          uid: authData.user.uid,
          owner: data.owner || authData.user.uid
        });
      });
    };

    return {
      getStudents: function() {
        // return students;
        auth.onAuthStateChanged(user => {
          if (user) {
            // var currentUser = user;
            // console.log("currentUser in onAuthStateChanged = ", user);
            var uid = user.uid
            // return setUserAndStudents(uid);
            // var uid = currentUser.uid
            // firebase.database().ref('users/' + uid);
            const studentsRef = firebase.database().ref('users/' + uid).child("students");
            const students = $firebaseArray(studentsRef);
            // console.log("students = ", students);
            // console.log("firebase.database().ref().child", firebase.database().ref().child);
            return students;
            // authHandler(authData)
          } else {
            console.log("AuthStateChange failed");
          }
        });
      },

      getStudents2: function() {
          var user = auth.currentUser;
          var name, email, photoUrl, uid, emailVerified;

          if (user != null && typeof user !== "undefined") {
            $scope.name = user.displayName;
            var email = user.email;
            var photoUrl = user.photoURL;
            var uid = user.uid;
            return user;
          }
        const studentsRef = firebase.database().ref('users/' + uid).child("students");
        const students = $firebaseArray(studentsRef);
        return students;
      },

      getStudents3: function() {
        const studentsRef = firebase.database().ref().child("students");
        const students = $firebaseArray(studentsRef);
        return students;
      },

      // getCurrentUser: function() {
      //   auth.onAuthStateChanged(user => {
      //     if (user) {
      //       var currentUser = auth.currentUser;
      //       console.log("currentUser in onAuthStateChanged = ", currentUser);
      //       return currentUser;
      //       // authHandler(authData)
      //     } else {
      //       console.log("AuthStateChange failed");
      //     }
      //   });
      // },

      getCurrentUser: function() {
        return auth.currentUser;
      },

      // getStudentsRef: function() {
      //   return studentsRef;
      // },

      getAuth: function() {
        console.log("auth = ", firebase.auth());
        return auth;
      },

      oAuthSignIn: function() {
        oAuthSignIn();
      },

      createUserProfile: function(name, email) {

        auth.onAuthStateChanged(user => {
          if (user) {
            var currentUser = auth.currentUser;
            console.log("currentUser in onAuthStateChanged = ", currentUser);
            var uid = currentUser.uid
            writeUserData(uid, name, email);
            // setUserAndStudents(uid);
            // authHandler(authData)
          } else {
            console.log("AuthStateChange failed");
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
