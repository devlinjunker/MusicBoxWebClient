musicBox.controller('loginController', function($scope, $http, user){
	$scope.username = '';
	$scope.password = '';
	
	$scope.errorMessage = '';
	
	$scope.submitLogin = function(){
		user.login($scope.username, $scope.password);
		
		// $http.post('', {
			// user: $scope.username,
			// password: $scope.password
		// }).
			// success(function(data, status, headers, config){
			
		// }).
			// error(function(data, status, headers, config){
			
		// });
	};
});