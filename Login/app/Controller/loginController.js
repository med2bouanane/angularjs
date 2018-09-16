/**
 * Created by mohamedbouanane on 22/11/14.
 */
angular.module('loginController',[])
.controller('loginController',function($scope,$http){
       $scope.hola = 'Hola';

        $scope.login = function(){

            $http.post('http://192.168.1.138:8080/pfc_server/rest/serviciosR/send',
                {
                    usuario : $scope.usuario,
                    pass:$scope.pass
                },
                {
                    headers:{'Content-Type':'application/json'}
                })
                .success(function(data,status){
                    $scope.hola = data;
                })
                .error(function(data,status){
                    alert("ERROR LOGIN");
                });
        };
    });