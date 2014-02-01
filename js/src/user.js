musicBox.factory(
    'user',
function(socketSession, musicBoxSession, $q){
	var loginUri = 'http://www.musicbox.com/user/startSession';

    var user = {};

	user.username = undefined;
    user.password = undefined;
    user.sessionId = undefined;
    user.permissions = undefined;

    var musicBoxes = $q.defer();
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
        if(user.permissions !== undefined){

            var ids = user.getMusicBoxIds();;

            ids.then(function(ids){
                var boxes = user.getBoxDetails(ids);

                boxes.then(function(boxes){
                    console.log('boxes');
                    console.log(boxes);

                    // When we recieve the user's devices, subscribe to all of them
                    for(i in boxes){
                        musicBoxSession.subscribeDevice(boxes[i].deviceUri);
                    }

                    musicBoxSession.addCallback(user.handleMessages);

                    user.musicBoxes = boxes;
                })

                musicBoxes.resolve(boxes);
            })


        }

        return musicBoxes.promise;
    }

    user.getMusicBoxIds = function(){
        if(user.permissions !== undefined){
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
        if(user.permissions !== undefined){

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
        user.musicBoxes = [];
    }

    user.handleMessages = function(topic, event){
        console.log('callback in user')
        console.log(event)
        for(i in musicBoxes){
            if(musicBoxes[i].deviceUri == topic){
                switch(event.command){
                    case "boxConnected":
                        musicBoxes[i].Playing = 1;
                        break;
                    case "boxDisconnected":
                        musicBoxes[i].Playing = 0;
                        break;
                    case "startedTrack":
                        musicBoxes[i].Playing = 2;
                        break;
                    case "playTrack":
                        musicBoxes[i].Playing = 2;
                        break;
                    case "pauseTrack":
                        musicBoxes[i].Playing = 1;
                        break;
                    case "nextTrack":

                        break;

                    case "trackHistory":
                        break;
                    case "startedTrack":
                        break;
                    case "addTrack":
                    case "endOfTrack":
                        break;
                }
            }
        }
    }

	return user;
});
