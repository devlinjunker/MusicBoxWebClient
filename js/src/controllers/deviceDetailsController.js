musicBox.controller(
	'deviceDetailsController',
function($scope, musicBoxSession, user, trackQueue){

	$scope.deviceList = [{name: 'Beatles', id: '1'}, {name: 'Deadmau5', id: '2'},
	 	{name: 'AwolNation', id: '3'},{name: 'Coldplay', id: '4'}];


	$scope.deviceSelected = $scope.deviceList[0];

	$scope.$watch('deviceSelected', function(newVal, oldVal, $scope){
		if(newVal){
			musicBoxSession.changeDevice(newVal.id, newVal.name, oldVal.id, oldVal.name);
		}
	})

	$scope.isPlaying = true;
	$scope.trackQueue = trackQueue;

	$scope.currentTrack = trackQueue.currentTrack;
	$scope.$watch('trackQueue.currentTrack', function(newVal, oldVal, $scope){
		if(newVal)
			$scope.currentTrack = newVal;
	});


	$scope.addTrack = function(details){

	}

	$scope.playPauseTrack = function(){
		if($scope.isPlaying){
			//sendPlayMessage();
		}
		else
		{
			//sendPauseMessage();
		}

		$scope.isPlaying = !$scope.isPlaying;
	}

	$scope.skipTrack = function(){
		musicBoxSession.sendSkipTrackMessage();
	}

	function handleMessages(topicUri, event){
		console.log('Event Handler!');
		console.log(event);

		switch(event.command){
			case "addTrack":
				$scope.addTrack(event.data);
				break;
			case "nextTrack":
				break;
			case "playTrack":
				$scope.isPlaying = true;
				break;
			case "pauseTrack":
				$scope.isPlaying = false;
				break;
			case "endOfTrack":
				break;
			case "statusUpdate":
				$scope.isPlaying = event.data.isPlaying;
				$scope.songPlaying = event.data.queue[0];
				break;
		}
	}

	// Initizialization
	musicBoxSession.addCallback(handleMessages)

});