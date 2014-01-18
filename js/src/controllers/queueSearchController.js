musicBox.controller(
    'queueSearchController',
function($scope, $q, trackQueue, spotifyService){
    $scope.selected = undefined;

    $scope.findTracks = function(value){
        return (spotifyService.search(value));
    }

    $scope.addTrack = function(){
        trackQueue.addTrack($scope.selected);

        $scope.selected = undefined;
    }
});