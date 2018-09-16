/**
 * Created by mohamedbouanane on 9/11/14.
 */
angular.module('commentsController',['factory'])
.controller('commentsController',function($scope,factoryPost,$routeParams){

        var post = factoryPost.getPost($routeParams.id);
        $scope.title = post.name;
        $scope.comments = post.comments;

    });