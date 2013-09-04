musicBox.controller(
    'queueController',
function($scope, trackQueue, musicBoxSession, user){
    $scope.trackQueue = trackQueue.queue;

    $scope.isEmpty = function(){
        if(trackQueue.currentTrack == trackQueue.noSong)
            return true;
        else
            return false;
    }

    musicBoxSession.addCallback(function(topicUri, event){
        console.log('Event Handler!');
        console.log(event);

        switch(event.command){
            case "addTrack":
                $scope.$apply(trackQueue.addTrack(event.data));
                break;
            case "nextTrack":
                $scope.$apply(trackQueue.nextTrack());
                break;
            case "playTrack":
                break;
            case "pauseTrack":
                break;
            case "endOfTrack":
                break;
            case "statusUpdate":

                break;
        }
    });
});