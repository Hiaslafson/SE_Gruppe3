
var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/login', {
            templateUrl: 'pages/login.html'
        })
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
        .when('/editEvent/:param', {
            templateUrl: 'pages/editEvent.html',
            controller: 'controller_editEvent'
        })
        .when('/addMatch/:param', {
            templateUrl: 'pages/addMatch.html',
            controller: 'controller_addMatch'
        })
        .when('/addDriver/:param', {
            templateUrl: 'pages/addDriver.html',
            controller: 'controller_addMatch'
        })
        .when('/info', {
            templateUrl: 'pages/info.html',
            controller: 'controller_index'
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

        console.log("Save new event: 1");
        var jsonTest = JSON.stringify({ name: $scope.name, type: $scope.type, eventDate: $scope.eventDate, info: $scope.info});
        console.log(jsonTest);

        $http.post('/events', jsonTest).then(function (response) {
            console.log("Save new event: 2");
            console.log('RegSuc: ' + response.data);
                $location.path('allEvents');
         });
    }
}]);

myApp.controller('controller_editEvent', ['$scope', '$http', 'myApp_Service', '$routeParams', '$location',
    function($scope, $http, myApp_Service, $routeParams, $location) {

        // saves the id of the selected event into $scope.param
        $scope.param = $routeParams.param;

        $scope.detailed_name = "1";
        $scope.detailed_type = "";
        $scope.detailed_eventDate = "";
        $scope.detailed_info = "";
        $scope.detailed_matches ="";

        // get the JSON of one sin'$location'gle event
        $http.get('/events/'+ $scope.param).then(function(response){
            console.log('get PARAM: ' + $scope.param);
            $scope.detailed_event_object = response.data;
          //  console.log($scope.detailed_event_object);
            $scope.detailed_name = $scope.detailed_event_object.name;
            $scope.detailed_type = $scope.detailed_event_object.type;
            $scope.detailed_eventDate = $scope.detailed_event_object.eventDate;
            $scope.detailed_info = $scope.detailed_event_object.info;

        });

        $scope.saveEditEvent = function () {

            console.log("Save edit new event: 1");
            var jsonTest = JSON.stringify({ name: $scope.detailed_name, type: $scope.detailed_type, eventDate: $scope.detailed_eventDate, info: $scope.detailed_info });
            console.log(jsonTest);

            $http.put('/events/' + $scope.param, jsonTest).then(function (response) {
                console.log("Save new event: 2");
                console.log('RegSuc: ' + response.data);
                $location.path('showDetails');
            });
        }
}]);


myApp.controller('controller_showDetails', ['$scope', '$http', 'myApp_Service', '$routeParams', '$location',
    function($scope, $http, myApp_Service, $routeParams, $location) {

    // saves the id of the selected event into $scope.param
    $scope.param = $routeParams.param;

    $scope.detailed_name = "1";
    $scope.detailed_type = "";
    $scope.detailed_eventDate = "";
    $scope.detailed_info = "";
    $scope.detailed_matches ="";

    // get the JSON of one single event
    $http.get('/events/'+ $scope.param).then(function(response){
        console.log('get event: ' + $scope.param);
        $scope.detailed_event_object = response.data;
        console.log($scope.detailed_event_object);
        $scope.detailed_name = $scope.detailed_event_object.name;
        $scope.detailed_type = $scope.detailed_event_object.type;
        $scope.detailed_eventDate = $scope.detailed_event_object.eventDate;
        $scope.detailed_info = $scope.detailed_event_object.info;

        $scope.detailed_matches = $scope.detailed_event_object.matches;
        $scope.detailed_points = $scope.detailed_event_object.points;
    });

    $scope.delete_selected_match = function(response,team1, team2, result1, result2) {
        console.log('delete match: ' + response);
        console.log('DELETE: match team1: ' + response.team1);
        console.log('from event: ' + $scope.param);
        var jsonTest = JSON.stringify({ eventId: $scope.param, team1: team1, team2: team2, result1: result1, result2: result2});
        console.log('delete json: ' + jsonTest);

        $http.post('/events/' + response + '/deleteMatches', jsonTest).then(function(response){

                console.log('success');
                window.location.reload();
            } ,
            function (response) {
                // this function handles error
                console.log('delete match error:' + response.data);
            });
    };

    $scope.save_selected_match = function (id, team1, team2, result1, result2) {


       var jsonTest = JSON.stringify({ team1: team1, team2: team2, result1: result1, result2: result2, eventId: $scope.param});
        console.log(jsonTest);

        $http.put('/events/' + id + '/matches/', jsonTest).then(function (response) {
            console.log("Save new Match");
            console.log('RegSuc: ' + response.data);
            window.location.reload();
        });
    };

   $scope.addMatch = function () {
       console.log('add Match: ' + $scope.param);
       if($scope.detailed_type == "Skifahren" || $scope.detailed_type=="Formel1"){
           $location.path('addDriver/' + $scope.param);
       }else{
           $location.path('addMatch/' + $scope.param);
       }

    };

    $scope.delete_selected_event = function() {

        console.log('delete event: ' + $scope.param);
        $http.delete('/events/' + $scope.param).then(function(response){

            console.log('success');
            $location.path('allEvents');
        } ,
        function (response) {
        // this function handles error
            console.error('error delete match:' + response);
        });
    };

    $scope.edit_selected_event = function() {

        console.log('edit PARAM: ' + $scope.param);
        $location.path('editEvent/' + $scope.param);

    };

}]);

myApp.controller('controller_addMatch', ['$scope', '$http', 'myApp_Service', '$routeParams', '$location',
    function($scope, $http, myApp_Service, $routeParams, $location) {

        // saves the id of the selected event into $scope.param
        $scope.param = $routeParams.param;

        $scope.team1 = "";
        $scope.team2 = "";
        $scope.result1 = "";
        $scope.result2 = "";
        $scope.error="";

        $scope.saveMatch = function () {

            console.log("Save new event: 1");
            var jsonTest = JSON.stringify({ team1: $scope.match.team1, team2: $scope.match.team2, result1: $scope.match.result1, result2: $scope.match.result2});
            console.log(jsonTest);

            $http.post('/events/' + $scope.param + '/matches', jsonTest).then(function (response) {
                console.log("Save new event: 2");
                console.log('RegSuc: ' + response.data);
                $location.path('showDetails/' + $scope.param);

            });
        };
    }]);

