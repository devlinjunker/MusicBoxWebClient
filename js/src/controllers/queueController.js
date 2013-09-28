musicBox.controller(
    'queueController',
function($scope, trackQueue, musicBoxSession, user){
    $scope.trackQueue = trackQueue.queue;

    // Returns true if the trackQueue Service queue is empty, false otherwise
    $scope.isEmpty = function(){
        return trackQueue.isEmpty();
    }

    // Message Handling Method, performs methods on the trackQueue Service based
    // on the message details
    function handleMessages(topicUri, event){
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
    }

    musicBoxSession.addCallback(handleMessages);
});