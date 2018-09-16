/**
 * Created by Mohamed on 22/03/14.
 */
/*define(['angular'],function(ng){

    var Ctr = function($scope){

        $scope.valorNuevo='';
        $scope.cambio = {valor:$scope.valorNuevo};
    };

    return{Ctr:Ctr};
});
*/
/*
define(['main.angular'], function(app) {
    return app.controller('NavBarController', ['$scope',
        function ($scope) {

            $scope.valorNuevo='';
        }
    ]);
});
*/

define(['angular'], function(angular){
     angular.module( 'myApp', [])
        .controller( 'Controlador',[$scope, function  ($scope) {
            $scope.valorNuevo = '';
        }]);
});