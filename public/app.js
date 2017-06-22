
var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'controller_login',
            access: {restricted: false}
        })
        .when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'controller_register',
            access: {restricted: false}
        })
        .when('/allEvents', {
            templateUrl: 'pages/allEvents.html',
            controller: 'controller_index',
            access: {restricted: true}
        })
        .when('/showDetails/:param', {
            templateUrl: 'pages/showDetails.html',
            controller: 'controller_showDetails',
            access: {restricted: true}
        })
        .when('/createEvent', {
            templateUrl: 'pages/createEvent.html',
            controller: 'controller_createEvent',
            access: {restricted: true}
        })
        .when('/editEvent/:param', {
            templateUrl: 'pages/editEvent.html',
            controller: 'controller_editEvent',
            access: {restricted: true}
        })
        .when('/addMatch/:param', {
            templateUrl: 'pages/addMatch.html',
            controller: 'controller_addMatch',
            access: {restricted: true}
        })
        .when('/addDriver/:param', {
            templateUrl: 'pages/addDriver.html',
            controller: 'controller_addMatch',
            access: {restricted: true}
        })
        .when('/info', {
            templateUrl: 'pages/info.html',
            controller: 'controller_index',
            access: {restricted: true}
        })
        .otherwise({
            redirectTo: '/allEvents'
        });

}]);

myApp.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            if (AuthService.isLoggedIn() === false && $location.path() != '/login' && $location.path() != '/register') {
                $location.path('/login');
            }
        });
});

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

myApp.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register
    });

    function isLoggedIn() {
        if(user) {
            return true;
        } else {
            return false;
        }
    }

    function getUserStatus() {
        return user;
    }

    function login(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/accounts/login',
            {username: username, password: password})
            .then(
                // handle success
                function (data, status) {
                    if(data.status === 200){
                        user = true;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                },
                // handle error
                function (data) {
                    deferred.reject();
                }
            );

        // return promise object
        return deferred.promise;

    }

    function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/accounts/logout')
            .then(
                // handle success
                function (data) {
                    user = false;
                    deferred.resolve();
                },
                // handle error
                function (data) {
                    user = false;
                    deferred.reject();
                }
            );

        // return promise object
        return deferred.promise;

    }

    function register(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/accounts/register',
            {username: username, password: password})
            .then(
                // handle success
                function (data, status) {
                    if(data.status === 200){
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                },
                // handle error
                function (data) {
                    deferred.reject();
                }
            );

        // return promise object
        return deferred.promise;

    }


}]);

// ----------------------------
// CONTROLLER
// ----------------------------
myApp.controller('controller_index', ['$scope', '$http', 'myApp_Service','$location', 'AuthService',
    function($scope, $http, myApp_Service, $location, AuthService) {

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
    };

    $scope.logout = function () {
        // call logout from service
        AuthService.logout()
            .then(function () {
                $location.path('/');
            });

    };

    $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn() == true
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

myApp.controller('controller_login', ['$scope', '$http', 'myApp_Service', '$routeParams', '$location', 'AuthService',
    function($scope, $http, myApp_Service, $routeParams, $location, AuthService) {

        $scope.login = function () {

            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
            // handle success
                .then(function () {
                    $location.path('#/allEvents');
                    $scope.disabled = false;
                    $scope.loginForm = {};
                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });
        };


    }]);

myApp.controller('controller_register', ['$scope', '$http', 'myApp_Service', '$routeParams', '$location', 'AuthService',
    function($scope, $http, myApp_Service, $routeParams, $location, AuthService) {

        $scope.register = function () {

            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call register from service
            AuthService.register($scope.registerForm.username, $scope.registerForm.password)
            // handle success
                .then(function () {
                    $location.path('#/login');
                    $scope.disabled = false;
                    $scope.registerForm = {};
                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Benutzer existiert bereits";
                    $scope.disabled = false;
                    $scope.registerForm = {};
                });
        };
    }]);
