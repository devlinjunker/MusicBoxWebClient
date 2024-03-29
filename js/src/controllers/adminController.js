musicBox.controller(
    'adminController',
function($scope, $location, user, musicBoxSession){

    if(user.permissions === undefined){
        $location.path("/");
    }

	$scope.$parent.hideQuickControls = false;
    $scope.boxSession = musicBoxSession;
    $scope.user = user;

    $scope.subviews = ['home', 'device', 'settings'];
    $scope.subview = $scope.subviews[0];

    var settingsChanged = false;

	// TODO: Check if device online, if so select the first


	$scope.$parent.changeHomeFunction(function(){
		$scope.selectSubview('home');
	})

    if($scope.isMobile){
		
		if(user.permissions != undefined){
			$scope.$parent.hideQuickControls = false;
		}
        $location.path("m")
    }


    $scope.selectBox = function(box){
		console.log(user.devices)
        musicBoxSession.setCurrentDevice(box);
    }

    $scope.selectSubview = function(viewName){
        if($scope.subview == 'settings' && settingsChanged){
            confirm('Do you want to save first?')
        }
        $scope.subview = viewName;
    }

    $scope.deviceDropdownController = function($scope){
        $scope.views = [
            {
                name: 'Settings',
                viewName: 'settings'
            }
        ];
    }

    function handleMessages(topicUri, event){
        $scope.$apply(function(){});
    }

    musicBoxSession.addCallback(handleMessages);

});