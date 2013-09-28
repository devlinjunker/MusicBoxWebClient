musicBox.controller(
	'loginController',
function($scope, $http, $location, user){
	$scope.username = '';
	$scope.password = '';

	$scope.errorMessage = '';

	$scope.submitLogin = function(){
		user.login($scope.username, $scope.password,
			function(success){
				console.log('authenticated');
				$scope.$apply(function(){
					$location.path('/musicbox/admin');
				});

			},
			function(failure){
				console.log("failed")
			}
		);
	};
});