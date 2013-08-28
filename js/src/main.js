var musicBox = angular.module('musicBox', ['webSocket']).provider('user', function(){
        var user = {};

        user.name = "christopher.vanderschuere@gmail.com";

        user.myDeviceUriPrefix =  "http://www.musicbox.com/"+user.name+"/";

        user.currentDeviceUri = null;

        user.updateCurrentDeviceUri = function(deviceName){
            user.currentDeviceUri = user.myDeviceUriPrefix + deviceName;
        }

        this.setCurrentDeviceUri = function(deviceName){
            user.currentDeviceUri = user.myDeviceUriPrefix + deviceName;
        }

        this.$get = function(){
            return user;
        }
    }).
	config(function(socketSessionProvider, userProvider){
		var socketUri = "ec2-54-218-97-11.us-west-2.compute.amazonaws.com";
        var socketPort = 8080;

		socketSessionProvider.connect(socketUri, socketPort,
			function(session){
				console.log('connected');
			},
			function(code, reason){
				console.log(code +": "+reason);
			}
		);

		userProvider.setCurrentDeviceUri("Beatles");
	});