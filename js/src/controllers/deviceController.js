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

	$scope.$watch('boxSession.currentDevice', function(newVal, oldVal, $scope){
		if(newVal){
			musicBoxSession.getTrackHistory();
			//musicBoxSession.changeDevice(newVal.id, newVal.name, oldVal.id, oldVal.name);
		}
	})

	$scope.isPlaying = true;


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