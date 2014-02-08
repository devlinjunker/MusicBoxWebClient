musicBox.controller(
    'settingsController',
function($scope, musicBoxSession){
    $scope.boxSession = musicBoxSession;

    $scope.subviews = ['home', 'stations', 'device', 'settings'];
    $scope.subview = $scope.subviews[1];

    $scope.themeList =

    musicBoxSession.getThemes().then(function(themes){
        $scope.themeList = themes;

        $scope.subview = 'device';
    })
});