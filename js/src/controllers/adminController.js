musicBox.controller(
    'adminController',
function($scope, user, musicBoxSession, trackQueue){
    $scope.subviews = ['playlist', 'settings'];

    $scope.boxSession = musicBoxSession;
    $scope.user = user;
    $scope.trackQueue = trackQueue;

    $scope.subview = $scope.subviews[0];

    $scope.boxSession.currentDevice = user.musicBoxes[0];

    var settingsChanged = false;

    $scope.selectBox = function(box){
        $scope.boxSession.changeDevice(box);

        musicBoxSession.getTrackHistory().then(
            function(list){
                trackQueue.setHistory(list);
            }
        )
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

});