musicBox.controller(
    'queueController',
function($scope, trackQueue, socketSession, user){
    $scope.trackQueue = trackQueue.queue;

    socketSession.subscribe(user.currentDeviceUri, function(topicUri, event){
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