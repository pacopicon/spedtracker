spedtracker.factory("UserCrud", ["FirebaseRef",
  function(FirebaseRef) {

  var users = FirebaseRef.getUsers();
  var usersRef = FirebaseRef.getUsersRef();

  return {

    getAllUsers: function() {
      return users
    },

    addUser: function(name, email, password, isEmailVerified, photoURL, uid) {
      users.$add({
        name: name,
        email: email,
        password: password,
        verified: isEmailVerified,
        photoURL: photoURL,
        uid: uid,
        loginLog: 0,
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
    }

  }


} // end of firebase function
]); // end of factory initialization
