musicBox.controller(
    'adminController',
function($scope, user){
    $scope.user = user;

    $scope.boxSelected;

    $scope.selectBox = function(box){
        console.log(box)
        $scope.boxSelected = box;
    }

});