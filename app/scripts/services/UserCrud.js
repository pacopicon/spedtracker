spedtracker.factory("UserCrud", ["FirebaseRef", "$state",
  function(FirebaseRef, $state) {

  var users = FirebaseRef.getUsers();
  var usersRef = FirebaseRef.getUsersRef();

  var auth = FirebaseRef.getAuth();

  auth.onAuthStateChanged(user => {
    if (user) {
      var currentUser = auth.currentUser;
      console.log("currentUser in onAuthStateChanged = ", currentUser);

      // var displayName = user.displayName;
      // var email = user.email;
      // var password = user.password;
      // var emailVerified = user.emailVerified;
      // var photoURL = user.photoURL;
      // var isAnonymous = user.isAnonymous;
      // var uid = user.uid;
      // var providerData = user.providerData;

    } else {
      console.log("AuthStateChange failed");
    }

  });

  var addUser = function(uid) {
    users.$add({
      name: '',
      name: '',
      email: '',
      password: '',
      state: '',
      city: '',
      school: '',
      uid: uid,
      verified: false,
      photoURL: '',
      loginLog: 0,
      createdAT: firebase.database.ServerValue.TIMESTAMP,
      lastLogin: firebase.database.ServerValue.TIMESTAMP
    }).then(function(usersRef) {
      var id = usersRef.key;
      console.log("added item with id " + id);
      users.$indexFor(id);
    });
  };

  var isAuthenticated = false;

  var loginAnonymously = function() {
    promise = auth.signInAnonymously();
    promise.catch(e => console.log(e.message));
    console.log("promise = ", promise);
    currentUser = getCurrentUser();
    console.log("currentUser in loginAnonymously = ", currentUser);
    uid = currentUser.uid;
    addUser(uid);
    var isAuthenticated = true;
  };

  return {

    getAllUsers: function() {
      return users
    },

    loginAnonymously: function() {
      loginAnonymously();
    },

    createUserProfile: function(name, lastName, email, password, state, city, school) {
      var currentUser = auth.currentUser;
      var uid = currentUser.uid;
      console.log("currentUser.getToken()", currentUser.getToken());
      users.$loaded().then(function() {
        for (var i = 0; i < users.length; i++) {
          if (currentUser.uid == users[i].uid) {
            users[i].name = name;
            users[i].lastName = lastName;
            users[i].email = email;
            users[i].password = password;
            users[i].state = state;
            users[i].city = city;
            users[i].school = school;
            users[i].loginLog += 1;

            users.$save(users[i]).then(function() {
              $state.go('testTracker');
            });
          }
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

  } // end of Return
} // end of firebase function
]); // end of factory initialization
