var websocket = angular.module('webSocket', []);

websocket.
    factory('socket', function(){
        var socket = {};
        socket.connectedCallbacks = [];

        socket.onConnect = function(callback){
            if(socket.session != null && socket.session != undefined)
            {
                callback();
            }
            else
            {
                socket.connectedCallbacks.push(callback);
            }
        }

        socket.catchUp = function(){
            for(i in socket.connectedCallbacks)
            {
                socket.connectedCallbacks[i]();
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

        return socket;
    });

websocket.
    provider('socketSession', function(socket){

        var socket = new socket();

        this.connect = function(socketUri, port, success, failure){
            ab.connect(
                "ws://"+socketUri+":"+port,
                function(session){
                    socket.session = session;

                    socket.catchUp();

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