

var myApp = angular.module('myApp', []);
myApp.controller('controller_showDetails', ['$scope', '$http', function($scope, $http) {

    console.log('test');
    console.log($scope.single_event);
    console.log($scope.events);

    $scope.showDetails_2 = function () {

        console.log("Hello 1 test1235l353");

        $http.get('/events/'+ response).then(function(response){
            console.log("i got the data");
            $scope.events = response.data;
            console.log(response.data);
        });
    }

}]);

