musicBox.controller(
    'mobileController',
function($scope, $rootScope, $location, musicBoxSession, user){
    $scope.user = user;
    $scope.boxSession = musicBoxSession;

    $scope.subviews = ['home', 'stations', 'current', 'settings'];
    $scope.subview = $scope.subviews[0];

    $scope.menuHidden = true;

    if(user.permissions === undefined){
        $location.path("/");
    }

	$scope.home = function(){
		$scope.setSubview('home');
		$scope.toggleMenu();
	}

    $scope.login = function(){
		$scope.toggleMenu();
        $location.path("login");
    }

    $scope.logout = function(){
        user.logout();
		$scope.toggleMenu();
        $location.path("home");
    }
	
	$scope.selectDevice = function(device){
		$scope.boxSession.setCurrentDevice(device);
		
		$scope.hideMenu();
		
        $scope.setSubview('current')
	}

    $scope.selectStation = function(stationId){
        musicBoxSession.getCurrentDevice().setStation(stationId);

        $scope.setSubview('current');
    }

    $scope.setSubview = function(subview){
		if(subview == "current"){
			$scope.$parent.hideVolumeControls = false;
		}else{
			$scope.$parent.hideVolumeControls = true;	
		}
		
        $scope.subview = subview;
    }

    $scope.toggleMenu = function(){
        $scope.menuHidden = !$scope.menuHidden;
    }
	$scope.hideMenu = function(){
		$scope.menuHidden = true;
	}

	$scope.viewStationList = function(){
		$scope.setSubview('stations');
	}

    $scope.changeCurrentClickFunction(function(){
        if(musicBoxSession.getCurrentDevice() != undefined && 
			musicBoxSession.getCurrentDevice().isPlaying()){
            $scope.setSubview('current');
		}
    })
});