spedtracker.factory("StudentCrud", ["$firebaseArray", "FirebaseRef", "UserCrud",
  function($firebaseArray, FirebaseRef, UserCrud, DataCrud) {

// Public variables below
    // holds data as array of objects.  Each object is one item.
    var studentsRef = FirebaseRef.getStudentsRef();
    var students = FirebaseRef.getStudents();

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
      // handing ref over to AuthCtrl.js for User creation and authentication.
      getAllStudents: function() {
        return students;
      },

      getStudentsRef: function() {
        return studentsRef;
      },
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
          var years = timeInMillisecs / millisecsInYear;
          var lessThanYear = timeInMillisecs % millisecsInYear;
          var months = lessThanYear / millisecsInMonth;
          var lessThanMonth = lessThanYear % millisecsInMonth;
          var days = lessThanMonth / millisecsInDay;
          var lessThanDay = lessThanMonth % millisecsInDay;
          var hours = lessThanDay / millisecsInHour;
          var lessThanHour = lessThanDay % millisecsInHour;
          var minutes = lessThanHour / millisecsInMinute;
          var lessThanMinute = lessThanHour % millisecsInMinute;
          var seconds = Math.round(lessThanMinute / millisecsInSecs);
        }

        return {
          total: timeInMillisecs,
          year: Math.floor(years),
          month: Math.floor(months),
          day: Math.floor(days),
          hour: Math.floor(hours),
          minute: Math.floor(minutes),
          second: seconds
        };
      },
// This function is called by the submit button in testTracker.html when user creates an item in the form
      addStudent: function(studentName, extendTime, testName, hours, minutes) {

        students.$add({
          name: studentName,
          extendTime: extendTime,
          testName: testName,
          examTime: addHoursAndMinutes(hours, minutes),
          created_at: firebase.database.ServerValue.TIMESTAMP
        }).then(function(studentsRef) {
          var id = studentsRef.key;
          console.log(studentName + ": end.  Added student with id " + id);
          students.$indexFor(id);

        });
      }, // end of AddItem

      toggleItemToDelete: function(item) {
        var queriedItem = students.$getRecord(item.$id);

        if (queriedItem.isSafeToComplete === false) {
          item.isSafeToComplete = true;
        } else if (queriedItem.isSafeToComplete === true){
          item.isSafeToComplete = false;
        }

        students.$save(queriedItem);
      },

      toggleSelectForDelete: function(students) {
        for (var i = 0; i < students.length; i++) {
          if (!students[i].isSafeToComplete && !students[i].isComplete) {
            students[i].isSafeToComplete = true;
          } else if (students[i].isSafeToComplete && !students[i].isComplete) {
            students[i].isSafeToComplete = false;
          }
          students.$save(students[i]);
        }
      }

    }; // end of Return

  } // end of StudentCrud function
]); // end of factory initialization
