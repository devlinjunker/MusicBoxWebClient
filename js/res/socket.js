// Websocket Module with Socket Session Service. Connects to and manages the
// current socket session

angular.module('webSocket', []).
	provider(
		'socketSession',
	function(){
		var socket = {};
		var connectedCallbacks = [];


		// Hides the ugliness of authenticating the socket behind a simple call
		// Still need to get session Id though.
		socket.authenticate = function(username, password, sessionId, success, fail){
			console.log('authenticating..')

			// Start Authenticating the socket with the sessionID
            socket.onConnect(function(){
				socket.session.authreq(username).then(function(challenge){

                    var passKey = ab.deriveKey(password,
                    							JSON.parse(challenge).extra)

					var signature = socket.session.authsign(challenge,
																sessionId);

					socket.session.auth(signature).then(function(permissions){
						console.log('authenticated!');
                        console.log(permissions);

                        if(success != null && success != undefined){
                            success(permissions);
                        }

					}, function(){
                        console.log('authentication failed');

                        if(fail != null && fail != undefined)
                            fail();
                    });
				});
			});
		}

		// Calls the callback once the socket is connected, unless it is already
		// connected, and it is called immediately
		socket.onConnect = function(callback){
			if(callback != null && callback != undefined){
				if(socket.session != null && socket.session != undefined)
				{
					callback();
				}
				else
				{
					connectedCallbacks.push(callback);
				}
			}
		}

		// Subscribes to the uri given. The callback given will be called when
		// a message is recieved on that channel uri
		socket.subscribe = function(uri, callback){
			socket.onConnect(function(){
				socket.session.subscribe(uri, callback);
			});
		}

		// Publishes the command to the channelUri given, if exclude me is set
		// the message will not be recieved at this end of the socket
		socket.publish = function(channelUri, command, excludeMe){
			console.log([channelUri, command, excludeMe])
			socket.onConnect(function(){
				socket.session.publish(channelUri, command, excludeMe);
			});
		}

		// Calls the RPC at the rpcUri given with the args given. The success
		// callback will be called if the RPC call is sucessful, the failure
		// callback will be called if it fails.
		socket.call = function(rpcUri, args, success, failure){
			socket.onConnect(function(){
				socket.session.call(rpcUri, args).then(success, failure);
			});
		}

		// Unsubscribes from the uri given, unhooks the callback that was
		// connected to that Uri
		socket.unsubscribe = function(uri){
			socket.onConnect(function(){
				socket.session.unsubscribe(uri);
			})
		}


		// TODO: Set flag to keep this going
		// Ping Socket to keep Session Alive
		socket.ping = function(){
			if(socket.session != undefined){
				socket.call("PING", []);

				setTimeout(socket.ping, 29000);
			}
		}

		// Socket Connection Method. Starts the Websocket at the socketUri and
		// port given.
		// Called at page load to start the websocket connection.
		// Success callback is called on a successful websocket (start app)
		// Failure callback is called on a failed connection. (fail to start)
		this.connect = function(socketUri, port, success, failure){
			ab.connect(
				"ws://"+socketUri+":"+port,
				function(session){
					socket.session = session;

					for(i in connectedCallbacks)
					{
						connectedCallbacks[i]();
					}

					setTimeout(socket.ping, 29000);

					if(success != null && success != undefined)
						success(session);
				},
				function(code, reason){
					if(failure != null && failure != undefined)
						failure(code, reason);
				}
			)
		};

		// Angular Factory Method
		this.$get = function(){
			return socket;
		}

	});