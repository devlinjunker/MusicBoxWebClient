musicBox.controller(
	'deviceController',
function($scope, $location, musicBoxSession, user){
	$scope.nearbyDevices = [];

	$scope.isMobile = window.matchMedia && window.matchMedia('(max-width: 992px)').matches || screen.width <= 960;
	//$scope.isMobile = true;
	// if($scope.isMobile){

	// 	$location.path("m")
	// }


	$scope.user = user;
	$scope.boxSession = musicBoxSession;

	$scope.playPauseTrack = function(){
		if($scope.boxSession.getCurrentDevice().isPlaying()){
			$scope.boxSession.sendPauseTrackMessage();
		}
		else if($scope.boxSession.getCurrentDevice().isPaused()){
			$scope.boxSession.sendPlayTrackMessage();
		}
		else{
			console.log('device disconnected');
		}
	}

	$scope.skipTrack = function(){
		musicBoxSession.sendSkipTrackMessage();
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
		$scope.$apply(function(){});
	}

	// Initizialization
	musicBoxSession.addCurrentDeviceCallback(handleMessages);

});