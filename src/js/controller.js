var appControllers = angular.module('appControllers', ['ngRoute', 'ui.bootstrap', 'pageslide-directive']);

appControllers.controller('appCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.model = {
        risk: 1,
        effort: 1,
        complexity: 1,
        size: 1,
        connected: "true",
        userName: "Anonymous",
        password: "",
        room: "",
        mode:"option1"
    };
    $scope.userData = {};
    $scope.connectionStatus = false;

    $scope.room = '';

    // Default Mode is Effort Only (for now)
    $scope.roomMode = 'option1';

    //User decides if be connected or not
    // If yes listen for 'roomOpen' eventName
    // and set the room mode
    // freeze the room mode checkbox
    // set the online status to ON

    // Join the Room sending 'entering'
    // check if exists joining event

    $scope.enterRoom = function () {
      socket.emit('enterRoom', $scope.room );
    };

    socket.on('setMode', function (roomMode){
      $scope.roomMode = roomMode;
    });

    socket.on('dashboard_connected', function (data){
      console.log('Dashboard connected in Room: ' + socket.room );
    })

    // Save form data in the menu
    $scope.saveConnectionData = function () {
        $scope.toggle();
        $scope.userData.room = $scope.model.room;
        $scope.userData.userName = $scope.model.userName;
        $scope.userData.password = $scope.model.password;
        socket.emit('joiningRoom',  $scope.userData, function (connectionStatus) {
            $scope.connectionStatus = connectionStatus;
            console.log('Entered in room: ' + $scope.model.room);
            $('.online').css('color', 'limegreen');
        });
        $scope.sendModel();
    };

    //Menu open/close variable
    $scope.checked = false; // This will be binded using the ps-open attribute

    $scope.$watch('model.risk', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.updateStoryPoints();
        }
    });

    $scope.$watch('model.effort', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.updateStoryPoints();
        }
    });

    $scope.$watch('model.complexity', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.updateStoryPoints();
        }
    });

    $scope.updateStoryPoints = function () {
      switch ($scope.model.mode) {
        case 'option1': // Only Effort
          $scope.model.size = $scope.model.effort;
          break;
        case 'option2':// Only Effort and Risk
          $scope.model.size = $scope.model.effort*$scope.model.complexity;
        break;
          case 'option3':// Effort and Risk and Complexity
          $scope.model.size = $scope.model.effort*$scope.model.complexity*$scope.model.risk;
      };
      $scope.sendModel();
    };

    $scope.spike = function () {
        // $scope.model.size = $scope.model.risk * ($scope.model.complexity + $scope.model.effort);
        console.log("LOG: SPIKE: " + $scope.model.size);
        socket.emit('spike', {
            model: $scope.model
        });
    };

    $scope.sendModel = function () {
        // $scope.model.size = $scope.model.risk * ($scope.model.complexity + $scope.model.effort);
        console.log("LOG: Size: " + $scope.model.size);
        socket.emit('updateModel', {
            model: $scope.model
        });
    };

    // Open or close the menu
    $scope.toggle = function () {
        $scope.checked = !$scope.checked;
    };

    // When connection is established make green the connection icon
    socket.on('connect', function (data) {
        console.log("Socket Connection Established");
    });

    socket.on('selectionMode', function (data) {
        console.log("Selection Mode received");
    });

    // When connection is off make red the connection icon
    socket.on('disconnect', function () {
        console.log('Disconnected');
        $('.online').css('color', 'red');
    });

    // When desktop send new Selection Mode update the selection view mode in the app
    socket.on('newMode', function (data) {
      console.log('Changing Selection Mode');
      $scope.model.mode = data.model;
    })

}]);
