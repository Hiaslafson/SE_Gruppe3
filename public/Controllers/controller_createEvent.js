/**
 * Created by MatthiasW on 20.04.2017.
 */
var myApp = angular.module('myApp', []);
myApp.controller('createEvent', ['$scope', '$http', function($scope, $http) {
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