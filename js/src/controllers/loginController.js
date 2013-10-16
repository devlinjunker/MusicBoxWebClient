musicBox.controller(
	'loginController',
function($scope, $http, $location, user){
	$scope.username = '';
	$scope.password = '';

	$scope.errorMessage = '';

	$scope.submitLogin = function(){
		user.login($scope.username, $scope.password,
			function(success){
				console.log('success logging in!')

				$scope.$apply(function(){
					$location.path('/musicbox/admin');
					console.log($location.path());
				});


			},
			function(failure){
				console.log("failed")
			}
		);
	};
});