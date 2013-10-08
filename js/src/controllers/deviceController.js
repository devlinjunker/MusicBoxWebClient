musicBox.controller(
	'deviceController',
function($scope, musicBoxSession, user, trackQueue){
	$scope.deviceList = [
		{name: 'Beatles', id: 'musicBox1', deviceUri: 'http://www.musicbox.com/christopher.vanderschuere@gmail.com/musicBox1'},
		{name: 'Deadmau5', id: 'musicBox2'},
	 	{name: 'AwolNation', id: 'musicBox3'},
	 	{name: 'Coldplay', id: 'musicBox4'}
	 ];

	$scope.user = user;
	$scope.boxSession = musicBoxSession;
	$scope.trackQueue = trackQueue;

	$scope.boxSession.currentDevice = $scope.deviceList[0];

	$scope.playPauseTrack = function(){
		if($scope.boxSession.currentDevice.Playing){
			$scope.boxSession.sendPauseTrackMessage();
		}
		else
		{
			$scope.boxSession.sendPlayTrackMessage();
		}

		$scope.boxSession.currentDevice.Playing = !$scope.boxSession.currentDevice.Playing;
	}

	$scope.skipTrack = function(){
		musicBoxSession.sendSkipTrackMessage();
	}

	$scope.formatTime = function(length){
		if(length == undefined){
			return "0:00";
		}

		var str = Math.floor(length / 60) + ":";
		str += (length % 60 < 10 ? "0" : "");
		str += Math.floor(length % 60);

		return str;
	}

	function handleMessages(topicUri, event){
		console.log('Message!');
		console.log(event);

		switch(event.command){
			case "addTrack":
				var trackInfo = event.data.track;
				$scope.$apply(trackQueue.addTrack(trackInfo));
				break;
			case "nextTrack":
				$scope.$apply(trackQueue.nextTrack());
				break;
			case "playTrack":
				$scope.boxSession.currentDevice.Playing = true;
				break;
			case "pauseTrack":
				$scope.boxSession.currentDevice.Playing = false;
				break;
			case "endOfTrack":
				break;
			// case "statusUpdate":
				// $scope.boxSession.currentDevice.Playing = event.data.Playing;
				// $scope.songPlaying = event.data.queue[0];
				// break;
			case "trackHistory":

				break;
			case "startedTrack":
                $scope.$apply(function(){
                    trackQueue.addTrack(event.data.track);
                    trackQueue.nextTrack();
                })
                break;
		}
	}

	// Initizialization
	musicBoxSession.addCallback(handleMessages)

});