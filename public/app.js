
var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/allEvents', {
            templateUrl: 'pages/allEvents.html',
            controller: 'controller_index'
        })
        .when('/showDetails/:param', {
            templateUrl: 'pages/showDetails.html',
            controller: 'controller_showDetails'
        })
        .when('/createEvent', {
            templateUrl: 'pages/createEvent.html',
            controller: 'controller_createEvent'
        })
        .otherwise({
            redirectTo: '/allEvents'
        });

}]);



// ----------------------------
// SERVICE
// ----------------------------
myApp.factory('myApp_Service', ['$rootScope',
    function($rootScope) {

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
myApp.controller('controller_index', ['$scope', '$http', 'myApp_Service','$location',
    function($scope, $http, myApp_Service, $location) {

    // get all Events
    $http.get('/events').then(function(response){
        $scope.events = response.data;
        console.log(response.data);
    });

    // go to the

    $scope.createEventPage = function () {
        //window.location = '/createEvent.html';
        $location.path('createEvent');
    };

    $scope.showDetailsPage = function (response) {

        $scope.single_event = response;
        $scope.abc = 'df';

        (function () {
            myApp_Service.setTest('1234');
        })();

        $location.path('showDetails/' + response);

    }

}]);

myApp.controller('controller_createEvent', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

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
            //window.location = '/index.html';
                $location.path('allEvents');
            // } else {
            //     $scope.error = 'Fehler: ' + response.data.error;
            //}
        });


    }


}]);


myApp.controller('controller_showDetails', ['$scope', '$http', 'myApp_Service', '$routeParams',
    function($scope, $http, myApp_Service, $routeParams) {

    // saves the id of the selected event into $scope.param
    $scope.param = $routeParams.param;

    $scope.detailed_name = "1";
    $scope.detailed_type = "";
    $scope.detailed_eventDate = "";
    $scope.detailed_info = "";

    // get the JSON of one single event
    $http.get('/events/'+ $scope.param).then(function(response){
        $scope.detailed_event_object = response.data;
        console.log($scope.detailed_event_object);
        $scope.detailed_name = $scope.detailed_event_object.name;
        $scope.detailed_type = $scope.detailed_event_object.type;
        $scope.detailed_eventDate = $scope.detailed_event_object.eventDate;
        $scope.detailed_info = $scope.detailed_event_object.info;
    });


    $scope.showDetails_2 = function () {

        (function () {
            myApp_Service.getTest(function(data) {
                console.log(data);
            });
        })();

    }

}]);

