/**
 * Created by MBouanane on 12/10/14.
 */
angular.module('EmpleadosController',['EmpleadosFactory'])
    .controller('EmpleadosCtl',['$scope','Empleados',function($scope,Empleados){
    $scope.empleados = Empleados;
}]);