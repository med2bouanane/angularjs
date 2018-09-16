/**
 * Created by MBouanane on 12/10/14.
 */
var miApp = angular.module('miApp',['ngRoute','AnimacionController'])
.config(['$routeProvider',function(routes){
        routes.when('/',{
            templateUrl:'src/views/Animacion.html',
            controller:'AnimacionCtrl'
        });
    }]);