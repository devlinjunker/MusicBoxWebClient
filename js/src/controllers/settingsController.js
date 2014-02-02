musicBox.controller(
    'settingsController',
function($scope, musicBoxSession){
    $scope.boxSession = musicBoxSession;

    $scope.themeList =

    musicBoxSession.getThemes().then(function(themes){
        $scope.themeList = themes;
    })
});