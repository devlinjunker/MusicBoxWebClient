musicBox.
    provider('user', function(){
        var user = {};

        user.name = "christopher.vanderschuere@gmail.com";

        user.myDeviceUriPrefix =  "http://www.musicbox.com/"+user.name+"/";

        user.currentDeviceUri = null;

        user.updateCurrentDeviceUri = function(deviceName){
            user.currentDeviceUri = user.myDeviceUriPrefix + deviceName;
        }

        this.setCurrentDeviceUri = function(deviceName){
            user.currentDeviceUri = user.myDeviceUriPrefix + deviceName;
        }

        this.$get = function(){
            return user;
        }
    })