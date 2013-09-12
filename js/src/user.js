musicBox.
	factory('user', function(socketSession){
		var user = {};

		user.name = "christopher.vanderschuere@gmail.com";
        user.password ="test";

        user.sessionId;
        user.permissions;

        user.deviceUriPrefix =  "http://www.musicbox.com/"+user.name+"/";

		user.login = function(username, password){
			var args = {
				username: username,
				password: password
			};

			socketSession.call('http://www.musicbox.com/user/startSession', args, function(result){
				user.sessionId = result.sessionID;

                socketSession.onConnect(function(){
					socketSession.session.authreq(username).then(function(challenge){

                        var passKey = ab.deriveKey(password, JSON.parse(challenge).extra)

						var signature = socketSession.session.authsign(challenge, user.sessionId);

                        console.log('test')
						socketSession.session.auth(signature).then(function(permissions){
							console.log('authenticated!');
                            console.log(permissions);

                            user.permissions = permissions;
						}, function(){
                            console.log('test')
                        });
					});
				});
			}, null);
		}

		return user;
	});
