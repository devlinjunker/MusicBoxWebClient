musicBox.
	config(function($httpProvider, socketSessionProvider, $routeProvider, $locationProvider, routePrefix){
		// Removed this to allow AJAX requests
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // URI and Port of Websocket Connection
        var socketUri = "ClientBalencer-394863257.us-west-2.elb.amazonaws.com";
        var socketPort = 8080;

        // Connect to the websocket
		socketSessionProvider.connect(socketUri, socketPort,
			function(session){
				console.log('connected');
			},
			function(code, reason){
				console.log(code +": "+reason);
			}
		);

        console.log(routePrefix)

        // Set up route provider to handle page changes
        $routeProvider.
            when(routePrefix + '/musicbox/', {
                controller: "queueController",
                templateUrl: "/musicbox/template/queue.html",
            }).
            when(routePrefix + '/musicbox/login', {
                controller: "loginController",
                templateUrl: "/musicbox/template/login.html",
            }).
            when(routePrefix + '/musicbox/admin', {
                controller: "adminController",
                templateUrl: "/musicbox/template/admin.html",
                resolve: function(){
                    alert('test');
                },
            }).
            otherwise({redirectTo: routePrefix + "/musicbox/"});

        $locationProvider.html5Mode(true);
	});