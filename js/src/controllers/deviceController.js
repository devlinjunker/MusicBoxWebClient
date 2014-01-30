musicBox.controller(
	'deviceController',
function($scope, musicBoxSession, user, trackQueue){

	$scope.user = user;
	$scope.boxSession = musicBoxSession;
	$scope.trackQueue = trackQueue;

	$scope.currentDevice = undefined;

	//$scope.boxSession.currentDevice = $scope.deviceList[0];

	$scope.playPauseTrack = function(){
		console.log($scope.currentDevice);
		if($scope.boxSession.currentDevice.Playing == 2){
			$scope.boxSession.sendPauseTrackMessage();
			$scope.boxSession.currentDevice.Playing = 1;
		}
		else if($scope.boxSession.currentDevice.Playing == 1)
		{
			$scope.boxSession.sendPlayTrackMessage();
			$scope.boxSession.currentDevice.Playing = 2;
		}
		else
		{
			console.log('device disconnected');
		}
	}

	$scope.skipTrack = function(){
		musicBoxSession.sendSkipTrackMessage();

		trackQueue.nextTrack();
	}

	$scope.formatLength = function(length){
		if(length === undefined){
			return "0:00";
		}

		var str = Math.floor(length / 60) + ":";
		str += (length % 60 < 10 ? "0" : "");
		str += Math.floor(length % 60);

		return str;
	}

	$scope.getTrackID = function(track){
		return track.Title.replace(/ /g, '_');
	}

	$scope.toggleTrackExtras = function(id){
		if($('#'+id).children('.song_extras').hasClass('hidden')){
			$('.song_extras').addClass('hidden');

			$('#'+id).children('.song_extras').removeClass('hidden');
		}else{
			$('#'+id).children('.song_extras').addClass('hidden');
		}
	}

	function handleMessages(topicUri, event){
		console.log('Message!');
		console.log(event);

		// if(topicUri == currentDevice){

		// }

		switch(event.command){
			case "playTrack":
				$scope.boxSession.currentDevice.Playing = 2;
				break;
			case "pauseTrack":
				$scope.boxSession.currentDevice.Playing = 1;
				break;
			// case "statusUpdate":
				// $scope.boxSession.currentDevice.Playing = event.data.Playing;
				// $scope.songPlaying = event.data.queue[0];
				// break;
			case "trackHistory":
				break;
			case "startedTrack":
                break;
            case "addTrack":
				break;
			case "nextTrack":
				break;
			case "endOfTrack":
				break;
		}
	}

	// Initizialization
	musicBoxSession.addCallback(handleMessages);

});