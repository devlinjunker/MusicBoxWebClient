musicBox.factory(
    'user',
function(socketSession, musicBoxSession, device, $q, $cookies, $window){
	var loginUri = 'http://www.musicbox.com/user/startSession';

    var user = {};

	user.username = undefined;

    user.permissions = undefined;

    user.musicBoxes = $q.defer();
	user.authenticating = undefined;

    user.devices = [];

    user.tryLogin = function(){
		var ret = $q.defer();
		
		if(user.permissions === undefined){
			var username = user.getStoredUsername();
			var sessId = user.getStoredSessionID();

			if(username !== undefined && username!== null &&
            	sessId !== undefined && sessId !== null ){
           		
				user.authenticate(username, sessId).then(function(){
					ret.resolve();
					console.log('reconnected')
				},function(){
			   	 	ret.reject();
                	console.log('reconnect with sessionId failed');
           	 	});
        	}else{
        		ret.reject();
        	}
		}else{
			ret.resolve();
		}
		
		return ret.promise;
    }

    user.getStoredUsername = function(){
        if($window.localStorage && $window.localStorage.getItem('username') !== undefined){
            return $window.localStorage.getItem('username');
        }else if($cookies.username !== undefined){
            return $cookies.username;
        }else{
            return undefined;
        }
    }

    user.getStoredSessionID = function(){
        if($window.localStorage && $window.localStorage.getItem('sessionID') !== undefined){
            return $window.localStorage.getItem('sessionID');
        }else if($cookies.sessionID !== undefined){
            return $cookies.sessionID;
        }else{
            return undefined;
        }
    }

    user.setStoredUsername = function(username){
        if($window.localStorage !== undefined){
            $window.localStorage.setItem('username', username);
        }else{
            $cookies.username = username;
        }
    }

    user.setStoredSessionID = function(id){
        if($window.localStorage !== undefined){
            $window.localStorage.setItem('sessionID', id);
        }else{
            $cookies.sessionID = id;
        }
    }

    user.clearStoredUsernameAndID = function(){
        if($window.localStorage){
            $window.localStorage.clear();
        }else{
            $cookies.username = undefined;
            $cookies.sessionID = undefined;
        }
    }

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

            // set Session Id from RPC return
            if(result.sessionID !== undefined){
                user.setStoredUsername(username);
                user.setStoredSessionID(result.sessionID);
            }

            // Then authenticate with sessionId
            user.authenticate(username, result.sessionID, success, function(){
                console.log('fail authenticate');
            });


		}, function(message){
            console.log('fail')
            fail(message.desc);
        });
	}

    user.authenticate = function(username, sessionID, success, fail){
		if(user.authenticating == undefined){
			user.authenticating = $q.defer();
		
			socketSession.authenticate(username, sessionID,
	            function(permissions){

					if(musicBoxSession.getCurrentDevice() != undefined){
						musicBoxSession.unsubscribeDevice(musicBoxSession.getCurrentDevice().deviceUri);
					}
					
	                user.username = username;

	                user.permissions = permissions;

	                user.getDevices();

					user.authenticating.resolve();

	                success();

	                return;

	            }, function(message){
					user.authenticating.reject();
	                fail(message.desc);
	            }
	        );
		}
		
		return user.authenticating.promise;
    }

    user.logout = function(){
        socketSession.deauthenticate();

        user.clearStoredUsernameAndID()

        user.username = undefined;
        user.sessionId = undefined;
        user.permissions = undefined;
		user.authenticating = undefined;

        user.clearMusicBoxes();

        musicBoxSession.setCurrentDevice(undefined);

    }

    user.getDevices = function(){
        var promise = user.getMusicBoxes();
		
		promise.then(function(boxes){
            if(user.devices.length != 0){
            	user.devices = [];
            }
			
			for(i in boxes){
                console.log(boxes[i])
                user.devices.push( new device(boxes[i]) );
            }
        });
		
		return promise;
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
                    // When we recieve the user's devices, subscribe to all of them, we'll add them to the device list in getDevices
                    for(i in boxes){
                        musicBoxSession.subscribeDevice(boxes[i].deviceUri);
                    }
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
						console.log('test')

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

	user.ownsDevice = function(device){
		var ret = false;

		for(i in user.devices){
			if(user.devices[i].ID == device.ID){
				ret = true;
			}
		}
		
		return ret;
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
						if(event.data.track.ProviderID.indexOf("spotify") < 0){
							user.devices[i].addTrack(event.data.track);
							user.devices[i].nextTrack();
						}else{
							user.devices[i].nextTrack();
						}
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
    user.tryLogin();

	return user;
});
