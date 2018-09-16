
app.directive('traduction', function () {
    return {
        restrict: 'A',
        scope: {},
        template: '<input type="text" />',
        replace: true,
        link: function (scope, element, attrs) {
            console.log(element);
        }
    };
});