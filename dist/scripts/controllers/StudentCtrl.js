spedtracker.controller('StudentCtrl', ["$scope", "StudentCrud", "UserCrud", "modalService", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth", "$cookies",
  function($scope, StudentCrud, UserCrud, modalService, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth, $cookies) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.students = StudentCrud.getAllStudents();

    var students = $scope.students;

    var refreshTime = function() {
      time = Date.now();
      $scope.time = time;
      return time;
    };

    $interval(refreshTime, 1000);

    $scope.parseTime = function(timeInMillisecs) {
      StudentCrud.parseTime(timeInMillisecs);
    }

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
      var unsafeCount = 0;
      var safeCount = 0;

      for (i = 0; i < students.length; i++) {
        if (students[i] && students[i].isSafeToDelete) {
          safeCount++;
        } else if (students[i] && !students[i].isSafeToDelete) {
          unsafeCount++;
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

      $scope.invertSelect = false;
      $scope.selectAll = true;

      if (safeCount > 0 && unsafeCount > 1) {
        $scope.invertSelect = true;
        $scope.selectAll = false;
      } else if (safeCount == students.length) {
        $scope.invertSelect = false;
        $scope.selectAll = false;
      } else if (safeCount == 0) {
        $scope.invertSelect = false;
        $scope.selectAll = true;
      }

      console.log("selectAll: " + $scope.selectAll);
      console.log("invertSelect: " + $scope.invertSelect);
    }

    $scope.selectAllForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
      $scope.selectAll = true;
    };

    $scope.undoAllSelectForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
      $scope.selectAll = false;
    };

    $scope.invertSelectForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
    }

    $scope.deleteSelected = function() {
      for (var i = 0; i < students.length; i++)
        if (students[i].isSafeToDelete) {
          $scope.delete(students[i]);
        }
    };

    $scope.delete = function(student) {
      StudentCrud.delete(student);
    };

// End CRUD Functions

  }
]);
