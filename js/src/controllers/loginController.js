musicBox.controller(
	'loginController',
function($scope, $http, $location, user, musicBoxSession){

	$scope.errorMessage = undefined;

	$scope.submitLogin = function(){
		user.login($scope.username, $scope.password,
			function(success){
				console.log('success logging in!')

				$scope.$apply(function(){
					console.log($location.path());

					$location.path('admin');

					console.log($location.path());
				});

			},
			function(failure){
				$scope.$apply(function(){
					$scope.errorMessage = failure;
					console.log($scope.errorMessage)
				})
			}
		);
	};
});