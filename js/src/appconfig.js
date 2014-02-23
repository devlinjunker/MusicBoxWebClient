var musicBox = angular.module('musicBox', ['webSocket', 'ui.bootstrap', 'ngRoute', 'ngCookies']);
musicBox.constant("routePrefix", "/");
musicBox.constant("DEVICE_OFFLINE", 0);
musicBox.constant("DEVICE_PAUSED", 1);
musicBox.constant("DEVICE_PLAYING", 2);