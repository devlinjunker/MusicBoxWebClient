musicBox.controller(
    'settingsController',
function($scope, musicBoxSession){
    $scope.boxSession = musicBoxSession;

    $scope.themeId;
    $scope.themeList = [];

    musicBoxSession.getThemes().then(function(themes){
        $scope.themeList = themes;

        $scope.themeId = musicBoxSession.getCurrentDevice().ThemeID;
    })

    $scope.saveDeviceSettings = function(){

        musicBoxSession.getCurrentDevice().setStation($scope.themeId);

        $scope.selectSubview('device');
    }

    $scope.cancelSettingsChange = function(){
        $scope.selectSubview('device');

        $scope.themeId = musicBoxSession.getCurrentDevice().ThemeID;
    }

});