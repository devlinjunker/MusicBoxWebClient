musicBox.
	config(function($httpProvider, socketSessionProvider, $routeProvider, $locationProvider, routePrefix){
		// Removed this to allow AJAX requests
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // URI and Port of Websocket Connection
        //var socketUri = "ClientBalencer-394863257.us-west-2.elb.amazonaws.com";
        var socketUri = "ec2-54-201-63-215.us-west-2.compute.amazonaws.com";
        var socketPort = 8080;

        // Connect to the websocket
		socketSessionProvider.connect(socketUri, socketPort,
			function(session){
				console.log('connected');
			},
			function(code, reason){
                console.log('test')
				console.log(code +": "+reason);
			}
		);

        console.log(routePrefix)

        // Set up route provider to handle page changes
        $routeProvider.
            when(routePrefix + 'home', {
                // controller: "queueController",
                // templateUrl: "template/queue.html",
                redirectTo: "login"
            }).
            when(routePrefix + 'login', {
                controller: "loginController",
                templateUrl: "template/login.html",
            }).
            when(routePrefix + 'admin', {
                controller: "adminController",
                templateUrl: "template/admin.html",
            }).
            when(routePrefix + 'm', {
                controller: "mobileController",
                templateUrl: "template/mobile.html",
            }).
            otherwise({redirectTo: routePrefix + "home"});

        //$locationProvider.html5Mode(true);

	// When ready...
	window.addEventListener("load",function() {
		// Set a timeout...
		setTimeout(function(){
			// Hide the address bar!
			window.scrollTo(0, 1);
		}, 0);
	});
});
