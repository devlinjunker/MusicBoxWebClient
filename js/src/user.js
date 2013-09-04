musicBox.
    provider('user', function(){
        var user = {};

        user.name = "christopher.vanderschuere@gmail.com";
        user.password ="test";

        user.deviceUriPrefix =  "http://www.musicbox.com/"+user.name+"/";

        this.$get = function(){
            return user;
        }
    })