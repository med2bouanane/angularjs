module arvato.demat.controller {
    "use strict";
    app.controller('TranslateController', function($translate, $scope) {
        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
        };
    });
}
