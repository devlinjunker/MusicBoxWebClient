musicBox.controller(
    'adminController',
function($scope, user, musicBoxSession, trackQueue){
    $scope.subviews = ['home', 'playlist', 'device', 'settings'];

    $scope.boxSession = musicBoxSession;
    $scope.user = user;
    $scope.trackQueue = trackQueue;

    $scope.subview = $scope.subviews[0];

    var settingsChanged = false;



    $scope.selectBox = function(box){
        musicBoxSession.setCurrentDevice(box);

        musicBoxSession.getTrackHistory().then(function(list){
            trackQueue.setHistory(list, musicBoxSession.getCurrentDevice().playing);
        })

        trackQueue.setQueue([]);
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