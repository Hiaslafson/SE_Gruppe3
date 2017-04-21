/**
 * Created by MatthiasW on 20.04.2017.
 */


var myApp = angular.module('myApp', []);
myApp.controller('appctrl', ['$scope', '$http', function($scope, $http) {


    console.log("Hello World from controller");

    $http.get('/events').then(function(response){
        console.log("i got the data");
        $scope.events = response.data;
        console.log(response.data);


    });

    $scope.createEvent = function () {

                window.location = '/createEvent.html';


    }

    $scope.showDetails = function (response) {

        console.log(response);


        $http.get('/events/'+ response).then(function(response){
            console.log("i got the data");
            $scope.events = response.data;
            console.log(response.data);


        });

        //window.location = '/showDetails.html';



    }


}]);