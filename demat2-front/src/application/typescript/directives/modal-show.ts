/*module arvato.demat.directive {
    "use strict";

    app.directive("modalShow", function () {
        return {
            restrict: "A",
            scope: {
                modalVisible: "="
            },
            link: function (scope, element, attrs) {

                //Hide or show the modal
                scope.showModal = function (visible) {
                    if (visible) {
                        element.modal("show");
                    }
                    else {
                        $(".modal-backdrop").hide();
                        $("body").removeClass("modal-open");
                        element.modal("hide");
                    }
                }

                //Check to see if the modal-visible attribute exists
                if (!attrs.modalVisible) {

                    //The attribute isn't defined, show the modal by default
                    scope.showModal(true);

                }
                else {

                    //Watch for changes to the modal-visible attribute
                    scope.$watch("modalVisible", function (newValue, oldValue) {
                        scope.showModal(newValue);
                    });

                    //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
                    element.bind("hide.bs.modal", function () {
                        scope.modalVisible = false;
                        if (!scope.$$phase && !scope.$root.$$phase)
                            scope.$apply();
                    });

                }
            }
        };

    });
}
*/
module arvato.demat.directive {
    "use strict";

    export interface IModalShowScope extends ng.IScope {
        modalVisible: boolean;
    }

    export interface IModalShowAttributes extends ng.IAttributes {
        modalVisible: boolean;
    }

    app.directive("modalShow", function () {
        return {
            restrict: "A",
            scope: {
                modalVisible: "="
            },
            link: function (scope: IModalShowScope, element, attrs: IModalShowAttributes) {

                //Hide or show the modal
                var showModal = function (visible) {
                    if (visible) {
                        element.modal("show");
                    } else {
                        $(".modal-backdrop").hide();
                        $("body").removeClass("modal-open");
                        element.modal("hide");
                    }
                }

                //Check to see if the modal-visible attribute exists
                if (!attrs.modalVisible) {
                    //The attribute isn't defined, show the modal by default
                    showModal(true);
                } else {
                    //Watch for changes to the modal-visible attribute
                    scope.$watch("modalVisible", function (newValue, oldValue) {
                        showModal(newValue);
                    });

                    //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
                    element.bind("hide.bs.modal", function () {
                        scope.modalVisible = false;
                        if (!scope.$$phase && !scope.$root.$$phase)
                            scope.$apply();
                    });
                }
            }
        };
    });
}