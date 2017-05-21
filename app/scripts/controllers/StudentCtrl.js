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
        student.isTimer1Start = true;
        student.test1StartTime = Date.now();
        if (student.pausedTotal1 == 0) {
          student.test1StartRecord = Date.now();
        }

      } else if (testNo == "test2" && student.test2StartTime == 0) {
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

    var processTime = function(unprocessedTime, hourOption) {
      unprocessedTimeObj = new Date(unprocessedTime);
      unprocessedHour = unprocessedTimeObj.getHours();
      processedHour = unprocessedHour - hourOption;
      var processedTime = unprocessedTimeObj.setHours(processedHour);
      return processedTime;
    };

    var countup = 18000000;

    $scope.timer = function(student, testNo) {

      timerTime = Date.now();

      if (testNo == "test1") {
        // in case timer has not started yet (test 1) OR: timer has ended
        if ((student.test1StartTime == 0 && !student.isTest1Over) || student.isTest1Over) {
          // console.log("option 1a called");
          totalTime = student.totalTime1
          countdown = processTime(totalTime, 7);
          progressBar1 = totalTime;
          extendBar1 = totalTime - student.test1Time;
          standBar1 = totalTime - extendBar1;
          // timer 1 runs out to zero
        } else if (student.totalTime1 + student.test1StartTime <= Date.now() && !student.isTest1Over) {
          // console.log("option 2a called");
          countdown = 18000000;
          progressBar1 = 0;
          standBar1 = 0;
          extendBar1 = 0;
          student.isTest1Over = true;
          student.isTimer1Paused = false;
          students.$save(student).then(function() {
          });
        // timer is counting down (test 1)
        } else if (!student.isTimer1Paused && !student.isTest1Over) {
          // console.log("option 3a called");
          testStartTime = student.test1StartTime;
          totalTime = student.totalTime1;
          dueTime = processTime(testStartTime + totalTime, 7);
          countdown = dueTime - timerTime;
          progressBar1 = testStartTime + totalTime - timerTime;
          standBar1 = testStartTime + student.test1Time - timerTime;
          extendBar1 = testStartTime + totalTime - student.test1Time - timerTime;
        // timer is paused (test 1)
        } else if (student.isTimer1Paused && !student.isTest1Over) {
          // console.log("option 4a called");
          totalTime = student.totalTime1;
          countdown = totalTime;
          progressBar1 = totalTime;
          extendBar1 = totalTime - student.test1Time;
          standBar1 = totalTime - extendBar1;
        }

      } else if (testNo == "test2") {
        // in case timer has not started yet (test 2) OR: timer has ended
        if ((student.test2StartTime == 0 && !student.isTest2Over) || student.isTest2Over) {
          // console.log("option 1a called");
          totalTime = student.totalTime2
          countdown = processTime(totalTime, 7);
          progressBar2 = totalTime;
          extendBar2 = totalTime - student.test2Time;
          standBar2 = totalTime - extendBar2;
          // timer 2 runs out to zero
        } else if (student.totalTime2 + student.test2StartTime <= Date.now() && !student.isTest2Over) {
          // console.log("option 2a called");
          countdown = 18000000;
          progressBar2 = 0;
          standBar2 = 0;
          extendBar2 = 0;
          student.isTest2Over = true;
          student.isTimer2Paused = false;
          students.$save(student).then(function() {
          });
        // timer is counting down (test 2)
        } else if (!student.isTimer2Paused && !student.isTest2Over) {
          // console.log("option 3a called");
          testStartTime = student.test2StartTime;
          totalTime = student.totalTime2;
          dueTime = processTime(testStartTime + totalTime, 7);
          countdown = dueTime - timerTime;
          progressBar2 = testStartTime + totalTime - timerTime;
          standBar2 = testStartTime + student.test2Time - timerTime;
          extendBar2 = testStartTime + totalTime - student.test2Time - timerTime;
        // timer is paused (test 2)
        } else if (student.isTimer2Paused && !student.isTest2Over) {
          // console.log("option 4a called");
          totalTime = student.totalTime2;
          countdown = totalTime;
          progressBar2 = totalTime;
          extendBar2 = totalTime - student.test2Time;
          standBar2 = totalTime - extendBar2;
        }
      }

      if (typeof progressBar2 === "undefined") {
        progressBar2 = 0;
      }

      if (typeof standBar2 === "undefined") {
        standBar2 = 0;
      }

      if (typeof extendBar2 === "undefined") {
        extendBar2 = 0;
      }

      if (typeof progressBar1 === "undefined") {
        progressBar1 = 0;
      }

      if (typeof standBar1 === "undefined") {
        standBar1 = 0;
      }

      if (typeof extendBar1 === "undefined") {
        extendBar1 = 0;
      }

      return {
        countdown: countdown,
        countup: countup,
        progressBar1: progressBar1,
        progressBar2: progressBar2,
        standBar1: standBar1,
        standBar2: standBar2,
        extendBar1: extendBar1,
        extendBar2: extendBar2
      }
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
        student.test1StartTime = 0;
        student.isTimer1Start = false;
      } else if (testNo == "test2") {
        student.isTimer2Paused = false;
        student.totalTime2 = student.test2Time * student.extendTime;
        student.pausedTime2 = 0;
        student.pausedTotal2 = 0;
        student.test2StartTime = 0;
        student.isTimer2Start = false;
      }

      console.log("resumeTimer called");
      students.$save(student).then(function() {
        $interval.cancel(promise);
      });


      $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $interval.cancel(promise);
      });
    };

    $scope.endTimer = function(student, testNo) {
      if (testNo == "test1") {
        // student.totalTime1 = (student.test1StartTime + student.totalTime1) - Date.now();
        // student.test1StartTime = 0;
        student.isTest1Over = true;
        timeEnded = Date.now();
      } else if (testNo == "test2") {
        // student.totalTime2 = (student.test2StartTime + student.totalTime2) - Date.now();
        // student.test2StartTime = 0;
        student.isTest2Over = true;
      }
      console.log("endTimer called");
      students.$save(student).then(function() {
        $interval.cancel(promise);
      });


      $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $interval.cancel(promise);
      });
    };

    $scope.startTime = function(student, testNo) {

      if (testNo == "test1") {
        if (student.test1StartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.test1StartRecord > 0) {
          time = student.test1StartRecord;
        }
      } else if (testNo == "test2") {
        if (student.test2StartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.test2StartRecord > 0) {
          time = student.test2StartRecord;
        }
      }
      return time;
    };

    $scope.endTime = function(student, testNo) {

      if (testNo == "test1") {
        if (student.test1StartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.test1StartRecord > 0) {
          time = student.test1Time + student.test1StartRecord;
        }
      } else if (testNo == "test2") {
        if (student.test2StartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.test2StartRecord > 0) {
          time = student.test2Time + student.test2StartRecord;
        }
      } else if (testNo == "extTest1") {
        if (student.test1StartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.test1StartRecord > 0) {
          time = (student.test1Time * student.extendTime) + student.test1StartRecord;
        }
      } else if (testNo == "extTest2") {
        if (student.test2StartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.test2StartRecord > 0) {
          time = (student.test2Time * student.extendTime) + student.test2StartRecord;
        }
      }
      return time;
    };

    $scope.totalPausedTime = function(student, testNo) {
      if (testNo == "test1") {
        if (student.pausedTotal1 <= 0) {
          time = "-- : -- : --";
        } else if (student.pausedTotal1 > 0) {
          time = StudentCrud.parseTime(student.pausedTotal1);
        }
      } else if (testNo == "test2") {
        if (student.pausedTotal2 <= 0) {
          time = "-- : -- : --";
        } else if (student.pausedTotal2 > 0) {
          time = StudentCrud.parseTime(student.pausedTotal2);
        }
      }
      return time;
    }

    $scope.testTime = function(student, testNo) {

      if (testNo == "test1") {
        unprocessedTime = student.test1Time;
      } else if (testNo == "test2") {
        unprocessedTime = student.test2Time;
      } else if (testNo == "test1Ext") {
        unprocessedTime = (student.test1Time * student.extendTime) - student.test1Time;
      } else if (testNo == "test2Ext") {
        unprocessedTime = (student.test2Time * student.extendTime) - student.test2Time;
      } else if (testNo == "test1total") {
        unprocessedTime = student.test1Time * student.extendTime;
      } else if (testNo == "test2total") {
        unprocessedTime = student.test2Time * student.extendTime;
      }

      time = processTime(unprocessedTime, 7);

      return time;
    };

// progress bar data

var bottomBarRatio = function(student, test) {
  if (test == "test1") {
    testTime = student.test1Time;
    extension = (testTime * student.extendTime) - testTime;
    totalTime = testTime * student.extendTime
    bottomBarRatio = extension / totalTime;
  } else if (test == "test2") {
    testTime = student.test2Time;
    extension = (testTime * student.extendTime) - testTime;
    totalTime = testTime * student.extendTime
    bottomBarRatio = extension / totalTime;
  }
    console.log("bottomBarRatio = " + bottomBarRatio);
  return bottomBarRatio;
};

$scope.topBarWidth = function(student, test) {

  if (test == "test1") {
    testTime = student.test1Time;
    topBarRatio = 1 - bottomBarRatio(student, test);
    dividend = student.test1StartTime + testTime - $scope.time;
    topBarWidth = dividend / testTime * 100 * topBarRatio;
    console.log("topBarWidth = " + topBarWidth);
  } else if (test == "test2") {
    testTime = student.test2Time;
    topBarRatio = 1 - bottomBarRatio(student, test);
    dividend = student.test2StartTime + testTime - $scope.time;
    topBarWidth = dividend / testTime * 100 * topBarRatio;
  }

  return topBarWidth;
};

$scope.bottomBarWidth = function(student, test) {
  if ($scope.topBarWidth(student, 'test1') == 0) {
    testTime = student.test1Time;
    extension = (testTime * student.extendTime) - testTime;
    dividend = student.test1StartTime + extension - $scope.time
    bottomBarWidth = dividend / extension * 100 * bottomBarRatio(student, test);

  } else if ($scope.topBarWidth(student, 'test2') == 0) {
    testTime = student.test2Time;
    extension = (testTime * student.extendTime) - testTime;
    dividend = student.test2StartTime + extension - $scope.time
    bottomBarWidth = dividend / extension * 100 * bottomBarRatio(student, test);
  } else {
    bottomBarWidth = 100;
  }
    console.log("bottomBarWidth = " + bottomBarWidth);
    return bottomBarWidth;
};

// Begin AngularStrap popover

    $scope.dateTip = {
      "title": "enter estimated time to complete in hours",
      "checked": false
    };

// Begin ExtendTime

    $scope.newDueDate1 = new Date(new Date().setHours(1,0,0));
    $scope.newDueDate2 = new Date(new Date().setHours(1,0,0));


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
      if ($scope.newStudentName && $scope.timewrap.selectedTime && $scope.newtest1Name && $scope.newDueDate1 && $scope.newtest2Name && $scope.newDueDate2) {
        StudentCrud.addStudent($scope.newStudentName, $scope.timewrap.selectedTime, $scope.newtest1Name, $scope.newDueDate1, $scope.newtest2Name, $scope.newDueDate2);
        var owner = "addStudent at " + Date.now();
        toggleInvert(owner);
      } else {
        $scope.alert = true;
        $timeout(function turnOffAlert() {$scope.alert = false}, 3000);
      }

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
