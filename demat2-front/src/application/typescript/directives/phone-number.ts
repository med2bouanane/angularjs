module arvato.demat.directive {
    app.directive('phoneInput', function ($filter, $browser) {
        return {
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element.val().replace(/[^0-9]/g, '');
                    $element.val($filter('tel')(value, false));
                };

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    return viewValue.replace(/[^0-9]/g, '').slice(0, 11);
                });

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
                };

                $element.bind('change', listener);
                $element.bind('keydown', function (event) {
                    var key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                        return;
                    }
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });

                $element.bind('paste cut', function () {
                    $browser.defer(listener);
                });
            }

        };
    });
    app.filter('tel', function () {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var number = value;

            if (value.length > 9) {
                number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.slice(5, 7) + '-' + number.slice(7, 9) + '-' + number.slice(9, 11);
            } else if (value.length > 7) {
                number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.slice(5, 7) + '-' + number.slice(7, 9);
            } else if (value.length > 5) {
                number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.slice(5, 7);
            } else if (value.length > 3) {
                number = number.slice(0, 3) + '-' + number.slice(3, 5);
            } else {
                number = value;
            }

            if (number) {
                return number;
            }
        };
    });
}