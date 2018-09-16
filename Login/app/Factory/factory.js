/**
 * Created by mohamedbouanane on 22/11/14.
 */
angular.module('factory',[])
.factory('factoryLogin',function($http,$q){

        var factory = {

            getLogin:function(){

                var deferred = $q.defer();
                $http.post('http://localhost:8080/pfc_server/rest/serviciosR/send')
                    .success(function(data,status){
                        deferred.resolve(data);
                    })
                    .error(function(){
                        alert('ERROR en la Petición de login');
                    });

                return deferred.promise;
            }

        };
        return factory;
    });