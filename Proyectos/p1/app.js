
/**
* app Module
*
* Description
*/
angular.module('app', ['ngRoute','controller1'])
.config(['$routeProvider',function($routes) {

	$routes.when('/pages',{
		templateUrl:'pages.html',
		controller:'controller1'
	}).when('/page1',{
		templateUrl:'page1.html',
		controller:'controller1'
	}).when('/page2',{
		templateUrl:'page2.html',
		controller:'controller1'
	}).otherwise({
        redirectTo: '/pages'
      });
}]);

/*app.controller('controller1', ['$scope', function($scope){
	
	$scope.hola = 'HOLA';
}]);*/

