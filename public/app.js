
var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/allEvents', {
            templateUrl: 'allEvents.html',
            controller: 'controller_index'
        })
        .when('/showDetails', {
            templateUrl: 'showDetails.html',
            controller: 'controller_showDetails'
        })
        .otherwise({
            redirectTo: '/'
        });

}]);



// ----------------------------
// SERVICE
// ----------------------------
myApp.factory('myApp_Service', ['$rootScope', function($rootScope) {

    this.events = [];
    $rootScope.selected_event = '';

    this.setTest = function(data) {//function(myFunction) {
        $rootScope.selected_event = data;
        this.events = data;
        console.log($rootScope);
        console.log(this.events);
        //myFunction(this.events);
    };

    this.getTest = function(myFunction) {
        //myFunction($rootScope.selected_event);
        //myFunction('123');
        myFunction(this.events);
    };

    return(this); // !! important
}]);


// ----------------------------
// CONTROLLER
// ----------------------------
myApp.controller('controller_index', ['$scope', '$http', 'myApp_Service', function($scope, $http, myApp_Service) {

    // get all Events
    $http.get('/events').then(function(response){
        $scope.events = response.data;
        console.log(response.data);
    });

    // go to the
    $scope.createEventPage = function () {
        window.location = '/createEvent.html';
    };

    $scope.showDetailsPage = function (response) {


        (function () {
            myApp_Service.setTest('1234');
        })();


        //window.location = '/showDetails.html';
        /*
        $scope.single_event = response;
        $scope.abc = 'df';
        /*
         // get the JSON of one single event
         $http.get('/events/'+ response).then(function(response){
         $rootScope.event_id = response.data;
         console.log($rootScope.event_id);
         });

        // go to the detailed page
        window.location = '/showDetails.html';
        */
    }

}]);

myApp.controller('controller_createEvent', ['$scope', '$http', function($scope, $http) {
    $scope.name = "";
    $scope.type = "";
    $scope.eventDate = "";
    $scope.info = "";
    $scope.error="";

    $scope.saveEvent = function () {

        console.log("Hello 1");
        var jsonTest = JSON.stringify({ name: $scope.name, type: $scope.type, eventDate: $scope.eventDate, info: $scope.info});
        console.log(jsonTest);

        $http.post('/events', jsonTest).then(function (response) {
            console.log("Hello 2");
            console.log('RegSuc: ' + response.data);
            //   if (response.data.success) {
            window.location = '/index.html';
            // } else {
            //     $scope.error = 'Fehler: ' + response.data.error;
            //}
        });


    }


}]);


myApp.controller('controller_showDetails', ['$scope', '$http', 'myApp_Service', function($scope, $http, myApp_Service) {

    $scope.showDetails_2 = function () {

        (function () {
            myApp_Service.getTest(function(data) {
                console.log(data);
            });
        })();

    }

}]);

