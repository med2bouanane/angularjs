angular.module('config', ['pascalprecht.translate'])
.config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: "/Scripts/Angular/Language/",
        suffix: ".json"
    });

    $translateProvider.preferredLanguage('es');
   

}])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind("change", function () {
                scope.$apply(function () {
                    document.getElementById("uploadFile").value = element[0].value;//files[0].name;
                    modelSetter(scope, element[0].value);//files[0]);
                });
            });
        }
    };
}])
.filter('slice', function () {
    return function (arr, start, end) {
        return arr.slice(start, end);
    };
});