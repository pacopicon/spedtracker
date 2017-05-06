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

    // Custom Time in case a student already began the test
    $scope.newDueDate = new Date().setMinutes(0, 0);

    var promise;

    $scope.startTimer = function(student, testNo) {
      if (testNo == "test1" && student.test1StartTime == 0) {
        console.log("path 1 chosen");
        student.isTimer1Start = true;
        student.test1StartTime = Date.now();
        if (student.pausedTotal1 == 0) {
          student.test1StartRecord = Date.now();
        }

      } else if (testNo == "test2" && student.test2StartTime == 0) {
        console.log("path 2 chosen");
        student.isTimer2Start = true;
        student.test2StartTime = Date.now();
        if (student.pausedTotal2 == 0) {
          student.test2StartRecord = Date.now();
        }

      } else {
        console.log("path 3 chosen");
        return $scope.timer(student, testNo);
      }

      students.$save(student).then(function() {
        console.log("promise passed");
        var promise = $interval(function() {$scope.timer(student, testNo)}, 1000);
      });

      console.log("promise: " + promise);
      return promise;
    };

    // $scope.timer = function(student, testNo) {
    //
    //   timerTime = Date.now();
    //
    //   if (testNo == "test1") {
    //     // in case timer has not started yet (test 1)
    //     if (student.test1StartTime == 0 && !student.isTest1Over) {
    //       countdown = StudentCrud.parseTime(student.totalTime1);
    //       // console.log("option 1a called");
    //       return countdown;
    //     // timer 1 runs out to zero
    //     } else if (student.totalTime1 + student.test1StartTime <= Date.now()) {
    //       // console.log("option 2a called");
    //       countdown = StudentCrud.parseTime(0);
    //       student.isTest1Over = true;
    //       student.isTimer1Paused = false;
    //       student.isTimer1Start = false;
    //       students.$save(student).then(function() {
    //         return countdown;
    //       });
    //     // timer is counting down (test 1)
    //     } else if (!student.isTimer1Paused && !student.isTest1Over) {
    //     // console.log("option 3a called");
    //     var dueTime = student.test1StartTime + student.totalTime1;
    //     // timer is paused (test 1)
    //     } else if (student.isTimer1Paused && !student.isTest1Over) {
    //       // console.log("option 4a called");
    //       countdown = StudentCrud.parseTime(student.totalTime1);
    //       return countdown;
    //     }
    //
    //   } else if (testNo == "test2") {
    //     // in case timer has not started yet (test 2)
    //     if (student.test2StartTime == 0 && !student.isTest2Over) {
    //     //  console.log("option 1b called");
    //      countdown = StudentCrud.parseTime(student.totalTime2);
    //      return countdown;
    //     // timer 2 runs out to zero
    //     } else if (student.totalTime2 + student.test2StartTime <= Date.now()) {
    //       // console.log("option 2b called");
    //       countdown = StudentCrud.parseTime(0);
    //       student.isTest2Over = true;
    //       student.isTimer2Paused = false;
    //       student.isTimer2Start = false;
    //       students.$save(student).then(function() {
    //         return countdown;
    //       });
    //     // timer is counting down (test 2)
    //     } else if (!student.isTimer2Paused && !student.isTest2Over) {
    //     //  console.log("option 3b called");
    //      var dueTime = student.test2StartTime + student.totalTime2;
    //     // timer is paused (test 2)
    //     } else if (student.isTimer2Paused && !student.isTest2Over) {
    //       // console.log("option 4b called");
    //       countdown = StudentCrud.parseTime(student.totalTime2);
    //       return countdown;
    //
    //     }
    //   }
    //
    //   // timeLeftInMillisecs = dueTime - $scope.time;
    //   timeLeftInMillisecs = dueTime - timerTime;
    //   // console.log("timerTime = " + timerTime);
    //   countdown = StudentCrud.parseTime(timeLeftInMillisecs);
    //   return countdown;
    // };

    $scope.timer = function(student, testNo) {

      timerTime = Date.now();

      if (testNo == "test1") {
        // in case timer has not started yet (test 1)
        if (student.test1StartTime == 0 && !student.isTest1Over) {
          countdown = student.totalTime1;
          // console.log("option 1a called");
          return countdown;
        // timer 1 runs out to zero
        } else if (student.totalTime1 + student.test1StartTime <= Date.now()) {
          // console.log("option 2a called");
          countdown = 0;
          student.isTest1Over = true;
          student.isTimer1Paused = false;
          student.isTimer1Start = false;
          students.$save(student).then(function() {
            return countdown;
          });
        // timer is counting down (test 1)
        } else if (!student.isTimer1Paused && !student.isTest1Over) {
        // console.log("option 3a called");
        var dueTime = student.test1StartTime + student.totalTime1;
        // timer is paused (test 1)
        } else if (student.isTimer1Paused && !student.isTest1Over) {
          // console.log("option 4a called");
          countdown = student.totalTime1;
          return countdown;
        }

      } else if (testNo == "test2") {
        // in case timer has not started yet (test 2)
        if (student.test2StartTime == 0 && !student.isTest2Over) {
        //  console.log("option 1b called");
         countdown = student.totalTime2;
         return countdown;
        // timer 2 runs out to zero
        } else if (student.totalTime2 + student.test2StartTime <= Date.now()) {
          // console.log("option 2b called");
          countdown = 0;
          student.isTest2Over = true;
          student.isTimer2Paused = false;
          student.isTimer2Start = false;
          students.$save(student).then(function() {
            return countdown;
          });
        // timer is counting down (test 2)
        } else if (!student.isTimer2Paused && !student.isTest2Over) {
        //  console.log("option 3b called");
         var dueTime = student.test2StartTime + student.totalTime2;
        // timer is paused (test 2)
        } else if (student.isTimer2Paused && !student.isTest2Over) {
          // console.log("option 4b called");
          countdown = student.totalTime2;
          return countdown;

        }
      }

      // timeLeftInMillisecs = dueTime - $scope.time;
      timeLeftInMillisecs = dueTime - timerTime;
      // console.log("timerTime = " + timerTime);
      countdown = timeLeftInMillisecs;
      return countdown;
    };

    $scope.pauseTimer = function(student, testNo) {

      if (testNo == "test1") {
        student.isTimer1Paused = true;
        student.totalTime1 = (student.test1StartTime + student.totalTime1) - Date.now();
        student.test1StartTime = 0;
        student.pausedTime1 = Date.now();
      } else if (testNo == "test2") {
        student.isTimer2Paused = true;
        student.totalTime2 = (student.test2StartTime + student.totalTime2) - Date.now();
        student.test2StartTime = 0;
        student.pausedTime2 = Date.now();
      }
      students.$save(student).then(function() {
        $interval.cancel(promise);
      });


      $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $interval.cancel(promise);
      });

      console.log("promise: " + promise);
    };

    $scope.resumeTimer = function(student, testNo) {
      if (testNo == "test1") {
        student.isTimer1Paused = false;
        student.pausedTotal1 += Date.now() - student.pausedTime1;
      } else if (testNo == "test2") {
        student.isTimer2Paused = false;
        student.pausedTotal2 += Date.now() - student.pausedTime2;
      }

      console.log("resumeTimer called");
      students.$save(student).then(function() {
        $scope.startTimer(student, testNo);
      });
    };

    $scope.resetTimer = function(student, testNo) {
      if (testNo == "test1") {
        student.isTimer1Paused = false;
        student.totalTime1 = student.test1Time * student.extendTime;
        student.pausedTime1 = 0;
        student.pausedTotal1 = 0;
        student.isTimer1Start = false;
      } else if (testNo == "test2") {
        student.isTimer2Paused = false;
        student.totalTime2 = student.test2Time * student.extendTime;
        student.pausedTime2 = 0;
        student.pausedTotal2 = 0;
        student.isTimer2Start = false;
      }

      console.log("resumeTimer called");
      students.$save(student).then(function() {
        $scope.startTimer(student, testNo);
      });
    };

    $scope.endTimer = function(student, testNo) {
      if (testNo == "test1") {
        student.test1StartTime = 0;
      } else if (testNo == "test2") {
        student.test2StartTime = 0;
      }
      console.log("endTimer called");
      students.$save(student);
    };

    // $scope.startTime = function(student, testNo) {
    //
    //   if (testNo == "test1") {
    //     var time = StudentCrud.parseTime(student.test1StartRecord);
    //   } else if (testNo == "test2") {
    //     var time = StudentCrud.parseTime(student.test2StartRecord);
    //   }
    //   return time;
    // };

    $scope.startTime = function(student, testNo) {

      if (testNo == "test1") {
        var time = student.test1StartRecord;
      } else if (testNo == "test2") {
        var time = student.test2StartRecord;
      }
      return time;
    };

    $scope.endTime = function(student, testNo) {

      if (testNo == "test1") {
        time = student.test1Time + student.test1StartRecord;
      } else if (testNo == "test2") {
        time = student.test2Time + student.test2StartRecord;
      }
      return time;
    };

    $scope.extEndTime = function(student, testNo) {

      if (testNo == "test1") {
        totalEndTime1 = (student.test1Time * student.extendTime) + student.test1StartRecord;
        var time = StudentCrud.parseTime(totalEndTime1);
      } else if (testNo == "test2") {
        totalEndTime2 = (student.test2Time * student.extendTime) + student.test2StartRecord;
        var time = StudentCrud.parseTime(totalEndTime2);
      }
      return time;
    };

    $scope.totalPausedTime = function(student, testNo) {
      if (testNo == "test1") {
        var time = StudentCrud.parseTime(student.pausedTotal1);
      } else if (testNo == "test2") {
        var time = StudentCrud.parseTime(student.pausedTotal2);
      }
      return time;
    }

    $scope.testTime = function(student, testNo) {

      if (testNo == "test1") {
        var time = StudentCrud.parseTime(student.test1Time);
      } else if (testNo == "test2") {
        var time = StudentCrud.parseTime(student.test2Time);
      } else if (testNo == "test1Ext") {
        var time = StudentCrud.parseTime(student.test1Time * student.extendTime);
      } else if (testNo == "test2Ext") {
        var time = StudentCrud.parseTime(student.test2Time * student.extendTime);
      }
      return time;
    };

// Begin AngularStrap popover

    $scope.dateTip = {
      "title": "enter estimated time to complete in hours",
      "checked": false
    };

// Begin ExtendTime

    $scope.timewrap = {};

    $scope.times = [1, 1.5, 2, 2.5, 3];

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
        $timeout(function appear() {$scope.deleteAppear = true}, 600);
      } else {
        $scope.clickedToDelete = false;
        $scope.deleteAppear = false;
      }

      console.log("clickedToDelete: " + $scope.clickedToDelete);

      if (safeCount > 0 && unsafeCount > 1) {
        $scope.invertSelect = true;
        $scope.selectAll = false;
        console.log("safeCount: " + safeCount);
        console.log("invertSelect is true; selectAll is false");
      } else if (safeCount > 0 && safeCount == students.length) {
        $scope.invertSelect = false;
        $scope.selectAll = false;
        $scope.clickedToDelete = true;
        console.log("invertSelect is false; selectAll is true");
      } else if (safeCount == 0) {
        $scope.invertSelect = false;
        $scope.selectAll = true;
        $scope.clickedToDelete = false;
        console.log("invertSelect is false; selectAll is true");
      }

    }

    $scope.selectAllForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
      $scope.selectAll = false;
      $scope.clickedToDelete = true;
      $timeout(function appear() {$scope.deleteAppear = true}, 600);;
      console.log("selectAll: " + $scope.selectAll);
      console.log("invertSelect: " + $scope.invertSelect);
    };

    $scope.undoAllSelectForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
      $scope.selectAll = true;
      $scope.clickedToDelete = false;
      $scope.deleteAppear = false;
      console.log("selectAll: " + $scope.selectAll);
      console.log("invertSelect: " + $scope.invertSelect);
    };

    $scope.invertSelectForDelete = function(students) {
      StudentCrud.toggleSelectForDelete(students);
    };

    // $scope.$watch(getItems, watcherFunction, true);
    //   function getItems() {
    //     return StudentCrud.getAllStudents();
    //   };
    //
    // function watcherFunction(newData) {
    //   toggleInvert("delete");
    // };

    $scope.deleteSelected = function() {
      for (var i = 0; i < students.length; i++)
        if (students[i].isSafeToDelete) {
          $scope.delete(students[i]);
        }
    };

    $scope.delete = function(student) {
      var owner = "delete at " + Date.now();
      $timeout(toggleInvert(owner), 1000);
      $scope.selectAll = true;
      $scope.clickedToDelete = false;
      $scope.deleteAppear = false;
      StudentCrud.delete(student);
    };

// End CRUD Functions

  }
]);
