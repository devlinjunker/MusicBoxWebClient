musicBox.controller(
	'loginController',
function($scope, $http, $location, user, musicBoxSession){

	$scope.user = user;

	$scope.errorMessage = undefined;

	user.tryLogin();

	$scope.$watch('user.permissions',function(){
		if(user.permissions !== undefined){
			$location.path('admin');
		}
	});

	$scope.submitLogin = function(){
		var username = $("#login_controller input[name=username]").val().toLowerCase();
		var password = $("#login_controller input[name=password]").val();

		user.login(username, password,
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