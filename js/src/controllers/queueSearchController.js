musicBox.controller(
    'queueSearchController',
function($scope, trackQueue){
    $scope.selected = undefined;

    $scope.findTracks = function(value){
        return [{id:1, TrackTitle: "test"},{id:2, TrackTitle:"bob"}];
    }

    $scope.addTrack = function(){
        trackQueue.addTrack($scope.selected);

        $scope.selected = undefined;
    }
});