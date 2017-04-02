spedtracker.factory("StudentCrud", ["$firebaseArray", "FirebaseRef", "UserCrud",
  function($firebaseArray, FirebaseRef, UserCrud, DataCrud) {

// Public variables below
    // holds data as array of objects.  Each object is one item.
    var studentsRef = FirebaseRef.getStudentsRef();
    var students = FirebaseRef.getStudents();

    var now = new Date();
    var nowNum = now.getTime();
    var week = 604800000;

// Public functions below.

// This function below returns 'urgencyTxt', which announces the urgency status of an item in the DOM
    var createUrgencyTxt = function(urgency) {
      if (urgency === true) {
        urgencyTxt = "yes";
      } else {
        urgencyTxt = "no";
      }
      return urgencyTxt;
    };

// -- RANK FUNCTIONS -- The functions below calculate parameters that influence an item's rank, i.e. the item's priority in the to do list.

// This function below returns 'estTime', the exact estimated Time amount in milliseconds and is used to calculate the 'ratio' in the subsequent function.
    var calculateEstTime = function(eHour, eMinute) {
      var estTime = (eHour * 60 * 60 * 1000) + (eMinute * 60 * 1000);
      return estTime;
    };
// This function below returns the 'ratio' between the estimated time to complete an item and the time remaining till its due date.  'ratio' is one of three parameters used to calculate Rank.
    var calculateTimeEstTimeTillDueRatio = function(timeTillDueDate, estTime) {
      var ratio = estTime / timeTillDueDate;
      return ratio;
    };
// This function below returns 'urgency', another parameter used to calculate Rank.  It basically gives higher estimated time to time till due date 'ratio''s an even higher value than it would have otherwise.
    var calculateUrgency = function(ratio) {
      if (ratio >= 0.4) {
        urgency = true;
      } else {
        urgency = false;
      }
      return urgency;
    };
// This function below collects the parameters shown in order to calculate an item's Rank
    var calculateRank = function(importance, ratio, urgency) {
      // if urgency = true, then it helps to create a higher importanceMultiple than otherwise (see beneath)
      if (urgency) {
        urgencyAddend = 2.9;
      } else {
        urgencyAddend = 0;
      }
      // the below calculates the importanceMultiple according to the importance given by the user to the item
      if (importance == "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>") {
        importanceMultiple = 3 + urgencyAddend;
      } else if (importance == "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-half'></i>") {
        importanceMultiple = 2.5 + urgencyAddend;
      } else if (importance == "<i class='fa fa-star'></i><i class='fa fa-star'></i>") {
        importanceMultiple = 2 + urgencyAddend;
      } else if (importance == "<i class='fa fa-star'></i><i class='fa fa-star-half'></i>") {
        importanceMultiple = 1.5 + urgencyAddend;
      } else {
        importanceMultiple = 1.1 + urgencyAddend;
      }
      // The Ranking calculation below prioritizes to do students whose estimated time to completion are larger relative to their time till due dates.  The second influence is the importance factor, however this is not as important unless the item is due soon as well.
      var rank = Math.round((ratio * importanceMultiple + ratio) * 1000000);
      return rank;
    };
// The function below calls all of the public functions related to Rank above in order to return 'rank' and 'urgency'.  This function is called both when an item is newly created and when it is updated.
    var prioritize = function(item, dueDate, importance, newUrgency, eHour, eMinute) {
      var timeTillDueDate = dueDate - now;
      // estTime comes out in milliseconds and does not go into the database, it is used by calculate ratio below
      var estTime = calculateEstTime(eHour, eMinute);
      // ratio does not go into DB, but is used to figure out RANK below (words in all-caps refer to things that DO go into the DB)
      var ratio = calculateTimeEstTimeTillDueRatio(timeTillDueDate, estTime);
      if (item === null) {
        // in case the item is being currently created
        var currentUrgency = calculateUrgency(ratio);
      } else {
        // in case the item already exists and is just being updated
        var currentUrgency = newUrgency;
      }
      var rank = calculateRank(importance, ratio, currentUrgency);
      return {
        urgency: currentUrgency,
        rank: rank
      };
    };

    // The function below marks item as complete or incomplete depending on its original state.  It is called by 'testTracker.html' by the delete button and by 'behvTracker.html' by the modal.
    var updateCompletion = function(item, newDueDate, newhours, newMinutes) {
      // Remember: Both IF conditions below can only be executed by the deleteBtn in testTracker.html, which effectively delets the item from to do and relegates it to the archive.
      // Both The ELSE (below) and the ELSE IF condition (further below) can be executed by BOTH the un-delete button in archive and the Modal when this latter is executed from archive.

      console.log("item: " + item);

      var item = students.$getRecord(item.$id);

      if (!item.isComplete) {
        item.isComplete = true;
        item.completed_at = firebase.database.ServerValue.TIMESTAMP;

      } else if (item.isComplete) {
        item.isComplete = false;
        item.completed_at = 0;
        item.isSafeToComplete = false;
      }
      students.$save(item);
    };

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
      calculateTimeTillDueDate: function(dueDate, time) {
        if (typeof dueDate === "object") {
          dueDate = dueDate.getTime();
        }

        timeLeftInMillisecs = dueDate - time;
        return timeLeftInMillisecs;
      },

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
      addItem: function(itemName, dueDate, importance, eHour, eMinute) {

        // empty the below variables in order to contextualize the 'prioritize' call for the 'addItem' function
        var item = null;
        var urgency = null;

        var dueDate = dueDate.getTime();

        var itemProperties = prioritize(item, dueDate, importance, urgency, eHour, eMinute);

        students.$add({
          name: itemName,
          // dueDate: dueDate.getTime(),
          dueDate: dueDate,
          eHour: eHour,
          eMinute: eMinute,
          importance: importance,
          isSafeToComplete: false,
          isComplete: false,
          isPastDue: false,
          isUrgent: itemProperties.urgency,
          rank: itemProperties.rank,
          created_at: firebase.database.ServerValue.TIMESTAMP,
          completed_at: 0
        }).then(function(studentsRef) {
          var id = studentsRef.key;
          // console.log(itemName + ": end.  Added item with id " + id);
          students.$indexFor(id);

        });
      }, // end of AddItem
// This function is called by StudentCtrl '$scope.showComplex' function, which is in turn called by 'testTracker.html' when the user clicks on the 'edit' button for a given item.  The $scope.showComplex' function creates a modal that offers update options to the user.  Clicking close on the modal resolves '$scope.updateItem' which calls 'updateItem' below
      updateItem: function(oldItem, newName, newDueDate, newImportance, newUrgent, newHours, newMinutes) {

        if (typeof newDueDate == "object") {
          var newDueDate = newDueDate.getTime();
        }

        if (oldItem.isComplete) {
          updateCompletion(oldItem, newDueDate, newHours, newMinutes);
        }


        var updatedItemProperties = prioritize(oldItem, newDueDate, newImportance, newUrgent, newHours, newMinutes);

        oldItem.name = newName;
        oldItem.dueDate = newDueDate;
        oldItem.importance = newImportance;
        oldItem.isUrgent = updatedItemProperties.urgency;
        oldItem.eHour = newHours;
        oldItem.eMinute = newMinutes;
        oldItem.rank = updatedItemProperties.rank;

        students.$save(oldItem).then(function(studentsRef) {
          // console.log("students.$save called");
        });

      },

// The function below is the actual deletion process for students.  The user has the power to only mark students as complete.  Complete or Past Due (i.e. incomplete but not marked as complete after the due date) students are rescuable and able to be set as incomplete for up to a week.  After one week, all Complete and Past Due students are deleted when this function is called by StudentCtrl function 'refreshTalliesAndData', which is called when (1) 'testTracker.html' is initialized, and when either (2) '$scope.updatestudents', or (3) '$scope.addItem', or (4) '$scope.updateCompletion' are called.
      processOldCompletestudents: function () {
        var totalstudents = students.length;

        for (var i = 0; i < totalstudents; i++) {
          if (students[i].isComplete && students[i].dueDate + week < now) {

            var itemToDelete = students.$getRecord(students[i].$id);

            // 'date' is part of the console.log
            var date = new Date(itemToDelete.dueDate);
            var dueDate = itemToDelete.dueDate;

            console.log("item named " + itemToDelete.name + " with date: " + date.toString() + ", is about to be removed");

            students.$remove(itemToDelete).then(function() {
                console.log("item, which is now " + itemToDelete + ", has been removed");
              });
            // Still figuring out how to $destroy students and avoid memory leaks.
            // students.$destroy(students[i]);
          }
        }
      },
// The function below updates students that are past due (i.e. incomplete but not marked as complete after the due date) with pastDue = true.  It also tallies these students.  It is called by StudentCtrl function '$scope.refreshTalliesAndData'
      updateAllstudentsPastDue: function() {
        var totalstudents = students.length;

        for (var i = 0; i < totalstudents; i++) {

          var dueDate = students[i].dueDate;

          if (!students[i].isComplete && students.$loaded()) {
            if ((students[i].dueDate < now) && !(students[i].isPastDue)) {
              students[i].isPastDue = true;
              students.$save(students[i]);
            } else if ((students[i].dueDate > now) && (students[i].isPastDue)) {
              students[i].isPastDue = false;
              students.$save(students[i]);
            }
          }
        }
      },

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
      },

      updateCompletion: function(item, newDueDate, newHours, newMinutes) {
        updateCompletion(item, newDueDate, newHours, newMinutes);
      }

    }; // end of Return

  } // end of StudentCrud function
]); // end of factory initialization
