// Websocket Module with Socket Session Service. Connects to and manages the
// current socket session

angular.module('webSocket', []).
	provider(
		'socketSession',
	function(){
		var socket = {};
		var connectedCallbacks = [];

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

		// Unsubscribes from the uri given, unhooks the callback that was connected
		// to that Uri
		socket.unsubscribe = function(uri){
			socket.onConnect(function(){
				socket.session.unsubscribe(uri);
			})
		}

		// Socket Connection Method. Starts the Websocket at the socketUri and
		// port given. The success callback is called on a successful websocket
		// connection. The failure callback is called on a failed connection.
		this.connect = function(socketUri, port, success, failure){
			ab.connect(
				"ws://"+socketUri+":"+port,
				function(session){
					socket.session = session;

					for(i in connectedCallbacks)
					{
						connectedCallbacks[i]();
					}

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