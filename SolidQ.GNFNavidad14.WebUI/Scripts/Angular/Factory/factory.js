angular.module('factory', [])
.factory('factoryGraphics',['$http','$q',function($http,$q){

    var factory={
        getDataStatistic: function () {
            var deferred = $q.defer();
            $http.get("Statistics")
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
    return factory;
}])
.factory('factoryGraphicsLanguages', ['$http', '$q', function ($http, $q) {

    var factory = {
        getDataStatistic: function () {
            var deferred = $q.defer();
            $http.get("GraphicLanguage")
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
    return factory;
}]);