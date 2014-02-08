musicBox.controller(
    'mobileController',
function($scope, $location, musicBoxSession, user){
    $scope.user = user;
    $scope.boxSession = musicBoxSession;

    $scope.subviews = ['home', 'stations', 'device', 'settings'];
    $scope.subview = $scope.subviews[1];

    $scope.menuHidden = true;

    $scope.$watch('window.matchMedia', function(){
        $scope.isMobile = window.matchMedia && window.matchMedia('(max-width: 992px)').matches || screen.width <= 960;

        console.log('test')

        if(!$scope.isMobile){
            $location.path("admin");
        }
    })

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