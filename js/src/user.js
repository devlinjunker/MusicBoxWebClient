musicBox.
	factory('user', function(socketSession){
		var user = {};
		
		user.name = "christopher.vanderschuere@gmail.com";
        user.password ="test";

        user.deviceUriPrefix =  "http://www.musicbox.com/"+user.name+"/";

		user.login = function(username, password){
			var args = {
				username: username,
				password: password
			};
			
			socketSession.call('uri', args, function(result){
				var sessionId = result.sessionId;
				socketSession.onConnect(function(){
					socketSession.session.authreq(username).then(function(challenge){
						var signature = socket.session.authsign(challenge, password);
						
						socketSession.session.auth(signature).then(function(){
							console.log('authenticated!');
						})
					});
				});
			}, null); 
		}
		
		return user;
	});
