musicBox.controller(
    'mobileController',
function($scope, $rootScope, $location, musicBoxSession, user){
    $scope.user = user;
    $scope.boxSession = musicBoxSession;

    $scope.subviews = ['home', 'stations', 'current', 'settings'];
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

    $scope.login = function(){
        $location.path("login");
    }

    $scope.logout = function(){
        user.logout();
        $scope.setSubview('home');
    }

    $scope.selectStation = function(stationId){
        musicBoxSession.getCurrentDevice().setStation(stationId);

        $scope.setSubview('current');
    }

    $scope.setSubview = function(subview){
        $scope.subview = subview;
    }

    $scope.toggleMenu = function(){
        $scope.menuHidden = !$scope.menuHidden;
    }

    $scope.changeCurrentClickFunction(function(){
        if(musicBoxSession.getCurrentDevice().isPlaying()){
            $scope.setSubview('current');
        }
    })
});