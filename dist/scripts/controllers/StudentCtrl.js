TestTrakker.controller('StudentCtrl', ["$scope", "StudentCrud", "$rootScope", "$interval", '$timeout', "$q", "$sce", "$tooltip", "$popover", "FirebaseRef", "$firebaseArray", "$state",
  function($scope, StudentCrud, $rootScope, $interval, $timeout, $q, $sce, $tooltip, $popover, FirebaseRef, $firebaseArray, $state) {

// BEGIN Current User and Current User Students Variables and Functions

  var auth = firebase.auth();

  auth.onAuthStateChanged(user => {
    if (user) {
      var currentUser = auth.currentUser;
      console.log("currentUser in onAuthStateChanged = ", currentUser);
      var uid = currentUser.uid
      // const studentsRef = firebase.database().ref('users/' + uid).child("students");
      const studentsRef = firebase.database().ref('users/' + uid).child("students");
      $scope.students = $firebaseArray(studentsRef);
      $scope.currentUser = user;
    } else {
      console.log("AuthStateChange failed");
      $state.go('landing');
    }
    $scope.teacherName = getTeacherName($scope.currentUser.displayName);
  });

  var getTeacherName = function(string) {
    var string = string.trim();
    var spaceIndex = string.indexOf(string.match(/\s/));
    var lastName = string.slice(spaceIndex + 1, string.length);
    return lastName;
  }


// END Current User and Current User Students Variables and Functions

// BEGIN Student CRUD Variables and Functions

    $scope.newDueDateOne = new Date(new Date().setHours(0,0,0));
    $scope.newDueDateTwo = new Date(new Date().setHours(0,0,0));
    $scope.newDueDateThree = new Date(new Date().setHours(0,0,0));
    $scope.newDueDateFour = new Date(new Date().setHours(0,0,0));

    $scope.timewrap = {};

    $scope.times = [1, 1.5, 2, 2.5, 3];

    $scope.addStudent = function() {
      if ($scope.newStudentName && $scope.timewrap.selectedTime) {
        StudentCrud.addStudent($scope.newStudentName, $scope.timewrap.selectedTime, $scope.newtestOneName, $scope.newDueDateOne, $scope.newtestTwoName, $scope.newDueDateTwo, $scope.newtestThreeName, $scope.newDueDateThree, $scope.newtestFourName, $scope.newDueDateFour);
        // FirebaseRef.addUser();
        toggleInvert();
      } else {
        $scope.alert = true;
        $timeout(function turnOffAlert() {$scope.alert = false}, 5000);
      }

    };

    // $scope.delete = function(student, owner) {
    //   $scope.selectAll = true;
    //   $scope.clickedToDelete = false;
    //   $scope.deleteAppear = false;
    //
    //   if(owner === "deleteSelected" || owner === "deleteAllStudents") {
    //     $scope.students.$remove(student).then(function() {
    //       console.log("student, which is now " + student + ", has been removed");
    //     });
    //   } else {
    //     auth.onAuthStateChanged(user => {
    //       if (user) {
    //         $scope.students.$remove(student).then(function() {
    //           console.log("student, which is now " + student + ", has been removed");
    //         });
    //       } else {
    //         console.log("delete failed");
    //       }
    //     });
    //   }
    // };
    //
    // $scope.deleteSelected = function() {
    //   var owner = "deleteSelected"
    //   $scope.clearSelected = false;
    //   $scope.deleteAppear = false;
    //   $timeout(function appear() {$scope.selectAll = true}, 1000);
    //   $timeout(function appear() {$scope.clickedToDelete = false}, 1000);
    //
    //   auth.onAuthStateChanged(user => {
    //     if (user) {
    //       for (var i = 0; i < $scope.students.length; i++) {
    //         if ($scope.students[i].isSafeToDelete) {
    //           $scope.delete($scope.students[i], owner);
    //         }
    //       }
    //     } else {
    //       console.log("delete failed");
    //     }
    //   });
    // };
    //
    // var deleteAllStudents = function() {
    //   var owner = "deleteAllStudents"
    //   $scope.warn = false;
    //
    //   auth.onAuthStateChanged(user => {
    //     if (user) {
    //       for (i = 0; i < $scope.students.length; i++) {
    //         $scope.delete($scope.students[i], owner);
    //       }
    //     } else {
    //       console.log("delete failed");
    //     }
    //   });
    // };

    $scope.delete = function(student) {
      $scope.selectAll = true;
      $scope.clickedToDelete = false;
      $scope.deleteAppear = false;

      $scope.students.$remove(student).then(function() {
        console.log("student, which is now " + student + ", has been removed");
      });
      // $scope.students.$destroy(student).then(function() {
      //   console.log("student, which is now " + student + ", has been removed");
      // });
    };

    $scope.deleteSelected = function() {

      $scope.clearSelected = false;
      $scope.deleteAppear = false;
      $timeout(function appear() {$scope.selectAll = true}, 1000);
      $timeout(function appear() {$scope.clickedToDelete = false}, 1000);

      for (var i = 0; i < $scope.students.length; i++)
        if ($scope.students[i].isSafeToDelete) {
          $scope.delete($scope.students[i]);
        }
    };

    var deleteAllStudents = function() {
      $scope.warn = false;
      for (i = 0; i < $scope.students.length; i++) {
        $scope.delete($scope.students[i]);
      }
    };

    $scope.warnClose = function() {
      $scope.warn = true;
    }

    $scope.logout = function() {
      FirebaseRef.closeSession();
    };

// END Student CRUD Variables and Functions

// BEGIN TEST CRUD Variables and Functions

    $scope.scopeTestTime = function(testTime) {
      $scope.newTestTime = testTime;
    };

    var addHoursAndMinutes = function(hours, minutes) {
      var timeInMillisecs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
      return timeInMillisecs;
    };

    $scope.processTimeInput = function(student, testNo) {

      console.log("$scope.newTestTime = " + $scope.newTestTime);
      if (testNo == "testOne") {
        testOneTimeNum = addHoursAndMinutes($scope.newTestTime.getHours(), $scope.newTestTime.getMinutes());
        student.testOneTime = testOneTimeNum;
        student.totalTimeOne = testOneTimeNum * student.extendTime;
      } else if (testNo == "testTwo") {
        testTwoTimeNum = addHoursAndMinutes($scope.newTestTime.getHours(), $scope.newTestTime.getMinutes());
        student.testTwoTime = testTwoTimeNum;
        student.totalTimeTwo = testTwoTimeNum * student.extendTime;
      } else if (testNo == "testThree") {
        testThreeTimeNum = addHoursAndMinutes($scope.newTestTime.getHours(), $scope.newTestTime.getMinutes());
        student.testThreeTime = testThreeTimeNum;
        student.totalTimeThree = testThreeTimeNum * student.extendTime;
      } else if (testNo == "testFour") {
        testFourTimeNum = addHoursAndMinutes($scope.newTestTime.getHours(), $scope.newTestTime.getMinutes());
        student.testFourTime = testFourTimeNum;
        student.totalTimeFour = testFourTimeNum * student.extendTime;
      }
      $scope.students.$save(student);
    };



// END TEST CRUD Variables and Functions

// BEGIN Student Test TIMER Variables and Functions

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

      $scope.students.$save(student).then(function() {
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

    $scope.waitOption = 1800000;

    $scope.warn = false;

    if (!timeoutStarted) {
      $timeout(function dbTimeout(){$scope.warn = true}, $scope.waitOption);
      $timeout(function dbTimeErase(){$scope.logout()}, ($scope.waitOption + 1800000));
      var timeoutStarted = true;
    }

    $scope.warningRejection = function() {
      $scope.warn = false;
      $scope.waitOption += 1800000;
      var timeoutStarted = false;
    }

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
        } else if (totalTime + testStartTime - Date.now() <= 0 && !student.isTimerOnePaused && !student.isTestOneOver) {
          topBarWidth = 0;
          bottomBarWidth = 0;
          countdown = 18000000;
          student.isTestOneOver = true;
          student.isTimerOnePaused = false;

          $scope.students.$save(student).then(function() {
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
        } else if (totalTime + testStartTime - Date.now() <= 0 && !student.isTimerTwoPaused && !student.isTestTwoOver) {
          topBarWidth = 0;
          bottomBarWidth = 0;

          countdown = 18000000;
          student.isTestTwoOver = true;
          student.isTimerTwoPaused = false;

          $scope.students.$save(student).then(function() {
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
        } else if (totalTime + testStartTime - Date.now() <= 0 && !student.isTimerThreePaused && !student.isTestThreeOver) {
          topBarWidth = 0;
          bottomBarWidth = 0;

          countdown = 18000000;
          student.isTestThreeOver = true;
          student.isTimerThreePaused = false;

          $scope.students.$save(student).then(function() {
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
        } else if (totalTime + testStartTime - Date.now() <= 0 && !student.isTimerFourPaused && !student.isTestFourOver) {
          topBarWidth = 0;
          bottomBarWidth = 0;

          countdown = 18000000;
          student.isTestFourOver = true;
          student.isTimerFourPaused = false;


          $scope.students.$save(student).then(function() {
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

      $scope.students.$save(student).then(function() {
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

      $scope.students.$save(student).then(function() {
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

      $scope.students.$save(student).then(function() {
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
        student.testOneEndedAt = Date.now();
      } else if (testNo == "testTwo") {
        student.isTestTwoOver = true;
        student.testTwoEndedAt = Date.now();
      } else if (testNo == "testThree") {
        student.isTestThreeOver = true;
        student.testThreeEndedAt = Date.now();
      } else if (testNo == "testFour") {
        student.isTestFourOver = true;
        student.testFourEndedAt = Date.now();
      }

      console.log("endTimer called");
      $scope.students.$save(student).then(function() {
        $interval.cancel(promise);
      });

      $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $interval.cancel(promise);
      });
    };

    $scope.startSelectedTests = function(students) {
      for (i = 0; i < students.length; i++) {
        if (students[i].isSafeToDelete) {
          if (!students[i].isTimerOneStart && !students[i].isTestOneOver) {
            $scope.startTimer(students[i], 'testOne')
          } else if (!students[i].isTimerTwoStart && !students[i].isTestTwoOver) {
            $scope.startTimer(students[i], 'testTwo')
          } else if (!students[i].isTimerThreeStart && !students[i].isTestThreeOver) {
            $scope.startTimer(students[i], 'testThree')
          } else if (!students[i].isTimerFourStart && !students[i].isTestFourOver) {
            $scope.startTimer(students[i], 'testFour')
          } else {
          $scope.info = true;
          $timeout(function turnOffAlert() {$scope.info = false}, 5000);
          }
        }
      }
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
      } else if (testNo == "actualEndOne") {
        if (student.testOneEndedAt == 0) {
          time = "00:00:00";
        } else if (student.testOneStartRecord > 0) {
          time = student.testOneEndedAt;
        }
      } else if (testNo == "actualEndTwo") {
        if (student.testTwoEndedAt == 0) {
          time = "00:00:00";
        } else if (student.testTwoStartRecord > 0) {
          time = student.testTwoEndedAt;
        }
      } else if (testNo == "actualEndThree") {
        if (student.testThreeEndedAt == 0) {
          time = "00:00:00";
        } else if (student.testThreeStartRecord > 0) {
          time = student.testThreeEndedAt;
        }
      } else if (testNo == "actualEndFour") {
        if (student.testFourEndedAt == 0) {
          time = "00:00:00";
        } else if (student.testFourStartRecord > 0) {
          time = student.testFourEndedAt;
        }
      }
      return time;
    };

    $scope.totalPausedTime = function(student, testNo) {
      if (testNo == "testOne") {
        if (student.pausedTotalOne == 0) {
          time = "00:00:00";
        } else if (student.pausedTotalOne > 0) {
          time = StudentCrud.parseTime(student.pausedTotalOne);
        }
      } else if (testNo == "testTwo") {
        if (student.pausedTotalTwo == 0) {
          time = "00:00:00";
        } else if (student.pausedTotalTwo > 0) {
          time = StudentCrud.parseTime(student.pausedTotalTwo);
        }
      } else if (testNo == "testThree") {
        if (student.pausedTotalThree == 0) {
          time = "00:00:00";
        } else if (student.pausedTotalThree > 0) {
          time = StudentCrud.parseTime(student.pausedTotalThree);
        }
      } else if (testNo == "testFour") {
        if (student.pausedTotalFour == 0) {
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

// END Student Test TIMER Variables and Functions

// BEGIN UI MANIPULATION VARIABLES AND FUNCTIONS

    $scope.invertSelect = false;
    $scope.selectAll = true;

    $scope.saveAndToggleInvert = function(student) {
      $scope.students.$save(student);
      toggleInvert();
    };

    var toggleInvert = function() {
      var unsafeCount = 0;
      var safeCount = 0;

      for (i = 0; i < $scope.students.length; i++) {
        if ($scope.students[i] && $scope.students[i].isSafeToDelete) {
          safeCount++;
        } else if ($scope.students[i] && !$scope.students[i].isSafeToDelete) {
          unsafeCount++;
        }
      }

      $scope.clickedToDelete = false;

      if (safeCount > 0) {
        $scope.clickedToDelete = true;
        $timeout(function appear() {$scope.deleteAppear = true}, 1000);
      } else {
        $scope.deleteAppear = false;
        $timeout(function appear() {$scope.clickedToDelete = false}, 1000);
      }

      console.log("clickedToDelete: " + $scope.clickedToDelete);

      if (safeCount > 0 && unsafeCount > 1) {
        $scope.invertSelect = true;
        $scope.selectAll = false;
        console.log("safeCount: " + safeCount);
        console.log("invertSelect is true; selectAll is false");
      } else if (safeCount > 0 && safeCount == $scope.students.length) {
        $scope.invertSelect = false;
        $scope.selectAll = false;
        $scope.clearSelected = true;
        $scope.clickedToDelete = true;
        console.log("invertSelect is false; selectAll is true");
      } else if (safeCount == 0) {
        $scope.invertSelect = false;
        $scope.selectAll = true;
        $scope.clickedToDelete = false;
        console.log("invertSelect is false; selectAll is true");
      }
    }

    $scope.toggleSelectForDelete = function(students) {
      for (var i = 0; i < students.length; i++) {
        if (!students[i].isSafeToDelete) {
          students[i].isSafeToDelete = true;
        } else if (students[i].isSafeToDelete) {
          students[i].isSafeToDelete = false;
        }
        $scope.students.$save(students[i]);
      }
    }

    $scope.switchControl = function(students) {
      if ($scope.selectAll && !$scope.invertSelect) {

        $scope.toggleSelectForDelete(students);
        $scope.selectAll = false;
        $scope.invertSelect = false;
        $scope.clickedToDelete = true;
        $timeout(function appear() {$scope.clearSelected = true}, 1000);
        $timeout(function appear() {$scope.deleteAppear = true}, 1000);

      } else if ($scope.clearSelected) {

        $scope.toggleSelectForDelete(students);
        $scope.clearSelected = false;
        $scope.deleteAppear = false;
        $timeout(function appear() {$scope.selectAll = true}, 1000);
        $timeout(function appear() {$scope.clickedToDelete = false}, 1000);

      } else if ($scope.invertSelect) {
        $scope.toggleSelectForDelete(students);
      }
    };

// END UI MANIPULATION VARIABLES AND FUNCTIONS

  }
]);
