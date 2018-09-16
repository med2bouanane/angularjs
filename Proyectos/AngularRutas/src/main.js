

var miApp = angular.module('miApp',['ngRoute','TareasController','EmpleadosController'])

.config(['$routeProvider',function($routes) {
	//$locationProvider.html5Mode(true);
	$routes
        .when('/',{
            templateUrl:'src/views/inicio.html'
        })
        .when('/tareas',{
            templateUrl:'src/views/tareas.html',
            controller:'TareasCtl'
        })
        .when('/empleados',{
            templateUrl:'src/views/empleados.html',
            controller:'EmpleadosCtl'
        })
        .otherwise({
            redirectTo:'/'
        });
}]);




