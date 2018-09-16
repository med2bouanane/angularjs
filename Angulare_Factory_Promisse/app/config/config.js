/**
 * Created by mohamedbouanane on 9/11/14.
 */
angular.module('config',['ngRoute','postsController','commentsController'])
.config(function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'app/partials/home.html',
                controller:'postsController'
            })
            .when('/comments/:id',{
                templateUrl:'app/partials/comments.html',
                controller:'commentsController'
            })
            .otherwise({redirect:'/'});
    });