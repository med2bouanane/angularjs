/**
 * Created by mohamedbouanane on 9/11/14.
 */
angular.module('postsController',['factory'])
.controller('postsController',function($scope,factoryPost){
    $scope.posts = factoryPost.getPosts().then(function(posts){

        $scope.posts = posts;
    },
    function(msg){
        alert(msg);
    });
});