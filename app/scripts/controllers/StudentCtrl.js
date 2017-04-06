spedtracker.controller('StudentCtrl', ["$scope", "StudentCrud", "UserCrud", "modalService", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth", "$cookies",
  function($scope, StudentCrud, UserCrud, modalService, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth, $cookies) {

    // Remember, Firebase only accepts object, array, string, number, boolean, or null (see: https://www.firebase.com/docs/web/api/firebase/set.html)

    $scope.students = StudentCrud.getAllStudents();

    var students = $scope.students;

    var refreshTime = function() {
      time = Date.now();
      $scope.time = time;
      return $scope.time;
    };

    $interval(refreshTime, 1000);

    // var parseTime = function(millis) {
    //   var countdown = StudentCrud.parseTime(millis);
    //   return countdown;
    // };

    // $scope.timerOff = true;

    // $scope.startTimer = function() {
    //   $interval($scope.timer, 1000);
    // }

    // $scope.startTime = 0;

    $scope.startTimer = function(student) {
      student.test1StartTime = Date.now();
      students.$save(student);
      $scope.timer(student);
    }

    $scope.timer = function(student) {
      var fullTime = student.test1StartTime + (student.test1Time * student.extendTime);
      var timeLeftInMillisecs = fullTime - $scope.time;

      // if (student.test1StartTime == 0) {
      //
      //   return StudentCrud.parseTime(0);
      // } else {
      //   var time = $scope.startTime;
      // }


      var countdown = StudentCrud.parseTime(timeLeftInMillisecs);
      return countdown;
    };

    $scope.timer3 = function(student) {
      time = Date.now();
      var startTime = Date.now() + (student.extendTime * student.test1Time);

      var fullTime = startTime - time;

      // console.log("seconds: " + parseTime(fullTime).second);

      if (fullTime < 0 || $scope.timerOff) {
        return {
          hour: 0,
          minute: 0,
          second: 0
        };
      } else {
        return {
          hour: parseTime(fullTime).hour,
          minute: parseTime(fullTime).minute,
          second: parseTime(fullTime).second
        };
      }

    };

    $interval($scope.timer, 1000);

    $scope.test1Time = function(student) {
      var time = "" + StudentCrud.parseTime(student.test1Time).hour + "h, " + StudentCrud.parseTime(student.test1Time).minute + "m";
      return time;
    }


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

    $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    $scope.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    $scope.test1hourwrap = {};
    $scope.test1minutewrap = {};
    $scope.test2hourwrap = {};
    $scope.test2minutewrap = {};
// End Estimate

// Begin CRUD Functions

    $scope.addStudent = function() {
      StudentCrud.addStudent($scope.newStudentName, $scope.timewrap.selectedTime, $scope.newtest1Name, $scope.test1hourwrap.selectedHour, $scope.test1minutewrap.selectedMinute, $scope.newtest2Name, $scope.test2hourwrap.selectedHour, $scope.test2minutewrap.selectedMinute);
      var owner = "addStudent at " + Date.now();
      toggleInvert(owner);
    };

    $scope.saveAndToggleInvert = function(student) {
      students.$save(student);
      var owner = "saveAndToggleInvert at " + Date.now();
      toggleInvert(owner);
    };

    $scope.invertSelect = false;
    $scope.selectAll = true;

    var toggleInvert = function(owner) {

      console.log("called by " + owner);

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

      console.log("clickedToDelete: " + $scope.clickedToDelete);

      if (safeCount > 0 && unsafeCount > 1) {
        $scope.invertSelect = true;
        $scope.selectAll = false;
        console.log("safeCount: " + safeCount);
        console.log("invertSelect is true; selectAll is false");
      } else if (safeCount == students.length) {
        $scope.invertSelect = false;
        $scope.selectAll = false;
        $scope.clickedToDelete = true;
        console.log("invertSelect is false; selectAll is true");
      } else if (safeCount == 0) {
        $scope.invertSelect = false;
        $scope.selectAll = true;
        console.log("invertSelect is false; selectAll is true");
      }

    }

    $scope.selectAllForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
      $scope.selectAll = false;
      $scope.clickedToDelete = true;
      $timeout(function appear() {$scope.appear = true}, 1000)
      console.log("selectAll: " + $scope.selectAll);
      console.log("invertSelect: " + $scope.invertSelect);
    };

    $scope.undoAllSelectForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
      $scope.selectAll = true;
      $scope.clickedToDelete = false;
      $scope.appear = false;
      console.log("selectAll: " + $scope.selectAll);
      console.log("invertSelect: " + $scope.invertSelect);
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
      var owner = "delete at " + Date.now();
      $timeout(toggleInvert(owner), 1000);
      StudentCrud.delete(student);
    };

// End CRUD Functions

  }
]);
