musicBox.factory(
    'user',
function(socketSession, $q){
	var loginUri = 'http://www.musicbox.com/user/startSession';

    var user = {};

	user.username = undefined;
    user.password = undefined;
    user.sessionId = undefined;
    user.permissions = undefined;

    var musicBoxes = $q.defer();
    user.musicBoxes = musicBoxes.promise;

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


            // Then authenticate with sessionId
            socketSession.authenticate(username, password, user.sessionId,
                function(permissions){

                    user.username = username;
                    user.password = password;

                    user.permissions = permissions;

                    user.getMusicBoxes();

                    success();

                }, function(){
                    fail();
                }
            );


		}, function(){

            console.log('login failed')
        });
	}

    user.getMusicBoxes = function(){
        if(user.permissions != undefined){

            var ids = user.getMusicBoxIds();;

            ids.then(function(ids){
                var boxes = user.getBoxDetails(ids);

                musicBoxes.resolve(boxes);
            })

            return musicBoxes.promise;
        }
    }

    user.getMusicBoxIds = function(){
        if(user.permissions != undefined){
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
    }

    user.getBoxDetails = function(ids){
        if(user.permissions != undefined){

        var deferred = $q.defer();

            // HACK: this slows performance
            ids = [].concat(ids);

            socketSession.call('http://www.musicbox.com/boxDetails', ids,
                function(result){
                    var boxes = [];
                    for(i in result){
                        var box = result[i].box;
                        box.deviceUri = result[i].uri;

                        boxes.push(box);
                    }

                    deferred.resolve(boxes);
                }, null)

            return deferred.promise;
        }
    }

    user.clearMusicBoxes = function(){
        musicBoxes = $q.defer();
        user.musicBoxes = musicBoxes.promise;
    }

	return user;
});
