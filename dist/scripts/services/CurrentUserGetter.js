spedtracker.factory("CurrentUserGetter", ["FirebaseRef",
  function(FirebaseRef) {

    var auth = FirebaseRef.getAuth();
    
  } // end of CurrentUserGetter function
]); // end of factory initialization
