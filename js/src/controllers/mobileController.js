musicBox.controller(
    'mobileController',
function($scope, $location, musicBoxSession, user){
    $scope.user = user;
    $scope.boxSession = musicBoxSession;

    $scope.subviews = ['home', 'stations', 'device', 'settings'];
    $scope.subview = $scope.subviews[1];

    $scope.menuHidden = true;

    if(user.permissions === undefined){
        $location.path("/");
    }

    // var menu = $.jPanelMenu({
    //     menu: "#mobile_menu",
    //     trigger: "#mobile_menu_trigger",
    //     duration: 300
    // });

    // menu.on();

    $scope.goToLogin = function(){
        $location.path("login");
    }

    $scope.selectStation = function(stationId){
        musicBoxSession.getCurrentDevice().setStation(stationId);

        $scope.subview = 'current';
    }

    $scope.setSubview = function(subview){
        $scope.subview = subview;
    }

    $scope.toggleMenu = function(){
        $scope.menuHidden = !$scope.menuHidden;
    }
});