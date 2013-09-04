angular.module('webSocket', []).
	provider('socketSession', function(){
		var socket = {};
		var connectedCallbacks = [];

		socket.onConnect = function(callback){
			if(socket.session != null && socket.session != undefined)
			{
				callback();
			}
			else
			{
				connectedCallbacks.push(callback);
			}
		}

		socket.subscribe = function(uri, callback){
			socket.onConnect(function(){
				socket.session.subscribe(uri, callback);
			});
		}

		socket.publish = function(channelUri, command, excludeMe){
			socket.onConnect(function(){
				socket.session.publish(channelUri, command, excludeMe);
			});
		}

		socket.call = function(rpcUri, args, success, failure){
			socket.onConnect(function(){
				socket.session.call(rpcUri, args, success, failure);
			});
		}

		socket.unsubscribe = function(uri){
			console.log(uri);
			socket.onConnect(function(){
				socket.session.unsubscribe(uri);
			})
		}




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

		this.$get = function(){
			return socket;
		}

	});