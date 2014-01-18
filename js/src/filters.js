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

musicBox.filter('volumeIcon', function(){
	return function(volume){
		if(volume >= 50){
			return "icon-volume-up";
		}
		else if (volume > 0){
			return "icon-volume-down";
		}
		else{
			return "icon-volume-off";
		}
	}
})

musicBox.filter('reverse',function(){
    return function(items){
        if(!angular.isArray(items)) return false;

        return items.slice().reverse();
    }
})