musicBox.factory(
    'user',
function(socketSession, musicBoxSession, device, $q, $cookies){
	var loginUri = 'http://www.musicbox.com/user/startSession';

    var user = {};

	user.username = undefined;
    user.password = undefined;
//    user.sessionId = undefined;
    user.permissions = undefined;

    user.musicBoxes = $q.defer();

    user.devices = [];

    /*
     * User authentication function
     * TODO: STILL NEED TO ENCRYPT THE PASSWORD
     */
	user.login = function(username, password, success, fail){
        var args = {
			username: username,
			password: password
		};

        // call the startSession RPC to retrieve the sessionID
		socketSession.call(loginUri, args, function(result){

            if(result.sessionID !== undefined){
                $cookies.username = username;
                $cookies.sessionID = result.sessionID;
            }
            // set Session Id from RPC return
   //         user.sessionId = result.sessionID;


            // Then authenticate with sessionId
            user.authenticate(username, result.sessionID);


		}, function(message){
            console.log('fail')
            fail(message.desc);
        });
	}

    user.authenticate = function(username, sessionID){
        socketSession.authenticate(username, sessionID,
            function(permissions){

                user.username = username;

                user.permissions = permissions;

                user.getDevices();

                success();

                return;

            }, function(message){
                fail(message.desc);
            }
        );
    }

    user.logout = function(){
        socketSession.deauthenticate();

        $cookies.username = undefined;
        $cookies.sessionId = undefined;

        user.username = undefined;
        user.sessionId = undefined;
        user.permissions = undefined;

        user.clearMusicBoxes();

        musicBoxSession.currentDevice == undefined;
    }

    user.getDevices = function(){
        user.getMusicBoxes().then(function(boxes){
            for(i in boxes){
                console.log(boxes[i])
                user.devices.push( new device(boxes[i]) );
            }
        });
    }

    /*
     * Get the Users Music Boxes and save them in the user object
     */
    user.getMusicBoxes = function(){
        if(user.permissions !== undefined){

            var ids = user.getMusicBoxIds();;

            ids.then(function(ids){
                var boxes = user.getBoxDetails(ids);

                boxes.then(function(boxes){
                    // When we recieve the user's devices, subscribe to all of them
                    for(i in boxes){
                        musicBoxSession.subscribeDevice(boxes[i].deviceUri);
                    }

                    user.musicBoxes = boxes;
                })

                user.musicBoxes.resolve(boxes);
            })


        }

        return user.musicBoxes.promise;
    }

    /*
     * Helper function to request the Box Ids of the users boxes
     */
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

    /*
     * Helper function to request the box details of the specified box IDs
     */
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

    /*
     * For logout, removes the devices from usable memory
     */
    user.clearMusicBoxes = function(){
        user.devices = [];
        user.musicBoxes = $q.defer();
    }

    /*
     * Handler to watch inactive sockets and keep boxes up to date
     */
    user.handleMessages = function(topic, event){
        for(i in user.devices){
            if(user.devices[i].deviceUri == topic){
                switch(event.command){
                    case "boxConnected":
                        user.devices[i].state = 1;
                        break;
                    case "boxDisconnected":
                        user.devices[i].state = 0;
                        break;
                    case "startedTrack":
                        user.devices[i].addTrack(event.data.track);
                        user.devices[i].nextTrack();
                        user.devices[i].state = 2;
                        break;
                    case "playTrack":
                        user.devices[i].state = 2;
                        break;
                    case "pauseTrack":
                        user.devices[i].state = 1;
                        break;
                    case "nextTrack":
                    case "endOfTrack":
                        user.devices[i].nextTrack();
                        break;
                    case "addTrack":
                        for(i in event.data){
                            user.devices[i].addTrack(event.data[i]);
                        }
                        break;
                }
            }
        }
    }

    musicBoxSession.addCallback(user.handleMessages);

    if($cookies.username !== undefined && $cookies.sessionID !== undefined){
        user.authenticate($cookies.username, $cookies.sessionID);
    }

	return user;
});
