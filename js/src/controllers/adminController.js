musicBox.controller(
    'adminController',
function($scope, user, musicBoxSession, trackQueue){
    $scope.subviews = ['playlist', 'settings'];

    $scope.boxSession = musicBoxSession;

    $scope.user = user;
    $scope.subview = $scope.subviews[0];

    $scope.boxSession.currentDevice = user.musicBoxes[0];

    $scope.selectBox = function(box){
        $scope.boxSession.currentDevice = box;

        musicBoxSession.getTrackHistory();
    }

    $scope.selectSubview = function(viewName){
        $scope.subview = viewName;
    }

    function updatePlaylist(){

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