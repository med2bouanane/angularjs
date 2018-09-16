/// <reference path="../Angular/angular.js" />

app.directive('numerique', function () {
    return {
        restrict: 'A',
        scope: {},
        template: '<input type="text" />',
        replace: true,
        link: function (scope, element, attrs) {
            angular.element(element[0]).keydown(function (event) {
                if (attrs.decimal && attrs.decimal == "true") {
                    // Allow: backspace, delete, tab, escape, and enter
                    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                    // Allow: Ctrl+A
                    (event.keyCode == 65 && event.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (event.keyCode >= 35 && event.keyCode <= 39) ||
                    // Allow: .
                    ((event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 188) && (this.value.indexOf(".") == -1 && this.value.indexOf(",") == -1))) {
                        // let it happen, don't do anything
                        return;
                    } else {
                        // Ensure that it is a number and stop the keypress
                        if (!(event.keyCode == 8                                // backspace
                        || event.keyCode == 46                              // delete
                        || (event.keyCode >= 48 && event.keyCode <= 57 && event.shiftKey)     // numbers on keyboard T30839 
                        || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
                        ) {
                            event.preventDefault();
                        }
                    }
                }
                else {
                    // alert(event.keyCode);
                    //capLock(event);
                    // Allow: backspace, delete, tab, escape, and enter
                    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                    // Allow: Ctrl+A
                    (event.keyCode == 65 && event.ctrlKey === true) ||
                    // Allow: home, end, left, right
                    (event.keyCode >= 35 && event.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                    } else {
                        // Ensure that it is a number and stop the keypress
                        if (!(event.keyCode == 8                                // backspace
                                || event.keyCode == 46                              // delete
                                || (event.keyCode >= 48 && event.keyCode <= 57 && event.shiftKey)     // numbers on keyboard T30839 
                                || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
                                ) {
                            event.preventDefault();
                        }
                    }
                }
            });
        }
    };
});