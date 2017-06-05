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
            console.log("hit");
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
      }

      return {
        countdown: countdown,
        top: topBarWidth,
        bottom: bottomBarWidth,
        topBarDividend: topBarDividend,
        bottomBarDividend: bottomBarDividend
      }
    };


    // $scope.barWidth = function(student, testNo) {
    //
    //   extendTime = student.extendTime;
    //   topBarDividend = 0,
    //   bottomBarDividend = 0,
    //   topBarRatio = 0,
    //   bottomBarRatio = 0
    //
    //   if (testNo == "testOne") {
    //
    //     testStartTime = student.testOneStartTime;
    //     totalTime = student.totalTimeOne;
    //     testTime = student.testOneTime;
    //     extension = (testTime * extendTime) - testTime;
    //     actualTestTime = totalTime - extension;
    //
    //     if (actualTestTime > 0) {
    //       actualExtension = totalTime - actualTestTime;
    //     } else if (actualTestTime <= 0) {
    //       actualExtension = totalTime;
    //     }
    //     // ratios for bar widths
    //     bottomBarRatio = extension / (testTime * extendTime);
    //     topBarRatio = 1 - bottomBarRatio;
    //
    //     // in case timer has not started yet (test 1) OR: timer has ended
    //     if ((student.testOneStartTime == 0 && !student.isTestOneOver && !student.isTimerOnePaused) || student.isTestOneOver) {
    //       console.log("test 1: timer has not yet started OR timer has ended");
    //       topBarWidth = 100 * topBarRatio;
    //       bottomBarWidth = 100 * bottomBarRatio;
    //       // timer 1 runs out to zero
    //     } else if (student.totalTimeOne + student.testOneStartTime - Date.now() <= 0 && !student.isTimerOnePaused && !student.isTestOneOver) {
    //       console.log("test 1: timer has run out");
    //       topBarWidth = 0;
    //       bottomBarWidth = 0;
    //     // timer is counting down (test 1)
    //     } else if (!student.isTimerOnePaused && !student.isTestOneOver) {
    //       topBarDividend = testStartTime + actualTestTime - $scope.time;
    //
    //       if (topBarDividend > 0) {
    //         // topBarWidth = topBarDividend / actualTestTime * 100 * topBarRatio;
    //         topBarWidth = topBarDividend / testTime * 100 * topBarRatio;
    //         bottomBarDividend = extension;
    //       } else if (topBarDividend <= 0) {
    //         topBarWidth = 0;
    //         bottomBarDividend = testStartTime + actualExtension - $scope.time;
    //       }
    //       // ultimate outputs
    //       bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
    //       // console.log("test 1: timer is counting down");
    //       // console.log("topBarWidth: " + topBarWidth);
    //     // timer is paused (test 1)
    //   } else if (!student.isTestOneOver && student.isTimerOnePaused) {
    //       if (actualTestTime > 0) {
    //         topBarWidth = actualTestTime / testTime * 100 * topBarRatio;
    //         bottomBarDividend = extension;
    //
    //       } else if (actualTestTime <= 0) {
    //         topBarWidth = 0;
    //         bottomBarDividend = actualExtension;
    //
    //       }
    //       bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
    //       console.log("test 1: timer is paused");
    //     }
    //
    //   } else if (testNo == "testTwo") {
    //
    //     testStartTime = student.testTwoStartTime;
    //     totalTime = student.totalTimeTwo;
    //     testTime = student.testTwoTime;
    //     extension = (testTime * extendTime) - testTime;
    //
    //     actualTestTime = totalTime - extension;
    //
    //     if (actualTestTime > 0) {
    //       actualExtension = totalTime - actualTestTime;
    //     } else if (actualTestTime <= 0) {
    //       actualExtension = totalTime;
    //     }
    //     // ratios for bar widths
    //     bottomBarRatio = extension / (testTime * extendTime);
    //     topBarRatio = 1 - bottomBarRatio;
    //
    //     // in case timer has not started yet (test 1) OR: timer has ended
    //     if ((student.testTwoStartTime == 0 && !student.isTestTwoOver && !student.isTimerTwoPaused) || student.isTestTwoOver) {
    //       topBarWidth = 100 * topBarRatio;
    //       bottomBarWidth = 100 * bottomBarRatio;
    //       // timer 1 runs out to zero
    //     } else if (student.totalTimeTwo + student.testTwoStartTime - Date.now() <= 0 && !student.isTimerTwoPaused && !student.isTestTwoOver) {
    //       console.log("timer ran out")
    //
    //       topBarWidth = 0;
    //       bottomBarWidth = 0;
    //     // timer is counting down (test 2)
    //   } else if (!student.isTimerTwoPaused && !student.isTestTwoOver) {
    //       topBarDividend = testStartTime + actualTestTime - $scope.time;
    //
    //       if (topBarDividend > 0) {
    //         // topBarWidth = topBarDividend / actualTestTime * 100 * topBarRatio;
    //         topBarWidth = topBarDividend / testTime * 100 * topBarRatio;
    //         bottomBarDividend = extension;
    //       } else if (topBarDividend <= 0) {
    //         topBarWidth = 0;
    //         bottomBarDividend = testStartTime + actualExtension - $scope.time;
    //       }
    //       // ultimate outputs
    //       bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
    //     // timer is paused (test 1)
    //   } else if (!student.isTestTwoOver && student.isTimerTwoPaused) {
    //       if (actualTestTime > 0) {
    //         topBarWidth = actualTestTime / testTime * 100 * topBarRatio;
    //         bottomBarDividend = extension;
    //
    //       } else if (actualTestTime <= 0) {
    //         topBarWidth = 0;
    //         bottomBarDividend = actualExtension;
    //
    //       }
    //       bottomBarWidth = bottomBarDividend / extension * 100 * bottomBarRatio;
    //     }
    //   }
    //
    //   return {
    //     top: topBarWidth,
    //     bottom: bottomBarWidth
    //   }
    // };

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
      }
      // students.$save(student).then(function() {
      //   $scope.timer(student, testNo);
      // });

      students.$save(student).then(function() {
        $interval.cancel(promise);
      });


      $scope.$on('$destroy', function() {
        $interval.cancel(promise);
      });

      $scope.timer(student, testNo);

      // console.log("promise: " + promise);
    };

    $scope.resumeTimer = function(student, testNo) {
      if (testNo == "testOne") {
        student.isTimerOnePaused = false;
        student.pausedTotalOne += Date.now() - student.pausedTimeOne;
      } else if (testNo == "testTwo") {
        student.isTimerTwoPaused = false;
        student.pausedTotalTwo += Date.now() - student.pausedTimeTwo;
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
      }

      // console.log("resumeTimer called");
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
        // student.totalTimeOne = (student.testOneStartTime + student.totalTimeOne) - Date.now();
        // student.testOneStartTime = 0;
        student.isTestOneOver = true;
        timeEnded = Date.now();
      } else if (testNo == "testTwo") {
        // student.totalTimeTwo = (student.testTwoStartTime + student.totalTimeTwo) - Date.now();
        // student.testTwoStartTime = 0;
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
          time = "-- : -- : --";
        } else if (student.testOneStartRecord > 0) {
          time = student.testOneStartRecord;
        }
      } else if (testNo == "testTwo") {
        if (student.testTwoStartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.testTwoStartRecord > 0) {
          time = student.testTwoStartRecord;
        }
      }
      return time;
    };

    $scope.endTime = function(student, testNo) {

      if (testNo == "testOne") {
        if (student.testOneStartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.testOneStartRecord > 0) {
          time = student.testOneTime + student.testOneStartRecord;
        }
      } else if (testNo == "testTwo") {
        if (student.testTwoStartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.testTwoStartRecord > 0) {
          time = student.testTwoTime + student.testTwoStartRecord;
        }
      } else if (testNo == "exttestOne") {
        if (student.testOneStartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.testOneStartRecord > 0) {
          time = (student.testOneTime * student.extendTime) + student.testOneStartRecord;
        }
      } else if (testNo == "exttestTwo") {
        if (student.testTwoStartRecord == 0) {
          time = "-- : -- : --";
        } else if (student.testTwoStartRecord > 0) {
          time = (student.testTwoTime * student.extendTime) + student.testTwoStartRecord;
        }
      }
      return time;
    };

    $scope.totalPausedTime = function(student, testNo) {
      if (testNo == "testOne") {
        if (student.pausedTotalOne <= 0) {
          time = "-- : -- : --";
        } else if (student.pausedTotalOne > 0) {
          time = StudentCrud.parseTime(student.pausedTotalOne);
        }
      } else if (testNo == "testTwo") {
        if (student.pausedTotalTwo <= 0) {
          time = "-- : -- : --";
        } else if (student.pausedTotalTwo > 0) {
          time = StudentCrud.parseTime(student.pausedTotalTwo);
        }
      }
      return time;
    }

    // var processTime = function(unprocessedTime, hourOption) {
    //   unprocessedTimeObj = new Date(unprocessedTime);
    //   unprocessedHour = unprocessedTimeObj.getHours();
    //   processedHour = unprocessedHour - hourOption;
    //   var processedTime = unprocessedTimeObj.setHours(processedHour);
    //   return processedTime;
    // };

    $scope.testTime = function(student, testNo) {

      if (testNo == "testOne") {
        unprocessedTime = student.testOneTime;
      } else if (testNo == "testTwo") {
        unprocessedTime = student.testTwoTime;
      } else if (testNo == "testOneExt") {
        unprocessedTime = (student.testOneTime * student.extendTime) - student.testOneTime;
      } else if (testNo == "testTwoExt") {
        unprocessedTime = (student.testTwoTime * student.extendTime) - student.testTwoTime;
      } else if (testNo == "testOneExtBar") {
        unprocessedTime = (student.testOneTime * student.extendTime) - student.testOneTime;
        return unprocessedTime;
      } else if (testNo == "testTwoExtBar") {
        unprocessedTime = (student.testTwoTime * student.extendTime) - student.testTwoTime;
        return unprocessedTime;
      } else if (testNo == "testOnetotal") {
        unprocessedTime = student.testOneTime * student.extendTime;
      } else if (testNo == "testTwototal") {
        unprocessedTime = student.testTwoTime * student.extendTime;
      }

      time = processTime(unprocessedTime, 19);

      return time;
    };

// progress bar data

    $scope.bottomBarRatio = function(student, test) {
      if (test == "testOne") {
        testTime = student.testOneTime;
        totalTime = testTime * student.extendTime;
        extension = totalTime - testTime;
        bottomBarRatio = extension / totalTime;
      } else if (test == "testTwo") {
        testTime = student.testTwoTime;
        totalTime = testTime * student.extendTime;
        extension = totalTime - testTime;
        bottomBarRatio = extension / totalTime;
      }
      return bottomBarRatio;
    };

    $scope.topBarWidth = function(student, test) {

      extendTime = student.extendTime;
      topBarRatio = 1 - $scope.bottomBarRatio(student, test);

      if (test == "testOne") {
        testTime = student.testOneTime;
        extension = (testTime * extendTime) - testTime;
        actualTestTime = student.totalTimeOne - extension;
        dividend = student.testOneStartTime + actualTestTime - $scope.time;
        topBarWidth = dividend / actualTestTime * 100 * topBarRatio;
        console.log("topBarWidth = " + topBarWidth);
        console.log("topBarRatio = " + topBarRatio);
      } else if (test == "testTwo") {
        testTime = student.testTwoTime;
        extension = (testTime * extendTime) - testTime;
        actualTestTime = student.totalTimeTwo - extension;
        dividend = student.testTwoStartTime + actualTestTime - $scope.time;
        topBarWidth = dividend / actualTestTime * 100 * topBarRatio;
      }

      return topBarWidth;
    };

    $scope.bottomBarWidth = function(student, test) {

      extendTime = student.extendTime;
      bottomBarRatio = $scope.bottomBarRatio(student, test);

      if ($scope.topBarWidth(student, 'testOne') == 0) {
        testTime = student.testOneTime;
        extension = (testTime * extendTime) - testTime;
        dividend = student.testOneStartTime + extension - $scope.time
        bottomBarWidth = dividend / extension * 100 * bottomBarRatio;
      } else if ($scope.topBarWidth(student, 'testTwo') == 0) {
        testTime = student.testTwoTime;
        extension = (testTime * extendTime) - testTime;
        dividend = student.testTwoStartTime + extension - $scope.time
        bottomBarWidth = dividend / extension * 100 * bottomBarRatio;
      } else {
        bottomBarWidth = 100 * bottomBarRatio;
      }
        console.log("bottomBarWidth = " + bottomBarWidth);
        console.log("bottomBarRatio = " + bottomBarRatio);
        return bottomBarWidth;
    };

// Begin AngularStrap popover

    $scope.dateTip = {
      "title": "enter testing extension accomodation",
      "checked": false
    };

// Begin ExtendTime

    $scope.newDueDateOne = new Date(new Date().setHours(1,0,0));
    $scope.newDueDateTwo = new Date(new Date().setHours(1,0,0));
    $scope.newDueDateThree = new Date(new Date().setHours(1,0,0));
    $scope.newDueDateFour = new Date(new Date().setHours(1,0,0));


    $scope.timewrap = {};

    $scope.times = [1, 1.5, 2, 2.5, 3];

// End ExtendTime

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
