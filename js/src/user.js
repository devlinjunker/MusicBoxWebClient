musicBox.factory(
    'user',
function(socketSession, $q){
	var loginUri = 'http://www.musicbox.com/user/startSession';

    var user = {};

	user.username = undefined;
    user.password = undefined;
    user.sessionId = undefined;
    user.permissions = undefined;

    user.musicBoxes = [];

    // User Authentication
	user.login = function(username, password, success, fail){
        var args = {
			username: username,
			password: password
		};

        // call the startSession RPC to retrieve the sessionID
		socketSession.call(loginUri, args, function(result){
			// set Session Id from RPC return
            user.sessionId = result.sessionID;

            console.log(result.sessionID)

            // Start Authenticating the socket with the sessionID
            socketSession.onConnect(function(){
				socketSession.session.authreq(username).then(function(challenge){

                    var passKey = ab.deriveKey(password, JSON.parse(challenge).extra)

					user.signature = socketSession.session.authsign(challenge, user.sessionId);

					socketSession.session.auth(user.signature).then(function(permissions){
						console.log('authenticated!');
                        console.log(permissions);

                        // Set User Information
                        user.username = username;
                        user.password = password;
                        user.permissions = permissions;

                        user.updateMusicBoxes();

                        if(success != null && success != undefined)
                            success();
					}, function(){
                        console.log('authentication failed');

                        if(fail != null && fail != undefined)
                            fail();
                    });
				});
			});
		}, function(){

            console.log('rpc failed')
        });
	}

    user.updateMusicBoxes = function(success, fail){
        console.log('updating boxes')

        var ids = user.getMusicBoxIds();

        ids.then(function(ids){
            user.musicBoxes = user.getBoxDetails(ids);
        });
    }

    user.getMusicBoxIds = function(){
        var deferred = $q.defer();

        socketSession.call('http://www.musicbox.com/players', [],
            function(result){
                var ids = []
                for(i in result){
                    var id = result[i];

                    ids.push(id);
                }

                deferred.resolve(ids);
            }, null);

        return deferred.promise;
    }

    user.getBoxDetails = function(ids){
        var deferred = $q.defer();

        // HACK: this slows performance
        ids = [].concat(ids);

        socketSession.call('http://www.musicbox.com/boxDetails', ids,
            function(result){
                var boxes = [];
                for(i in result){
                    boxes.push(result[i]);
                }

                deferred.resolve(boxes);
            }, null)

        return deferred.promise;
    }

    user.clearMusicBoxes = function(){
        user.musicBoxes = [];
    }




	return user;
});
