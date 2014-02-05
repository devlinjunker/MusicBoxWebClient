musicBox.controller(
    'adminController',
function($scope, $location, user, musicBoxSession){
    if(user.permissions === undefined){
        $location.path("/");
    }

    $scope.subviews = ['home', 'playlist', 'device', 'settings'];

    $scope.boxSession = musicBoxSession;
    $scope.user = user;

    $scope.subview = $scope.subviews[0];

    var settingsChanged = false;



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