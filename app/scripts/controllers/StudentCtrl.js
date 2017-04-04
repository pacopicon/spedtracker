spedtracker.controller('StudentCtrl', ["$scope", "StudentCrud", "UserCrud", "modalService", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth", "$cookies",
  function($scope, StudentCrud, UserCrud, modalService, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth, $cookies) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.students = StudentCrud.getAllStudents();

    var refreshTime = function() {
      time = Date.now();
      $scope.time = time;
      return time;
    };

    $interval(refreshTime, 1000);

    $scope.startTimer = function(examTime) {
      var examEndTime = $scope.time + examTime;
      var timeLeftInMillisecs = examEndTime - $scope.time;
      $scope.countdown = StudentCrud.parseTime(timeLeftInMillisecs);
      return $scope.countdown;
    };

    // Begin AngularStrap popover

    $scope.dateTip = {
      "title": "enter estimated time to complete in hours",
      "checked": false
    };

// Begin ExtendTime

    $scope.timewrap = {};

    $scope.times = [1.5, 2, 2.5, 3];

// End ExtendTime

// Begin Estimate

    $scope.hourwrap = {};

    $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    $scope.minutewrap = {};

    $scope.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

// End Estimate

// Begin CRUD Functions

    $scope.addStudent = function() {
      StudentCrud.addStudent($scope.newStudentName, $scope.timewrap.selectedTime, $scope.newTestName, $scope.hourwrap.selectedHour, $scope.minutewrap.selectedMinute);
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
