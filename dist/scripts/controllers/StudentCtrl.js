spedtracker.controller('StudentCtrl', ["$scope", "StudentCrud", "UserCrud", "$rootScope", "$interval", "$log", "$http", "$locale", "$location", "$templateCache", '$timeout', "$q", "$sce", "$tooltip", "$popover", "$firebaseAuth", "$cookies",
  function($scope, StudentCrud, UserCrud, $rootScope, $interval, $log, $http, $locale, $location, $templateCache, $timeout, $q, $sce, $tooltip, $popover, $firebaseAuth, $cookies) {

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
      if (testNo == "testOne" && student.testOneStartTime == 0) {
        student.isTimerOneStart = true;
        student.testOneStartTime = Date.now();
        if (student.pausedTotalOne == 0) {
          student.testOneStartRecord = Date.now();
        }
      } else if (testNo == "testTwo" && student.testTwoStartTime == 0) {
        student.isTimerTwoStart = true;
        student.testTwoStartTime = Date.now();
        if (student.pausedTotalTwo == 0) {
          student.testTwoStartRecord = Date.now();
        }
      } else if (testNo == "testThree" && student.testThreeStartTime == 0) {
        student.isTimerThreeStart = true;
        student.testThreeStartTime = Date.now();
        if (student.pausedTotalThree == 0) {
          student.testThreeStartRecord = Date.now();
        }
      } else if (testNo == "testFour" && student.testFourStartTime == 0) {
        student.isTimerFourStart = true;
        student.testFourStartTime = Date.now();
        if (student.pausedTotalFour == 0) {
          student.testFourStartRecord = Date.now();
        }
      } else {
        console.log("path 3 chosen");
        return $scope.timer(student, testNo);
      }

      students.$save(student).then(function() {
        // console.log("promise passed");
        var promise = $interval(function() {$scope.timer(student, testNo)}, 1000);
      });

      // console.log("promise: " + promise);
      return promise;
    };

    var processTime = function(unprocessedTime, hourOption) {
      unprocessedTimeObj = new Date(unprocessedTime);
      unprocessedHour = unprocessedTimeObj.getHours();
      processedHour = unprocessedHour - hourOption;
      var processedTime = unprocessedTimeObj.setHours(processedHour);
      return processedTime;
    };

    // var countup = 18000000;

    $scope.timer = function(student, testNo) {

      extendTime = student.extendTime;
      topBarDividend = 0,
      bottomBarDividend = 0,
      topBarRatio = 0,
      bottomBarRatio = 0

      if (testNo == "testOne") {

        testStartTime = student.testOneStartTime;
        totalTime = student.totalTimeOne;
        testTime = student.testOneTime;
        extension = (testTime * extendTime) - testTime;
        actualTestTime = totalTime - extension;

        if (actualTestTime > 0) {
          actualExtension = totalTime - actualTestTime;
        } else if (actualTestTime <= 0) {
          actualExtension = totalTime;
        }

        bottomBarRatio = extension / (testTime * extendTime);
        topBarRatio = 1 - bottomBarRatio;

        // in case timer has not started yet (test 1) OR: timer has ended
        if ((student.testOneStartTime == 0 && !student.isTestOneOver && !student.isTimerOnePaused) || student.isTestOneOver) {
          topBarWidth = 100 * topBarRatio;
          bottomBarWidth = 100 * bottomBarRatio;
          countdown = processTime(totalTime, 19);
        // timer 1 runs out to zero
        } else if (student.totalTimeOne + student.testOneStartTime - Date.now() <= 0 && !student.isTimerOnePaused && !student.isTestOneOver) {
          topBarWidth = 0;
          bottomBarWidth = 0;
          countdown = 18000000;
          student.isTestOneOver = true;
          student.isTimerOnePaused = false;
          students.$save(student).then(function() {
          });
        // timer is counting down (test 1)
        } else if (!student.isTimerOnePaused && !student.isTestOneOver) {
          topBarDividend = testStartTime + actualTestTime - $scope.time;

          if (topBarDividend > 0) {
            topBarWidth = topBarDividend / testTime * 100 * topBarRatio;
            bottomBarDividend = extension;
          } else if (topBarDividend <= 0) {
            topBarWidth = 0;
            bottomBarDividend = testStartTime + totalTime - $scope.time;
          }
          // ultimate outputs
          bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
          // fn to manipulate new Date object
          dueTime = processTime(testStartTime + totalTime, 19);
          // ultimate outputs
          countdown = dueTime - $scope.time;
        // timer is paused (test 1)
        } else if (!student.isTestOneOver && student.isTimerOnePaused) {
          if (actualTestTime > 0) {
            topBarWidth = actualTestTime / testTime * 100 * topBarRatio;
            bottomBarDividend = extension;

          } else if (actualTestTime <= 0) {
            topBarWidth = 0;
            bottomBarDividend = actualExtension;
          }
          bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
          countdown = processTime(totalTime, 19);
        }

      } else if (testNo == "testTwo") {

        testStartTime = student.testTwoStartTime;
        totalTime = student.totalTimeTwo;
        testTime = student.testTwoTime;
        extension = (testTime * extendTime) - testTime;

        actualTestTime = totalTime - extension;

        if (actualTestTime > 0) {
          actualExtension = totalTime - actualTestTime;
        } else if (actualTestTime <= 0) {
          actualExtension = totalTime;
        }
        // ratios for bar widths
        bottomBarRatio = extension / (testTime * extendTime);
        topBarRatio = 1 - bottomBarRatio;

        // in case timer has not started yet (test 1) OR: timer has ended
        if ((student.testTwoStartTime == 0 && !student.isTestTwoOver && !student.isTimerTwoPaused) || student.isTestTwoOver) {
          topBarWidth = 100 * topBarRatio;
          bottomBarWidth = 100 * bottomBarRatio;

          countdown = processTime(totalTime, 19);
          // timer 1 runs out to zero
        } else if (student.totalTimeTwo + student.testTwoStartTime - Date.now() <= 0 && !student.isTimerTwoPaused && !student.isTestTwoOver) {
          topBarWidth = 0;
          bottomBarWidth = 0;

          countdown = 18000000;
          student.isTestTwoOver = true;
          student.isTimerTwoPaused = false;
          students.$save(student).then(function() {
          });
        // timer is counting down (test 2)
        } else if (!student.isTimerTwoPaused && !student.isTestTwoOver) {
          topBarDividend = testStartTime + actualTestTime - $scope.time;

          if (topBarDividend > 0) {
            topBarWidth = topBarDividend / testTime * 100 * topBarRatio;
            bottomBarDividend = extension;
          } else if (topBarDividend <= 0) {
            topBarWidth = 0;
            bottomBarDividend = testStartTime + totalTime - $scope.time;
          }
          // ultimate outputs
          bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
          // fn to manipulate new Date object
          dueTime = processTime(testStartTime + totalTime, 19);
          // ultimate outputs
          countdown = dueTime - $scope.time;
        // timer is paused (test 1)
        } else if (!student.isTestTwoOver && student.isTimerTwoPaused) {

          if (actualTestTime > 0) {
            topBarWidth = actualTestTime / testTime * 100 * topBarRatio;
            bottomBarDividend = extension;

          } else if (actualTestTime <= 0) {
            topBarWidth = 0;
            bottomBarDividend = actualExtension;

          }
          bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
          countdown = processTime(totalTime, 19);
        }
      } else if (testNo == "testThree") {

        testStartTime = student.testThreeStartTime;
        totalTime = student.totalTimeThree;
        testTime = student.testThreeTime;
        extension = (testTime * extendTime) - testTime;

        actualTestTime = totalTime - extension;

        if (actualTestTime > 0) {
          actualExtension = totalTime - actualTestTime;
        } else if (actualTestTime <= 0) {
          actualExtension = totalTime;
        }
        // ratios for bar widths
        bottomBarRatio = extension / (testTime * extendTime);
        topBarRatio = 1 - bottomBarRatio;

        // in case timer has not started yet (test 1) OR: timer has ended
        if ((student.testThreeStartTime == 0 && !student.isTestThreeOver && !student.isTimerThreePaused) || student.isTestThreeOver) {
          topBarWidth = 100 * topBarRatio;
          bottomBarWidth = 100 * bottomBarRatio;

          countdown = processTime(totalTime, 19);
          // timer 1 runs out to zero
        } else if (student.totalTimeThree + student.testThreeStartTime - Date.now() <= 0 && !student.isTimerThreePaused && !student.isTestThreeOver) {
          topBarWidth = 0;
          bottomBarWidth = 0;

          countdown = 18000000;
          student.isTestThreeOver = true;
          student.isTimerThreePaused = false;
          students.$save(student).then(function() {
          });
        // timer is counting down (test 2)
      } else if (!student.isTimerThreePaused && !student.isTestThreeOver) {
          topBarDividend = testStartTime + actualTestTime - $scope.time;

          if (topBarDividend > 0) {
            topBarWidth = topBarDividend / testTime * 100 * topBarRatio;
            bottomBarDividend = extension;
          } else if (topBarDividend <= 0) {
            topBarWidth = 0;
            bottomBarDividend = testStartTime + totalTime - $scope.time;
          }
          // ultimate outputs
          bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
          // fn to manipulate new Date object
          dueTime = processTime(testStartTime + totalTime, 19);
          // ultimate outputs
          countdown = dueTime - $scope.time;
        // timer is paused (test 1)
      } else if (!student.isTestThreeOver && student.isTimerThreePaused) {

          if (actualTestTime > 0) {
            topBarWidth = actualTestTime / testTime * 100 * topBarRatio;
            bottomBarDividend = extension;

          } else if (actualTestTime <= 0) {
            topBarWidth = 0;
            bottomBarDividend = actualExtension;

          }
          bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
          countdown = processTime(totalTime, 19);
        }
      } else if (testNo == "testFour") {

        testStartTime = student.testFourStartTime;
        totalTime = student.totalTimeFour;
        testTime = student.testFourTime;
        extension = (testTime * extendTime) - testTime;

        actualTestTime = totalTime - extension;

        if (actualTestTime > 0) {
          actualExtension = totalTime - actualTestTime;
        } else if (actualTestTime <= 0) {
          actualExtension = totalTime;
        }
        // ratios for bar widths
        bottomBarRatio = extension / (testTime * extendTime);
        topBarRatio = 1 - bottomBarRatio;

        // in case timer has not started yet (test 1) OR: timer has ended
        if ((student.testFourStartTime == 0 && !student.isTestFourOver && !student.isTimerFourPaused) || student.isTestFourOver) {
          topBarWidth = 100 * topBarRatio;
          bottomBarWidth = 100 * bottomBarRatio;

          countdown = processTime(totalTime, 19);
          // timer 1 runs out to zero
        } else if (student.totalTimeFour + student.testFourStartTime - Date.now() <= 0 && !student.isTimerFourPaused && !student.isTestFourOver) {
          topBarWidth = 0;
          bottomBarWidth = 0;

          countdown = 18000000;
          student.isTestFourOver = true;
          student.isTimerFourPaused = false;
          students.$save(student).then(function() {
          });
        // timer is counting down (test 2)
      } else if (!student.isTimerFourPaused && !student.isTestFourOver) {
          topBarDividend = testStartTime + actualTestTime - $scope.time;

          if (topBarDividend > 0) {
            topBarWidth = topBarDividend / testTime * 100 * topBarRatio;
            bottomBarDividend = extension;
          } else if (topBarDividend <= 0) {
            topBarWidth = 0;
            bottomBarDividend = testStartTime + totalTime - $scope.time;
          }
          // ultimate outputs
          bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
          // fn to manipulate new Date object
          dueTime = processTime(testStartTime + totalTime, 19);
          // ultimate outputs
          countdown = dueTime - $scope.time;
        // timer is paused (test 1)
      } else if (!student.isTestFourOver && student.isTimerFourPaused) {

          if (actualTestTime > 0) {
            topBarWidth = actualTestTime / testTime * 100 * topBarRatio;
            bottomBarDividend = extension;

          } else if (actualTestTime <= 0) {
            topBarWidth = 0;
            bottomBarDividend = actualExtension;

          }
          bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
          countdown = processTime(totalTime, 19);
        }
      }

      return {
        countdown: countdown,
        top: topBarWidth,
        bottom: bottomBarWidth,
        topBarDividend: topBarDividend,
        bottomBarDividend: bottomBarDividend
      }
    };

    $scope.pauseTimer = function(student, testNo) {

      if (testNo == "testOne") {
        student.isTimerOnePaused = true;
        student.totalTimeOne = (student.testOneStartTime + student.totalTimeOne) - Date.now();
        student.testOneStartTime = 0;
        student.pausedTimeOne = Date.now();
      } else if (testNo == "testTwo") {
        student.isTimerTwoPaused = true;
        student.totalTimeTwo = (student.testTwoStartTime + student.totalTimeTwo) - Date.now();
        student.testTwoStartTime = 0;
        student.pausedTimeTwo = Date.now();
      } else if (testNo == "testThree") {
        student.isTimerThreePaused = true;
        student.totalTimeThree = (student.testThreeStartTime + student.totalTimeThree) - Date.now();
        student.testThreeStartTime = 0;
        student.pausedTimeThree = Date.now();
      } else if (testNo == "testFour") {
        student.isTimerFourPaused = true;
        student.totalTimeFour = (student.testFourStartTime + student.totalTimeFour) - Date.now();
        student.testFourStartTime = 0;
        student.pausedTimeFour = Date.now();
      }

      students.$save(student).then(function() {
        $interval.cancel(promise);
      });


      $scope.$on('$destroy', function() {
        $interval.cancel(promise);
      });

      $scope.timer(student, testNo);

    };

    $scope.resumeTimer = function(student, testNo) {
      if (testNo == "testOne") {
        student.isTimerOnePaused = false;
        student.pausedTotalOne += Date.now() - student.pausedTimeOne;
      } else if (testNo == "testTwo") {
        student.isTimerTwoPaused = false;
        student.pausedTotalTwo += Date.now() - student.pausedTimeTwo;
      } else if (testNo == "testThree") {
        student.isTimerThreePaused = false;
        student.pausedTotalThree += Date.now() - student.pausedTimeThree;
      } else if (testNo == "testFour") {
        student.isTimerFourPaused = false;
        student.pausedTotalFour += Date.now() - student.pausedTimeFour;
      }

      students.$save(student).then(function() {
        $scope.startTimer(student, testNo);
      });
    };

    $scope.resetTimer = function(student, testNo) {
      if (testNo == "testOne") {
        student.isTimerOnePaused = false;
        student.totalTimeOne = student.testOneTime * student.extendTime;
        student.pausedTimeOne = 0;
        student.pausedTotalOne = 0;
        student.testOneStartTime = 0;
        student.isTimerOneStart = false;
      } else if (testNo == "testTwo") {
        student.isTimerTwoPaused = false;
        student.totalTimeTwo = student.testTwoTime * student.extendTime;
        student.pausedTimeTwo = 0;
        student.pausedTotalTwo = 0;
        student.testTwoStartTime = 0;
        student.isTimerTwoStart = false;
      } else if (testNo == "testThree") {
        student.isTimerThreePaused = false;
        student.totalTimeThree = student.testThreeTime * student.extendTime;
        student.pausedTimeThree = 0;
        student.pausedTotalThree = 0;
        student.testThreeStartTime = 0;
        student.isTimerThreeStart = false;
      } else if (testNo == "testFour") {
        student.isTimerFourPaused = false;
        student.totalTimeFour = student.testFourTime * student.extendTime;
        student.pausedTimeFour = 0;
        student.pausedTotalFour = 0;
        student.testFourStartTime = 0;
        student.isTimerFourStart = false;
      }

      students.$save(student).then(function() {
        $interval.cancel(promise);
      });


      $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $interval.cancel(promise);
      });
    };

    $scope.endTimer = function(student, testNo) {
      if (testNo == "testOne") {
        student.isTestOneOver = true;
        timeEnded = Date.now();
      } else if (testNo == "testTwo") {
        student.isTestTwoOver = true;
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

      if (testNo == "testOne") {
        if (student.testOneStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testOneStartRecord > 0) {
          time = student.testOneStartRecord;
        }
      } else if (testNo == "testTwo") {
        if (student.testTwoStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testTwoStartRecord > 0) {
          time = student.testTwoStartRecord;
        }
      } else if (testNo == "testThree") {
        if (student.testThreeStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testThreeStartRecord > 0) {
          time = student.testThreeStartRecord;
        }
      } else if (testNo == "testFour") {
        if (student.testFourStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testFourStartRecord > 0) {
          time = student.testFourStartRecord;
        }
      }
      return time;
    };

    $scope.endTime = function(student, testNo) {

      if (testNo == "testOne") {
        if (student.testOneStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testOneStartRecord > 0) {
          time = student.testOneTime + student.testOneStartRecord;
        }
      } else if (testNo == "testTwo") {
        if (student.testTwoStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testTwoStartRecord > 0) {
          time = student.testTwoTime + student.testTwoStartRecord;
        }
      } else if (testNo == "testThree") {
        if (student.testThreeStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testThreeStartRecord > 0) {
          time = student.testThreeTime + student.testThreeStartRecord;
        }
      } else if (testNo == "testFour") {
        if (student.testFourStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testFourStartRecord > 0) {
          time = student.testFourTime + student.testFourStartRecord;
        }
      } else if (testNo == "exttestOne") {
        if (student.testOneStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testOneStartRecord > 0) {
          time = (student.testOneTime * student.extendTime) + student.testOneStartRecord;
        }
      } else if (testNo == "exttestTwo") {
        if (student.testTwoStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testTwoStartRecord > 0) {
          time = (student.testTwoTime * student.extendTime) + student.testTwoStartRecord;
        }
      } else if (testNo == "exttestThree") {
        if (student.testThreeStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testThreeStartRecord > 0) {
          time = (student.testThreeTime * student.extendTime) + student.testThreeStartRecord;
        }
      } else if (testNo == "exttestFour") {
        if (student.testFourStartRecord == 0) {
          time = "00:00:00";
        } else if (student.testFourStartRecord > 0) {
          time = (student.testFourTime * student.extendTime) + student.testFourStartRecord;
        }
      }
      return time;
    };

    $scope.totalPausedTime = function(student, testNo) {
      if (testNo == "testOne") {
        if (student.pausedTotalOne <= 0) {
          time = "00:00:00";
        } else if (student.pausedTotalOne > 0) {
          time = StudentCrud.parseTime(student.pausedTotalOne);
        }
      } else if (testNo == "testTwo") {
        if (student.pausedTotalTwo <= 0) {
          time = "00:00:00";
        } else if (student.pausedTotalTwo > 0) {
          time = StudentCrud.parseTime(student.pausedTotalTwo);
        }
      } else if (testNo == "testThree") {
        if (student.pausedTotalThree <= 0) {
          time = "00:00:00";
        } else if (student.pausedTotalThree > 0) {
          time = StudentCrud.parseTime(student.pausedTotalThree);
        }
      } else if (testNo == "testFour") {
        if (student.pausedTotalFour <= 0) {
          time = "00:00:00";
        } else if (student.pausedTotalFour > 0) {
          time = StudentCrud.parseTime(student.pausedTotalFour);
        }
      }
      return time;
    };

    $scope.testTime = function(student, testNo) {

      if (testNo == "testOne") {
        unprocessedTime = student.testOneTime;
      } else if (testNo == "testTwo") {
        unprocessedTime = student.testTwoTime;
      } else if (testNo == "testThree") {
        unprocessedTime = student.testThreeTime;
      } else if (testNo == "testFour") {
        unprocessedTime = student.testFourTime;
      } else if (testNo == "testOneExt") {
        unprocessedTime = (student.testOneTime * student.extendTime) - student.testOneTime;
      } else if (testNo == "testTwoExt") {
        unprocessedTime = (student.testTwoTime * student.extendTime) - student.testTwoTime;
      } else if (testNo == "testThreeExt") {
        unprocessedTime = (student.testThreeTime * student.extendTime) - student.testThreeTime;
      } else if (testNo == "testFourExt") {
        unprocessedTime = (student.testFourTime * student.extendTime) - student.testFourTime;
      } else if (testNo == "testOneExtBar") {
        unprocessedTime = (student.testOneTime * student.extendTime) - student.testOneTime;
        return unprocessedTime;
      } else if (testNo == "testTwoExtBar") {
        unprocessedTime = (student.testTwoTime * student.extendTime) - student.testTwoTime;
        return unprocessedTime;
      } else if (testNo == "testThreeExtBar") {
        unprocessedTime = (student.testThreeTime * student.extendTime) - student.testThreeTime;
        return unprocessedTime;
      } else if (testNo == "testFourExtBar") {
        unprocessedTime = (student.testFourTime * student.extendTime) - student.testFourTime;
        return unprocessedTime;
      } else if (testNo == "testOnetotal") {
        unprocessedTime = student.testOneTime * student.extendTime;
      } else if (testNo == "testTwototal") {
        unprocessedTime = student.testTwoTime * student.extendTime;
      } else if (testNo == "testThreetotal") {
        unprocessedTime = student.testThreeTime * student.extendTime;
      } else if (testNo == "testFourtotal") {
        unprocessedTime = student.testFourTime * student.extendTime;
      }

      time = processTime(unprocessedTime, 19);

      return time;
    };

// Begin test properties

    $scope.newDueDateOne = new Date(new Date().setHours(0,0,0));
    $scope.newDueDateTwo = new Date(new Date().setHours(0,0,0));
    $scope.newDueDateThree = new Date(new Date().setHours(0,0,0));
    $scope.newDueDateFour = new Date(new Date().setHours(0,0,0));
    // $scope.newtestName = " ";


    $scope.timewrap = {};

    $scope.times = [1, 1.5, 2, 2.5, 3];

    $scope.isFormOneComplete = false;
    $scope.isFormTwoComplete = false;
    $scope.isFormThreeComplete = false;
    $scope.isFormFourComplete = false;

    // $scope.newDueDate = new Date(new Date().setHours(1,0,0));

// End test properties

// Begin CRUD Functions

    $scope.addStudent = function() {
      if ($scope.newStudentName && $scope.timewrap.selectedTime) {
        StudentCrud.addStudent($scope.newStudentName, $scope.timewrap.selectedTime, $scope.newtestOneName, $scope.newDueDateOne, $scope.newtestTwoName, $scope.newDueDateTwo, $scope.newtestThreeName, $scope.newDueDateThree, $scope.newtestFourName, $scope.newDueDateFour);
        var owner = "addStudent at " + Date.now();
        toggleInvert(owner);
      } else {
        $scope.alert = true;
        $timeout(function turnOffAlert() {$scope.alert = false}, 3000);
      }

    };

    $scope.scopeTestTime = function(testTime) {
      $scope.newTestTime = testTime;
    };

    $scope.processTimeInput = function(student, testNo) {
      StudentCrud.processTimeInput(student, $scope.newTestTime, testNo);
    };

    $scope.deleteTest = function(student, testNo) {
      StudentCrud.deleteTest(student, student.testOneName, student.testOneTime, testNo);
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
