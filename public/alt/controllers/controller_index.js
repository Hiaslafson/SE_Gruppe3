/**
 * Created by MatthiasW on 20.04.2017.
 */


var myApp = angular.module('myApp', []);

myApp.controller('controller_index', ['$scope', '$http', function($scope, $http) {

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

        $scope.single_event = response;
        $scope.abc = 'df';
        /*
        // get the JSON of one single event
        $http.get('/events/'+ response).then(function(response){
            $rootScope.event_id = response.data;
            console.log($rootScope.event_id);
        });
        */
        // go to the detailed page
        window.location = '/showDetails.html';
    }

}]);