spedtracker.factory("UserCrud", ["FirebaseRef",
  function(FirebaseRef) {

  var users = FirebaseRef.getUsers();
  var usersRef = FirebaseRef.getUsersRef();

  return {

    getAllUsers: function() {
      return users
    },

    addUser: function(uid) {

      id = (Math.round(Date.now() * Math.random()*16)).toString(16);

      users.$add({
        name: '',
        name: '',
        email: '',
        password: '',
        state: '',
        city: '',
        school: '',
        // name: name,
        // name: lastName,
        // email: email,
        // password: password,
        // state: state,
        // city: city,
        // school: school,
        uid: 0,
        verified: false,
        photoURL: '',
        id: id,
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
    }

  }


} // end of firebase function
]); // end of factory initialization
