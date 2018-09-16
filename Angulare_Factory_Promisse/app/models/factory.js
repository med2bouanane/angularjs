/**
 * Created by mohamedbouanane on 10/11/14.
 */
angular.module('factory',[])
    .factory('factoryPost',function($http,$q){

        var factory = {
            posts: false,
            getPosts : function(){
                var deferred = $q.defer();
                $http.get('app/models/posts.json')
                    .success(function(data,status){
                        factory.posts = data;
                        deferred.resolve(factory.posts);
                    })
                    .error(function(data,status){
                        deferred.reject('No se pueden recuperar los datos');
                    });
                return deferred.promise;
            },
            getPost:function(id){
                var post = {};
                angular.forEach(factory.posts,function(value,key){
                    if(value.id == id)
                    {
                        post = value;
                    }
                });
                return post;
            }
        };
        return factory;
    });