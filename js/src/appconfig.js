var musicBox = angular.module('musicBox', ['webSocket', 'ui.bootstrap', 'ngRoute']);

musicBox.filter('reverse',function(){
    return function(items){
        if(!angular.isArray(items)) return false;

        return items.slice().reverse();
    }
})