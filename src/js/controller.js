var appControllers = angular.module('appControllers', ['ngRoute', 'ui.bootstrap','pageslide-directive']);

appControllers.controller('appCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.model = {
        risk: 1,
        effort: 1,
        complexity: 1,
        size: "Select values above",
        userName: "Anonymous",
        //userId: undefined
    };
    
    //Menu open/close variable
    $scope.checked = false; // This will be binded using the ps-open attribute
    
    $scope.$watch('model.risk', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.sendModel();
        }
    });
    
    $scope.$watch('model.effort', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.sendModel();
        }
    });
    
    $scope.$watch( 'model.complexity', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.sendModel();
        }
    });
    
    $scope.$watch( 'model.userName', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.sendModel();
        }
    });          
                         
    $scope.sendModel = function () {  
        $scope.model.size = $scope.model.risk * ($scope.model.complexity + $scope.model.effort);
        console.log("LOG: Size: " + $scope.model.size);
        socket.emit('updateModel', {
            risk: $scope.model.risk,
            effort: $scope.model.effort,
            complexity: $scope.model.complexity,
            size: $scope.model.size,
            userName: $scope.model.userName,
            //userId: $scope.model.userId
        });
    }
    
    //Open or close the menu
    $scope.toggle = function(){
        $scope.checked = !$scope.checked
    };
    

    //This can be removed. Name is sent now when user modifies data.
    //When remove this callback remove olso the 'ok' btn on view.
    //Keep this if you want to modify the name on real time (Nice to have but not needed
    /*$scope.sendName = function() {
        socket.emit('newUser', {
              userName: appVars.getUserName()
            });
        console.log('Name sent: ' + appVars.getUserName());
    };
    */
    
    //When connection is established make green the connection icon
    socket.on('connect', function (data) {
        console.log("connected");
        $('.online').css('color','limegreen');
    });
 
    //When connection is off make red the connection icon
    socket.on('disconnect', function(){
        console.log('Disconnected');
        $('.online').css('color','red');
    });
    
}]);

