musicBox.controller(
	'deviceController',
function($scope, socketSession, user, trackQueue){
	$scope.deviceName = 'Beatles';

	$scope.songPlaying = trackQueue.currentSong;

	$scope.isPlaying = true;

	function sendSkipTrackMessage(){
		var message = {
			"command": "nextTrack"
		}

		socketSession.publish(user.currentDeviceUri, message, false);
	}


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
		sendSkipTrackMessage();
	}

	$scope.changeDevice = function(){

	}

	$scope.handleMessages = function(topicUri, event){
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

	socketSession.subscribe(user.currentDeviceUri, $scope.handleMessages);

	socketSession.call(user.currentDeviceUri + "/currentQueueRequest",
		{
			username: user.name,
			password: user.password,
			playerTitle: $scope.deviceName
		},
		function(result){
			console.log("update requested")
		},
		function(){}
	);


});