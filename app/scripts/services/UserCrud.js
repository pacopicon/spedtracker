spedtracker.factory("UserCrud", ["FirebaseRef",
  function(FirebaseRef) {

  var users = FirebaseRef.getUsers();
  var usersRef = FirebaseRef.getUsersRef();

  return {

    getAllUsers: function() {
      return users
    },

    retain

    addUser: function(uid) {
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
    },

    updateUser: function(oldUser, newName, newEmail) {

      oldUser.name = newName;
      oldUser.email = newEmail;
      oldUser.pass = newPass;

      users.$save(oldUser).then(function(ref) {
        console.log("users.$save called");
      });
    },

    isAuthenticated: function(boolean) {
      return boolean;
    }

  }


} // end of firebase function
]); // end of factory initialization
