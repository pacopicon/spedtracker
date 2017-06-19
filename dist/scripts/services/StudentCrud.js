spedtracker.factory("StudentCrud", ["$firebaseArray", "FirebaseRef", "UserCrud",
  function($firebaseArray, FirebaseRef, UserCrud) {

// Public variables below
    // holds data as array of objects.  Each object is one item.
    // var studentsRef = FirebaseRef.getStudentsRef();
    // var students = FirebaseRef.getStudents();
    var auth = FirebaseRef.getAuth();
    var users = UserCrud.getAllUsers();

    var now = new Date();
    var nowNum = now.getTime();
    var week = 604800000;

    var addHoursAndMinutes = function(hours, minutes) {
      var timeInMillisecs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
      return timeInMillisecs;
    };

// Public functions below.

// -- FUNCTIONS CALLED BY CONTROLLER --
    return {
      // The function below and the one underneath, 'parseTime' are both called by '$scope.parseTime' in StudentCtrl to display detailed estimated time to completion info for item in DOM

      parseTime: function(timeInMillisecs) {
        // 'time' has to be in milliseconds
        // var millisecsInYear = 12 * 30.4166 * 24 * 60 * 60 * 1000;
        var millisecsInYear = 31535930880;
        // var millisecsInMonth = 30.4166 * 24 * 60 * 60 * 1000;
        var millisecsInMonth = 2627994239.9999995;
        // var millisecsInDay = 24 * 60 * 60 * 1000;
        var millisecsInDay = 86400000;
        // var millisecsInHour = 60 * 60 * 1000;
        var millisecsInHour = 3600000;
        // var millisecsInMinute = 60 * 1000;
        var millisecsInMinute = 60000;
        var millisecsInSecs = 1000;

        if (timeInMillisecs < 0) {
          var years = Math.abs(timeInMillisecs / millisecsInYear);
          var lessThanYear = Math.abs(timeInMillisecs % millisecsInYear);
          var months = Math.abs(lessThanYear / millisecsInMonth);
          var lessThanMonth = Math.abs(lessThanYear % millisecsInMonth);
          var days = Math.abs(lessThanMonth / millisecsInDay);
          var lessThanDay = Math.abs(lessThanMonth % millisecsInDay);
          var hours = Math.abs(lessThanDay / millisecsInHour);
          var lessThanHour = Math.abs(lessThanDay % millisecsInHour);
          var minutes = Math.abs(lessThanHour / millisecsInMinute);
          var lessThanMinute = Math.abs(lessThanHour % millisecsInMinute);
          var seconds = Math.abs(Math.round(lessThanMinute / millisecsInSecs));
        } else {
          var years = Math.floor(timeInMillisecs / millisecsInYear);
          var lessThanYear = timeInMillisecs % millisecsInYear;
          var months = Math.floor(lessThanYear / millisecsInMonth);
          var lessThanMonth = lessThanYear % millisecsInMonth;
          var days = Math.floor(lessThanMonth / millisecsInDay);
          var lessThanDay = lessThanMonth % millisecsInDay;
          var hours = Math.floor(lessThanDay / millisecsInHour);
          var lessThanHour = lessThanDay % millisecsInHour;
          var minutes = Math.floor(lessThanHour / millisecsInMinute);
          var lessThanMinute = lessThanHour % millisecsInMinute;
          var seconds = Math.round(lessThanMinute / millisecsInSecs);

          var addZero = function(timeUnit) {
            if (timeUnit == 0 || timeUnit == 1 || timeUnit == 2 || timeUnit == 3 || timeUnit == 4 || timeUnit == 5 || timeUnit == 6 || timeUnit == 7 || timeUnit == 8 || timeUnit == 9) {
              return "0" + timeUnit;
            // } else if (timeUnit == 60) {
            //   return "00";
            } else {
              return timeUnit;
            }
          };

          // var addZero = function(timeUnit) {
          //
          //   timeUnit = timeUnit - 1;
          //
          //   if (timeUnit == 0 || timeUnit == 1 || timeUnit == 2 || timeUnit == 3 || timeUnit == 4 || timeUnit == 5 || timeUnit == 6 || timeUnit == 7 || timeUnit == 8 || timeUnit == 9) {
          //     return "0" + timeUnit;
          //   } else {
          //     return timeUnit;
          //   }
          // };
        }

        return {
          total: timeInMillisecs,
          year: years,
          month: months,
          day: days,
          hour: hours,
          minute: addZero(minutes),
          second: addZero(seconds),
          hourMinSec: hours + ":" + addZero(minutes) + ":" + addZero(seconds)
        };
      },
// This function is called by the submit button in testTracker.html when user creates an item in the form
      addStudent: function(studentName, extendTime, testOneName, testOneTimeObj, testTwoName, testTwoTimeObj, testThreeName, testThreeTimeObj, testFourName, testFourTimeObj) {

        if (typeof testOneName === "undefined") {
          testOneName = '';
        }
        if (typeof testTwoName === "undefined") {
          testTwoName = '';
        }
        if (typeof testThreeName === "undefined") {
          testThreeName = '';
        }
        if (typeof testFourName === "undefined") {
          testFourName = '';
        }

        if (typeof testOneTimeObj === "undefined") {
          testOneTimeNum = 18000000;
          totalTimeOne = 0;
        } else if (testOneTimeObj) {
          testOneTimeNum = addHoursAndMinutes(testOneTimeObj.getHours(), testOneTimeObj.getMinutes());
          totalTimeOne = testOneTimeNum * extendTime;
        }
        if (typeof testTwoTimeObj === "undefined") {
          testTwoTimeNum = 18000000;
          totalTimeTwo = 0;
        } else if (testTwoTimeObj) {
          testTwoTimeNum = addHoursAndMinutes(testTwoTimeObj.getHours(), testTwoTimeObj.getMinutes());
          totalTimeTwo = testTwoTimeNum * extendTime;
        }
        if (typeof testThreeTimeObj === "undefined") {
          testThreeTimeNum = 18000000;
          totalTimeThree = 0;
        } else if (testThreeTimeObj) {
          testThreeTimeNum = addHoursAndMinutes(testThreeTimeObj.getHours(), testThreeTimeObj.getMinutes());
          totalTimeThree = testThreeTimeNum * extendTime;
        }
        if (typeof testFourTimeObj === "undefined") {
          testFourTimeNum = 18000000;
          totalTimeFour = 0;
        } else if (testFourTimeObj) {
          testFourTimeNum = addHoursAndMinutes(testFourTimeObj.getHours(), testFourTimeObj.getMinutes());
          totalTimeFour = testFourTimeNum * extendTime;
        }

        // var currentUser = auth.currentUser;
        // var uid = currentUser.uid;

        var currentUser = function () {
          auth.onAuthStateChanged(user => {
            if (user) {
              var currentUser = auth.currentUser;
              var uid = currentUser.uid;
              console.log("currentUser in onAuthStateChanged = ", currentUser);
            } else {
              console.log("AuthStateChange failed");
            }
          });

          var currentUser = auth.currentUser;
          var uid = currentUser.uid;
          for (var i = 0; i < users.length; i++) {
            if (uid == users[i].uid) {
              var currentUser = users[i];
            }
          }
          console.log("currentUser in currentUser() = ", currentUser);
          return currentUser;
        };

        currentUser = currentUser();
        console.log("currentUser in addStudent() = ", currentUser);
        students = currentUser.students
        console.log("currentUser.students in addStudent() = ", currentUser.students);

        var student = {
          name: studentName,
          extendTime: extendTime,
          testOneName: testOneName,
          testOneTime:  testOneTimeNum || 18000000,
          totalTimeOne: testOneTimeNum * extendTime,
          testOneStartRecord: 0,
          testOneStartTime: 0,
          isTimerOneStart: false,
          isTimerOnePaused: false,
          pausedTimeOne: 0,
          pausedTotalOne: 0,
          isTestOneOver: false,
          testOneEndedAt: 0,
          testTwoName: testTwoName,
          testTwoTime: testTwoTimeNum || 18000000,
          totalTimeTwo: testTwoTimeNum * extendTime,
          testTwoStartRecord: 0,
          testTwoStartTime: 0,
          isTimerTwoStart: false,
          isTimerTwoPaused: false,
          pausedTimeTwo: 0,
          pausedTotalTwo: 0,
          isTestTwoOver: false,
          testTwoEndedAt: 0,
          testThreeName: testThreeName,
          testThreeTime: testThreeTimeNum || 18000000,
          totalTimeThree: testThreeTimeNum * extendTime,
          testThreeStartRecord: 0,
          testThreeStartTime: 0,
          isTimerThreeStart: false,
          isTimerThreePaused: false,
          pausedTimeThree: 0,
          pausedTotalThree: 0,
          isTestThreeOver: false,
          testThreeEndedAt: 0,
          testFourName: testFourName,
          testFourTime: testFourTimeNum || 18000000,
          totalTimeFour: testFourTimeNum * extendTime,
          testFourStartRecord: 0,
          testFourStartTime: 0,
          isTimerFourStart: false,
          isTimerFourPaused: false,
          pausedTimeFour: 0,
          pausedTotalFour: 0,
          isTestFourOver: false,
          testFourEndedAt: 0,
          isSafeToDelete: false,
          created_at: firebase.database.ServerValue.TIMESTAMP
        };

        students.push(student);

      users.$save(currentUser).then(function() {
        console.log("Added student with name " + student.name + " into user, " + currentUser.name);
        });
      }, // end of AddStudent

      deleteTest: function(student, testNo) {

        auth.onAuthStateChanged(user => {
          if (user) {
            var currentUser = auth.currentUser;
            var uid = currentUser.uid;
            console.log("currentUser in onAuthStateChanged = ", currentUser);
          } else {
            console.log("AuthStateChange failed");
          }
        });

        var currentUser = auth.currentUser;
        var uid = currentUser.uid;

        var currentUser = function () {
          var currentUser = auth.currentUser;
          var uid = currentUser.uid;
          for (var i = 0; i < users.length; i++) {
            if (uid == users[i].uid) {
              var currentUser = users[i];
            }
          }
          return currentUser;
        };

        var students = currentUser.students;

        if (testNo == "testOne") {
          student.testOneName = '';
          student.testOneTime = 18000000;
          student.totalTimeOne = 0;
        } else if (testNo == "testTwo") {
          student.testTwoName = '';
          student.testTwoTime = 18000000;
          student.totalTimeTwo = 0;
        } else if (testNo == "testThree") {
          student.testThreeName = '';
          student.testThreeTime = 18000000;
          student.totalTimeThree = 0;
        } else if (testNo == "testFour") {
          student.testFourName = '';
          student.testFourTime = 18000000;
          student.totalTimeFour = 0;
        }

        users.$save(currentUser);
      },

      processTimeInput: function(student, newDueDateObj, testNo) {

        auth.onAuthStateChanged(user => {
          if (user) {
            var currentUser = auth.currentUser;
            var uid = currentUser.uid;
            console.log("currentUser in onAuthStateChanged = ", currentUser);
          } else {
            console.log("AuthStateChange failed");
          }
        });

        var currentUser = auth.currentUser;
        var uid = currentUser.uid;

        var currentUser = function () {
          var currentUser = auth.currentUser;
          var uid = currentUser.uid;
          for (var i = 0; i < users.length; i++) {
            if (uid == users[i].uid) {
              var currentUser = users[i];
            }
          }
          return currentUser;
        };

        var students = currentUser.students;

        console.log("newDueDateObj = " + newDueDateObj);
        if (testNo == "testOne") {
          testOneTimeNum = addHoursAndMinutes(newDueDateObj.getHours(), newDueDateObj.getMinutes());
          student.testOneTime = testOneTimeNum;
          student.totalTimeOne = testOneTimeNum * student.extendTime;
        } else if (testNo == "testTwo") {
          testTwoTimeNum = addHoursAndMinutes(newDueDateObj.getHours(), newDueDateObj.getMinutes());
          student.testTwoTime = testTwoTimeNum;
          student.totalTimeTwo = testTwoTimeNum * student.extendTime;
        } else if (testNo == "testThree") {
          testThreeTimeNum = addHoursAndMinutes(newDueDateObj.getHours(), newDueDateObj.getMinutes());
          student.testThreeTime = testThreeTimeNum;
          student.totalTimeThree = testThreeTimeNum * student.extendTime;
        } else if (testNo == "testFour") {
          testFourTimeNum = addHoursAndMinutes(newDueDateObj.getHours(), newDueDateObj.getMinutes());
          student.testFourTime = testFourTimeNum;
          student.totalTimeFour = testFourTimeNum * student.extendTime;
        }

        users.$save(currentUser);

      },

      toggleSelectForDelete: function(students) {
        for (var i = 0; i < students.length; i++) {
          if (!students[i].isSafeToDelete) {
            students[i].isSafeToDelete = true;
          } else if (students[i].isSafeToDelete) {
            students[i].isSafeToDelete = false;
          }
          students.$save(students[i]);
        }
      },

      delete: function (student) {
        var student = students.$getRecord(student.$id);

        students.$remove(student).then(function() {
          console.log("student, which is now " + student + ", has been removed");
        });
      }

    }; // end of Return

  } // end of StudentCrud function
]); // end of factory initialization
