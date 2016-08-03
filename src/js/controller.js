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
    roomName: "",
    roomKey: ''
  };

  $scope.checked = false;   //Menu open/close variable
  $scope.userData = {};
  $scope.connectionStatus = false;

  $scope.room = {};


  $scope.roomConnection = 'off' // Connection to room on or off
  $scope.room.mode = 'option1'; // Default Mode is Effort Only (for now)\
  $scope.room.onLineStatus = 'off';

  //User decides if be connected or not
  // If yes listen for 'roomOpen' eventName
  // and set the room mode
  // freeze the room mode checkbox
  // set the online status to ON

  // Join the Room sending 'entering'
  // check if exists joining event


  // Save form data in the menu
  $scope.saveConnectionData = function () {
    //$scope.toggle();
    if ($scope.roomConnection === 'off') {
      if ($scope.validateField() === true) {
        socket.emit('enterRoom',  $scope.room, function (roomMode) {
          $scope.setOnlineStatus(roomMode);
          $scope.roomConnection = 'on';
          $('input').attr("disabled", true);
        });
      };
    } else {
      socket.emit('userDisconnection');
      $scope.roomConnection = 'off';
      $('input').attr("disabled", false);
    }
  };

  $scope.validateField = function () {
    var temp = 0;
    if ($scope.model.userName === '' || $scope.model.userName === undefined) {
      $("#userName_field").addClass('alert alert-danger');
      temp = temp - 1;
    } else {
      $("#userName_field").removeClass('alert alert-danger');
      temp = temp + 1;
    };
    if ($scope.room.name === '' || $scope.room.name === undefined) {
      $("#room_name_field").addClass('alert alert-danger');
      temp = temp - 1;
    } else {
      $("#room_name_field").removeClass('alert alert-danger');
      temp = temp + 1;
    };
    if ($scope.room.key === '' || $scope.room.key === undefined) {
      $("#room_key_field").addClass('alert alert-danger');
      temp = temp - 1;
    } else {
      $("#room_key_field").removeClass('alert alert-danger');
      temp = temp + 1;
    };

    if(temp === 3 ){
      return true;
    } else {
      return false;
    }
  };

  // If the room is open and successfully enter, we receive the room mode
  // If room Mode is empty, room is not ready. So, pending status
  $scope.setOnlineStatus =  function(roomMode) {
    $scope.room.onLineStatus = 'pending';
    if (roomMode !== '') {
      $scope.room.mode = roomMode;
      $scope.room.onLineStatus = 'on';
      $('.online').css('color', 'limegreen');
      console.log('Entered in room: ' + $scope.room.name);
    } else {
      $('.online').css('color', 'orange');
      console.log('Tried to enter in: ' + $scope.room.name);
    }
  };

  socket.on('refreshRoom', function (roomMode){
    $scope.setOnlineStatus(roomMode.roomMode);
  });

  // When connection is established make green the connection icon
  socket.on('connect', function (data) {
    console.log("Socket Connection Established");
  });

  socket.on('roomClosed', function(){
    $scope.setOnlineStatus("");
  });

  // When connection is off make red the connection icon
  socket.on('disconnect', function () {
    console.log('Disconnected');
    $('.online').css('color', 'red');
  });

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
    switch ($scope.room.mode) {
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
}]);
