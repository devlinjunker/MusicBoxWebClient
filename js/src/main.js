musicBox.
	config(function($httpProvider, socketSessionProvider){
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

        var socketUri = "clientBalencer-394863257.us-west-2.elb.amazonaws.com";
        var socketPort = 8080;

		socketSessionProvider.connect(socketUri, socketPort,
			function(session){
				console.log('connected');
			},
			function(code, reason){
				console.log(code +": "+reason);
			}
		);

	});