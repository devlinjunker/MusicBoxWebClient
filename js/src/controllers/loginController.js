musicBox.controller('loginController', function($scope, $http){
	$scope.username = '';
	$scope.password = '';
	
	$scope.errorMessage = '';
	
	$scope.submitLogin = function(){
		$http.post('', {
			user: $scope.username,
			password: $scope.password
		}).
			success(function(data, status, headers, config){
			
		}).
			error(function(data, status, headers, config){
			
		});
	};
});