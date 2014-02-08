musicBox.controller(
    'adminController',
function($scope, $location, user, musicBoxSession){
    $scope.boxSession = musicBoxSession;
    $scope.user = user;

    $scope.subviews = ['home', 'playlist', 'device', 'settings'];
    $scope.subview = $scope.subviews[0];

    var settingsChanged = false;

    if($scope.isMobile){

        user.musicBoxes.promise.then(function(boxes){
            $scope.boxSession.setCurrentDevice(user.devices[0]);
        })
        $location.path("m")
    }


    $scope.selectBox = function(box){
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