musicBox.controller(
	'deviceController',
function($scope, $location, musicBoxSession, user){
	$scope.nearbyDevices = [];

	$scope.isMobile = window.matchMedia && window.matchMedia('(max-width: 992px)').matches || screen.width <= 960;

	$scope.$location = $location;
	$scope.user = user;
	$scope.boxSession = musicBoxSession;

	$scope.hideQuickControls = false;
	$scope.hideVolumeControls = true;

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
	
	$scope.increaseVolume = function(){
		var vol = $scope.boxSession.getCurrentDevice().getVolume();
		
		
		if(vol === undefined){
			$scope.boxSession.getCurrentDevice().setVolume(100);
		}else if(vol >= 100){
			return;
		}else if(vol > 95){
			$scope.boxSession.getCurrentDevice().setVolume(100);
		}else{
			$scope.boxSession.getCurrentDevice().setVolume(vol+10);
		}
	}

	$scope.decreaseVolume = function(){
		var vol = $scope.boxSession.getCurrentDevice().getVolume();
		
		if(vol === undefined){
			$scope.boxSession.getCurrentDevice().setVolume(0);
		}else if(vol <= 0){
			return;
		}else if(vol < 5){
			$scope.boxSession.getCurrentDevice().setVolume(0);
		}else{
			$scope.boxSession.getCurrentDevice().setVolume(vol-10);
		}
	}

	$scope.formatLength = function(length){
		if(length == undefined){
			return "0:00";
		}

		return length;
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

	$scope.currentClicked = function(){
		$scope.currentClickFunction();
	}

	$scope.changeCurrentClickFunction = function(func){
		$scope.currentClickFunction = func;
	}
	
	$scope.homeFunction = (function(){
		return function(){
			$location.path("home");
		}
	})()
	
	$scope.home = function(){
		$scope.homeFunction();
	}
	
	$scope.changeHomeFunction = function(func){
		$scope.homeFunction = func;
	}

	function handleMessages(topicUri, event){
		$scope.$apply(function(){});
	}
	
	// Initizialization
	musicBoxSession.addCurrentDeviceCallback(handleMessages);

});