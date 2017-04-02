spedtracker.controller('AdminCtrl', ["$scope", "$firebaseAuth", "FirebaseRef", "UserCrud", "StudentCrud",
  function($scope, $firebaseAuth, FirebaseRef, UserCrud, StudentCrud) {

    // var items = FirebaseRef.getItems();
    //
    // var users = FirebaseRef.getUsers();


    $scope.addUser = function() {
      UserCrud.addItem($scope.newUserName, $scope.newUserEmail, $scope.newUserPass);
    };



  }
]);
