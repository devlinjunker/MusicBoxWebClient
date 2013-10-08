musicBox.controller(
    'queueController',
function($scope, trackQueue, musicBoxSession, user){
    $scope.queue = trackQueue.queue;
    $scope.history = trackQueue.history;

    // Returns true if the trackQueue Service queue is empty, false otherwise
    $scope.isEmpty = function(){
        return trackQueue.emptyQueue();
    }
});