angular.module('loginController', [])
.controller('loginController', function ($scope, $http) {
    $scope.login = function () {
        $http.post('Login2',
            {
                usuario: $scope.usuario,
                pass: $scope.pass
            }
            ,
            {
                headers: { 'Content-Type': 'application/json' }
            }
            )
        .success(function (data, status) {
            $scope.bienvenido = 'Bienvenue';
            $scope.data = data;
        })
        .error(function (data, status) {
            alert("ERROR");
        });
    };
});