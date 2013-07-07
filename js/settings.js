var musicBox = {
    settings: {
        socketUri: "ec2-54-218-97-11.us-west-2.compute.amazonaws.com",
        port: 8080
    }
}

var deviceName = "LivingRoom";

var userName = "christopher.vanderschuere@gmail.com";

var channelUri = "http://www.musicbox.com/"+userName+"/"+deviceName;

var EndOfTrack = 1;
var AddedToQueue = 2;
var RemovedFromQueue = 3;
var PausedTrack = 4;
var ResumedTrack = 5;
var StoppedTrack = 6;
var NextTrack = 7;

