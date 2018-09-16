angular.module('IndexContoller', [])
.controller('IndexContoller', function ($scope, $http;$translate) {
      var aLangue=$('#ddlLangue option:selected').val();
        $translate.use(aLangue);
});