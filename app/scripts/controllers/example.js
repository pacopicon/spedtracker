var refreshTime = function() {
  time = Date.now();
  $scope.time = time;
  return $scope.time;
};

var promise = $interval(refreshTime, 1000);

$scope.stopClock = function() {
  $interval.cancel(promise);
  console.log("time promise: " + JSON.stringify(promise, null, 4));
};







$scope.$watch(promise, watcherFunction, true);

function watcherFunction(newValue, oldValue) {
  if (promise == null) {
    $scope.timer();
  }
};
