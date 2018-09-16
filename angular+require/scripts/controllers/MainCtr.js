/**
 * Created by Mohamed on 22/03/14.
 */
define(['app','Fabrica'],function(app,fabrica){

     app.controller('MainCtr',['$scope','Dato',function($scope,Dato){

         $scope.tareas=[{texto:'Tarea 1',hecho:true},{texto:'Tarea 2',hecho:false}];
         $scope.message = Dato;
    }]);

    app.controller('Controller2',['$scope',function($scope){

        $scope.message2='';
    }]);

    app.controller('CtrTareas',['$scope',function($scope){

        $scope.tareas=[{texto:'Tarea 1',hecho:true},{texto:'Tarea 2',hecho:false}];

        $scope.agregarTarea = function(){
            $scope.tareas.push({texto:$scope.nuevaTarea,hecho:false});
            $scope.nuevaTarea='';
        };

        $scope.restantes = function(){

            var cont = 0;
            angular.forEach($scope.tareas,function(tarea){
                cont += tarea.hecho ? 0:1;
            });

            return cont;
        };


        $scope.eliminar = function(){

            var tareasViejas = $scope.tareas;
            $scope.tareas = [];

            angular.forEach(tareasViejas,function(tarea){
                if(!tarea.hecho)
                    $scope.tareas.push(tarea);
            });
        };
    }]);


});