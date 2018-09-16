/**
 * Created by MBouanane on 12/10/14.
 */
angular.module('TareasController',['TareasFactory'])
.controller('TareasCtl',['$scope','Tareas',function($scope,Tareas){
    $scope.tareas = Tareas;
}]);