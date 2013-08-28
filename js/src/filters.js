musicBox.filter('playPauseIcon', function(){
	return function(playing){
		if(playing)
		{
			return "icon-pause";
		}
		else
		{
			return "icon-play";
		}
	}
});