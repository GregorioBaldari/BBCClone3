var mainApp = angular.module('mainApp', [
    'ngRoute',
    'appControllers'
]);

mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/sinergy', {
        templateUrl: 'template/sinergy.html',
        controller: 'sinergyCtrl'
    }).
    when('/traditional', {
        templateUrl: 'template/traditional.html',
        controller: 'traditionalCtrl'
    }).
    otherwise({
        redirectTo: '/sinergy'
    });
}]);

mainApp.service('appVars', function () {
    var socket;
    return {
        getSocket: function () {
            return socket;
        },
        setSocket: function(value) {
            socket = value;
        }
    };
});

mainApp.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io('http://localhost:3000');

  return {
    on: function (eventName, callback) {
        function wrapper() {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply(socket, args);
            });
        }
        
        socket.on(eventName, wrapper);
        
        return function () {
            socket.removeListener(eventName, wrapper);
        };
    },

    emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if(callback) {
                    callback.apply(socket, args);
                }
            });
        });
    }
  };
}]);