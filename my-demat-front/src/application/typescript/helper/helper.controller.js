var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var HelperController = /** @class */ (function () {
                function HelperController() {
                }
                HelperController.prototype.calculateClass = function (column) {
                    var style;
                    switch (column) {
                        case "CREATE_DATE":
                        case "UPDATE_DATE":
                        case "REGEX":
                        case "ACTION":
                        case "REFERENCE":
                        case "DISPLAY_ORDER":
                        case "MAX_LENGTH":
                        case "MIN_LENGTH":
                        case "PREFIX":
                        case "REQUIRED":
                            style = {
                                textAlign: 'center'
                            };
                            break;
                    }
                    return style;
                };
                return HelperController;
            }());
            controller.HelperController = HelperController;
            demat.app.controller("HelperController", HelperController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));
