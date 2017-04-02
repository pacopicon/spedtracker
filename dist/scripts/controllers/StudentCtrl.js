spedtracker.controller('StudentCtrl', ["$scope", "StudentCrud", "UserCrud", "modalService", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth", "$cookies",
  function($scope, StudentCrud, UserCrud, modalService, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth, $cookies) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.students = StudentCrud.getAllStudents();

    var refreshTime = function() {
      time = Date.now();
      $scope.time = time;

      StudentCrud.updateAllstudentsPastDue();
      return time;
    };

    $interval(refreshTime, 1000);

    $scope.parseTime = function(dueDate) {
      var timeLeftInMillisecs = StudentCrud.calculateTimeTillDueDate(dueDate, $scope.time);
      var countdown = StudentCrud.parseTime(timeLeftInMillisecs);
      return countdown;
    };

    // Begin AngularStrap popover

    $scope.importanceTip = {
      "title": "rate importance with stars",
      "checked": false
    };

    $scope.dateTip = {
      "title": "enter estimated time to complete in hours",
      "checked": false
    };

    $scope.timeTip = {
      "title": "enter estimated time to complete in minutes",
      "checked": false
    };

    $scope.editDeleteTip = {
      "title": "click on me to edit, or check the student off and delete!",
      "checked": false
    };

// Begin ExtendTime

    $scope.timewrap = {};

    $scope.times = [1.5, 2, 2.5, 3];

    $scope.minutewrap = {};

    $scope.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

// End ExtendTime

// Begin CRUD Functions

    $scope.addStudent = function() {
      StudentCrud.addStudent($scope.newStudentName, $scope.timewrap.selectedTime, $scope.newTestName);
    };

    $scope.saveAndToggleInvert = function(student) {
      students.$save(student);
      toggleInvert();
    };

    var toggleInvert = function() {
      console.log("called");
      var incompCount = 0;
      var safeCount = 0;

      for (i = 0; i < students.length; i++) {
        if (students[i] && !students[i].isComplete) {
          incompCount++;
        }
      }

      for (i = 0; i < students.length; i++) {
        if (students[i] && students[i].isSafeToComplete) {
          safeCount++;
        }
      }

      $scope.clickedToDelete = false;
      // $scope.appear = false;

      if (safeCount > 0) {
        $scope.clickedToDelete = true;
        $timeout(function appear() {$scope.appear = true}, 1000)
      } else {
        $scope.clickedToDelete = false;
        $scope.appear = false;
      }

      console.log("clickedToDelete: " + $scope.clickedToDelete)

      $scope.selectionInversion = false;
      $scope.allSelected = false;

      if (safeCount < 1 && incompCount < 1) {
        $scope.allSelected = false;
      } else if (safeCount > 0 && incompCount > 1 && safeCount < incompCount) {
        $scope.selectionInversion = true;
      } else if (safeCount == incompCount) {
        $scope.allSelected = true;
      }

      console.log("allSelected: " + $scope.allSelected);
      console.log("selectionInversion: " + $scope.selectionInversion);
    }

    $scope.selectAllForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
      $scope.allSelected = true;
    };

    $scope.undoAllSelectForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
      $scope.allSelected = false;
    };

    $scope.invertSelectForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
    }

    $scope.deleteSelected = function() {
      for (var i = 0; i < students.length; i++)
        if (students[i].isComplete === false && students[i].isSafeToComplete === true) {
          var newDueDate = 0;
          var newhours = 0;
          var newMinutes = 0;
          $scope.updateCompletion(students[i], newDueDate, newhours, newMinutes);
        }
    };

    $scope.updateCompletion = function(student, newDueDate, newhours, newMinutes) {
      StudentCrud.updateCompletion(student, newDueDate, newhours, newMinutes);
      StudentCrud.processOldCompletestudents();
    };

// End CRUD Functions

  }
]);
