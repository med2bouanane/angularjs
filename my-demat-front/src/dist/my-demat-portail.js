var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        "use strict";
        demat.app = angular.module('my-demat-portail', ['ngResource', 'ngRoute', 'ui.bootstrap', 'CanvasViewer', 'http-auth-interceptor', 'angularSpinner', 'ui.uploader', 'ui.sortable', 'chart.js', 'cfp.hotkeys', 'ui.select', 'ui.tree']);
        demat.app.config(['$httpProvider', function ($httpProvider) {
                $httpProvider.defaults.withCredentials = true;
            }]);
        demat.app.config(function (hotkeysProvider) {
            hotkeysProvider.template = '<div ng-show="helpVisible" class="cfp-hotkeys-container fade ng-scope in" ng-class="{in: helpVisible}"><div class="cfp-hotkeys"><h4 class="cfp-hotkeys-title ng-binding">Les raccourcis clavier:</h4><table><tbody><tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }" class="ng-scope"><td class="cfp-hotkeys-keys"><span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key ng-scope ng-binding">{{key}}</span></td><td class="cfp-hotkeys-text ng-binding">{{hotkey.description}}</td></tr></tbody></table><div class="cfp-hotkeys-close" ng-click="helpVisible = false">×</div></div></div>';
        });
        demat.app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
                usSpinnerConfigProvider.setTheme('bigBlue', { color: 'blue', radius: 20 });
                usSpinnerConfigProvider.setTheme('smallRed', { color: 'red', radius: 6 });
            }]);
        demat.app.run(function ($rootScope, $location, $http, AuthSharedService, Session, USER_ROLES, $q, $timeout) {
            $rootScope.$on('$routeChangeStart', function (event, next) {
                if (next.originalPath === "/login" && $rootScope.authenticated) {
                    event.preventDefault();
                }
                else if (next.access && next.access.loginRequired && !$rootScope.authenticated) {
                    event.preventDefault();
                    $rootScope.$broadcast("event:auth-loginRequired", {});
                }
                else if (next.access && !AuthSharedService.isAuthorized(next.access.authorizedRoles)) {
                    event.preventDefault();
                    $rootScope.$broadcast("event:auth-forbidden", {});
                }
            });
            $rootScope.$on('$routeChangeSuccess', function (scope, next, current) {
                $rootScope.$evalAsync(function () {
                });
            });
            $rootScope.$on('event:auth-loginConfirmed', function (event, data) {
                $rootScope.loadingAccount = false;
                var nextLocation = ($rootScope.requestedUrl ? $rootScope.requestedUrl : "/home");
                var delay = ($location.path() === "/loading" ? 1500 : 0);
                $timeout(function () {
                    Session.create(data);
                    $rootScope.account = Session;
                    $rootScope.authenticated = true;
                    $location.path(nextLocation).replace();
                }, delay);
            });
            $rootScope.$on('event:auth-loginRequired', function (event, data) {
                if ($rootScope.loadingAccount && data.status !== 401) {
                    $rootScope.requestedUrl = $location.path();
                    $location.path('/loading');
                }
                else {
                    Session.invalidate();
                    $rootScope.authenticated = false;
                    $rootScope.loadingAccount = false;
                    $location.path('/login');
                }
            });
            $rootScope.$on('event:auth-forbidden', function (rejection) {
                $rootScope.$evalAsync(function () {
                    $location.path('/error/403').replace();
                });
            });
            $rootScope.$on('event:auth-loginCancelled', function () {
                $location.path('/login').replace();
            });
            AuthSharedService.getAccount();
        });
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        "use strict";
        demat.app.constant('USER_ROLES', {
            ALL_ROLES: '*',
            ADMINISTRATOR_ROLE: 'Administrateur',
            SUPERVISOR_ROLE: 'Superviseur',
            OPERATOR_ROLE: 'Opérateur',
            OTC_ROLE: 'OTC'
        });
        demat.app.config(function ($routeProvider, USER_ROLES) {
            $routeProvider.when('/home', {
                templateUrl: 'components/home/home.html',
                controller: 'HomeController',
                controllerAs: "homeCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/', {
                redirectTo: '/home'
            }).when('/user/:action', {
                templateUrl: 'components/user/user-account.html',
                controller: 'UserController',
                controllerAs: "userCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/envelopes/:batchId', {
                templateUrl: 'components/supervision/envelope/envelope.html',
                controller: 'EnvelopeController',
                controllerAs: "envelopeCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE, USER_ROLES.SUPERVISOR_ROLE]
                }
            }).when('/historic-batch', {
                templateUrl: 'components/supervision/batch/batch.html',
                controller: 'HistoricBatchController',
                controllerAs: "historicBatchCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE, USER_ROLES.SUPERVISOR_ROLE]
                }
            }).when('/historic/:envelopeId', {
                templateUrl: 'components/supervision/historic/historic.html',
                controller: 'HistoricParamsController',
                controllerAs: "historicCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE, USER_ROLES.SUPERVISOR_ROLE]
                }
            }).when('/historic', {
                templateUrl: 'components/supervision/historic/historic.html',
                controller: 'HistoricController',
                controllerAs: "historicCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE, USER_ROLES.SUPERVISOR_ROLE]
                }
            }).when('/admin-users', {
                templateUrl: 'components/administration/users-roles/admin-users.html',
                controller: 'AdminUsersController',
                controllerAs: "adminUsersCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
                }
            }).when('/admin-xpath', {
                templateUrl: 'components/administration/integration-batch/integration-batch.html',
                controller: 'AdminIntegrationBatchController',
                controllerAs: "integrationBatchCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
                }
            }).when('/admin-referencial', {
                templateUrl: 'components/administration/referencial/admin-referencial.html',
                controller: 'AdminReferencialController',
                controllerAs: "referencialCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
                }
            }).when('/admin-trays', {
                templateUrl: 'components/administration/tray/admin-trays.html',
                controller: 'AdminTrayController',
                controllerAs: "adminTrayCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
                }
            }).when('/admin-lists', {
                templateUrl: 'components/administration/lists/admin-lists.html',
                controller: 'AdminListsController',
                controllerAs: "adminListsCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
                }
            }).when('/admin-indexes', {
                templateUrl: 'components/administration/indexes/admin-indexes.html',
                controller: 'AdminIndexesController',
                controllerAs: "adminIndexesCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/login', {
                templateUrl: 'components/authentification/login.html',
                controller: 'LoginController',
                access: {
                    loginRequired: false,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/loading', {
                templateUrl: 'components/loading/loading.html',
                access: {
                    loginRequired: false,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/logout', {
                template: ' ',
                controller: 'LogoutController',
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/tray-detail/:trayId', {
                templateUrl: 'components/tray-treatment/tray-detail/tray-detail.html',
                controller: 'TrayDetailController',
                controllerAs: 'trayDetailCtrl',
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/envelope-detail/:envelopeId', {
                templateUrl: 'components/tray-treatment/envelope-detail/envelope-detail.html',
                controller: 'EnvelopeDetailController',
                controllerAs: 'envelopeDetailCtrl',
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/control-image/treatment/:trayId', {
                templateUrl: 'components/control-image/treatment/base-template.html',
                controller: 'ControlImageTreatmentBaseController',
                controllerAs: 'treatmentBaseCtrl',
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/control-image/treatment/:trayId/detail/:batchId', {
                templateUrl: 'components/control-image/treatment/detail-template.html',
                controller: 'ControlImageTreatmentDetailController',
                controllerAs: 'treatmentDetailCtrl',
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/control-image/reject/:trayId', {
                templateUrl: 'components/control-image/reject/base-template.html',
                controller: 'ControlImageRejectBaseController',
                controllerAs: 'rejectBaseCtrl',
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/control-image/reject/:trayId/detail/:batchId', {
                templateUrl: 'components/control-image/reject/detail-template.html',
                controller: 'ControlImageRejectDetailController',
                controllerAs: 'rejectDetailCtrl',
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/error/:code', {
                templateUrl: 'components/error/error.html',
                controller: 'ErrorController',
                controllerAs: "errorCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/admin-application', {
                templateUrl: 'components/administration/application/admin-application.html',
                controller: 'AdminAppController',
                controllerAs: "adminAppCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            }).when('/admin/entity-type/:entityTypeParams', {
                templateUrl: 'components/administration/entity-type/list/entity-type-list.html',
                controller: 'EntityTypeListController',
                controllerAs: "entityTypeListCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
                }
            }).when('/admin/entity-type/:entityTypeParams/add', {
                templateUrl: 'components/administration/entity-type/add/entity-type-add.html',
                controller: 'EntityTypeAddController',
                controllerAs: "entityTypeAddCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
                }
            }).when('/admin/entity-type/:entityTypeParams/update/:entityIdParams', {
                templateUrl: 'components/administration/entity-type/update/entity-type-update.html',
                controller: 'EntityTypeUpdateController',
                controllerAs: "entityTypeUpdateCtrl",
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
                }
            }).otherwise({
                redirectTo: '/error/404',
                access: {
                    loginRequired: true,
                    authorizedRoles: [USER_ROLES.ALL_ROLES]
                }
            });
        });
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var constants;
        (function (constants) {
            "use strict";
            var Constants  = (function () {
                function Constants () {
                    this.colors = ['default', 'primary', 'success', 'info', 'warning', 'danger'];
                    this.categoryTypes = ['table', 'list'];
                    this.ERROR_500_PATH = "error/500";
                }
                Object.defineProperty(Constants , "getConstant", {
                    get: function () {
                        return new Constants();
                    },
                    enumerable: true,
                    configurable: true
                });
                return Constants ;
            }());
            constants.Constants  = Constants ;
            demat.app.constant('Constants', Constants.getConstant);
        })(constants = demat.constants || (demat.constants = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var GenericAdminController = (function () {
                function GenericAdminController() {
                    this.currentPage = 1;
                    this.itemsPerPage = 13;
                    this.maxSize = 13;
                    this.openPopinConfirm = false;
                    this.openPopinEdit = false;
                    this.openPopinAdd = false;
                }
                return GenericAdminController;
            }());
            controller.GenericAdminController = GenericAdminController;
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var directive;
        (function (directive) {
            demat.app.directive('access', [
                'AuthSharedService',
                function (AuthSharedService) {
                    return {
                        restrict: 'A',
                        link: function (scope, element, attrs) {
                            var roles = attrs.access.split(',');
                            if (roles.length > 0) {
                                if (AuthSharedService.isAuthorized(roles)) {
                                    element.removeClass('hide');
                                }
                                else {
                                    element.addClass('hide');
                                }
                            }
                        }
                    };
                }]);
        })(directive = demat.directive || (demat.directive = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var directive;
        (function (directive) {
            demat.app.directive("treeModel", function ($compile) {
                return {
                    restrict: "A",
                    link: function (scope, element, attrs) {
                        var a = attrs.treeId, g = attrs.treeModel, e = attrs.nodeLabel || "label", d = attrs.nodeChildren || "children", e = '<ul><li data-ng-repeat="node in ' + g + '"><i class="fa fa-envelope" data-ng-show="node.structuralEntityType.id===\'ENV\' && node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="fa fa-envelope-o" data-ng-show="node.structuralEntityType.code===\'ENV\' && !node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="fa fa-file-archive-o" data-ng-show="node.structuralEntityType.code===\'DOC\' && node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="fa fa-file-o" data-ng-show="node.structuralEntityType.code===\'DOC\' && !node.collapsed" data-ng-click="' + a + '.selectNodeHead(node)"></i><i class="fa fa-file-image-o" data-ng-hide="node.' +
                            d + '.length"></i> <span data-ng-class="node.selected" data-ng-click="' + a + '.selectNodeLabel(node)">{{(node.documentType && node.documentType.label) ? node.documentType.label : node.' + e + '}}  <i ng-show="node.structuralEntityType.code===\'DOC\' && node.documentType.label" class="fa fa-check-circle-o" style="color:green" aria-hidden="true"></i><i ng-hide="node.structuralEntityType.code!==\'DOC\' || node.documentType.label" class="fa fa-question-circle-o" style="color:red" aria-hidden="true"></i></span><div data-ng-hide="node.collapsed" data-tree-id="' + a + '" data-tree-model="node.' + d + '" data-node-id=' + (attrs.nodeId || "id") + " data-node-label=" + e + " data-node-children=" + d + "></div></li></ul>";
                        a && g && (attrs.angularTreeview && (scope[a] = scope[a] || {}, scope[a].selectNodeHead = scope[a].selectNodeHead || function (a) {
                            a.collapsed = !a.collapsed;
                        }, scope[a].selectNodeLabel = scope[a].selectNodeLabel || function (c) {
                            scope[a].currentNode && scope[a].currentNode.selected &&
                                (scope[a].currentNode.selected = void 0);
                            c.selected = "selected";
                            scope[a].currentNode = c;
                        }), element.html('').append($compile(e)(scope)));
                    }
                };
            });
        })(directive = demat.directive || (demat.directive = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var directive;
        (function (directive) {
            "use strict";
            demat.app.directive("modalShow", function () {
                return {
                    restrict: "A",
                    scope: {
                        modalVisible: "="
                    },
                    link: function (scope, element, attrs) {
                        var showModal = function (visible) {
                            if (visible) {
                                element.modal("show");
                            }
                            else {
                                $(".modal-backdrop").hide();
                                $("body").removeClass("modal-open");
                                element.modal("hide");
                            }
                        };
                        if (!attrs.modalVisible) {
                            showModal(true);
                        }
                        else {
                            scope.$watch("modalVisible", function (newValue, oldValue) {
                                showModal(newValue);
                            });
                            element.bind("hide.bs.modal", function () {
                                scope.modalVisible = false;
                                if (!scope.$$phase && !scope.$root.$$phase)
                                    scope.$apply();
                            });
                        }
                    }
                };
            });
        })(directive = demat.directive || (demat.directive = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var directive;
        (function (directive) {
            demat.app.directive('phoneInput', function ($filter, $browser) {
                return {
                    require: 'ngModel',
                    link: function ($scope, $element, $attrs, ngModelCtrl) {
                        var listener = function () {
                            var value = $element.val().replace(/[^0-9]/g, '');
                            $element.val($filter('tel')(value, false));
                        };
                        ngModelCtrl.$parsers.push(function (viewValue) {
                            return viewValue.replace(/[^0-9]/g, '').slice(0, 11);
                        });
                        ngModelCtrl.$render = function () {
                            $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
                        };
                        $element.bind('change', listener);
                        $element.bind('keydown', function (event) {
                            var key = event.keyCode;
                            if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                                return;
                            }
                            $browser.defer(listener); 
                        });
                        $element.bind('paste cut', function () {
                            $browser.defer(listener);
                        });
                    }
                };
            });
            demat.app.filter('tel', function () {
                return function (tel) {
                    if (!tel) {
                        return '';
                    }
                    var value = tel.toString().trim().replace(/^\+/, '');
                    if (value.match(/[^0-9]/)) {
                        return tel;
                    }
                    var number = value;
                    if (value.length > 9) {
                        number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.slice(5, 7) + '-' + number.slice(7, 9) + '-' + number.slice(9, 11);
                    }
                    else if (value.length > 7) {
                        number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.slice(5, 7) + '-' + number.slice(7, 9);
                    }
                    else if (value.length > 5) {
                        number = number.slice(0, 3) + '-' + number.slice(3, 5) + '-' + number.slice(5, 7);
                    }
                    else if (value.length > 3) {
                        number = number.slice(0, 3) + '-' + number.slice(3, 5);
                    }
                    else {
                        number = value;
                    }
                    if (number) {
                        return number;
                    }
                };
            });
        })(directive = demat.directive || (demat.directive = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var filter;
        (function (filter) {
            "use strict";
            function calculateCadence() {
                return function (time, volume) {
                    if (!time || !volume)
                        return '-';
                    return Math.round(volume / (time / 3600)).toFixed(1);
                };
            }
            filter.calculateCadence = calculateCadence;
            demat.app.filter("toCadence", calculateCadence);
        })(filter = demat.filter || (demat.filter = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var filter;
        (function (filter) {
            "use strict";
            function convertToHrMinSec() {
                return function (time) {
                    if (!time)
                        return '-';
                    var hours = Math.floor(time / 3600);
                    time = time % 3600;
                    var minutes = Math.floor(time / 60);
                    var seconds = time % 60;
                    return (hours ? hours > 9 ? hours + ':' : '0' + hours + ':' : '00:') + (minutes ? minutes > 9 ? minutes + ':' : '0' + minutes + ':' : '00:') + (seconds ? seconds > 9 ? seconds : '0' + seconds : '00');
                };
            }
            filter.convertToHrMinSec = convertToHrMinSec;
            demat.app.filter('toHrMinSec', convertToHrMinSec);
        })(filter = demat.filter || (demat.filter = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var HelperController = (function () {
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

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            var controlimage;
            (function (controlimage) {
                "use strict";
            })(controlimage = models.controlimage || (models.controlimage = {}));
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var models;
        (function (models) {
            "use strict";
        })(models = demat.models || (demat.models = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var AdminIntegrationBatchService = (function () {
                function AdminIntegrationBatchService(http, q, uiUploader) {
                    this.http = http;
                    this.q = q;
                    this.uiUploader = uiUploader;
                    this.httpAddress = "http://localhost:8080";
                }
                AdminIntegrationBatchService.prototype.loadXPathExpressions = function () {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/integrationBatch/xpathexpr").success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading XPATH expressions');
                    });
                    return deferred.promise;
                };
                AdminIntegrationBatchService.prototype.saveXpathExpressions = function (data) {
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/integrationBatch/xpathexpr", data).success(function (result) {
                        deferred.resolve(result);
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating/updating XPATH expressions');
                    });
                    return deferred.promise;
                };
                AdminIntegrationBatchService.prototype.loadRegex = function () {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/integrationBatch/regex").success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading regex(s)');
                    });
                    return deferred.promise;
                };
                AdminIntegrationBatchService.prototype.updateRegexPriority = function (regexList) {
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/integrationBatch/regex/sort", regexList).success(function () {
                        deferred.resolve();
                    }).catch(function (error) {
                        console.error('problem occured when updating regex list sort');
                    });
                    return deferred.promise;
                };
                AdminIntegrationBatchService.prototype.createRegex = function (regex) {
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/integrationBatch/regex", regex).success(function (result) {
                        deferred.resolve(result);
                    }).catch(function (error) {
                        console.error('problem occured when creating new regular expression');
                    });
                    return deferred.promise;
                };
                AdminIntegrationBatchService.prototype.deleteRegex = function (regex) {
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/integrationBatch/regex/xpath/" + regex.xpathExpr.id + "/referencialQuery/" + regex.referencialQuery.id).success(function (response) {
                        deferred.resolve(response);
                    }).catch(function (error) {
                        console.error('problem occured when deleting a regular expression :' + regex.label);
                    });
                    return deferred.promise;
                };
                AdminIntegrationBatchService.prototype.updateRegex = function (regex) {
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/integrationBatch/regex", regex).success(function (result) {
                        deferred.resolve(result);
                    }).catch(function (error) {
                        console.error('problem occured when updating regex label: ' + regex.label);
                    });
                    return deferred.promise;
                };
                AdminIntegrationBatchService.$inject = ["$http", "$q", "uiUploader"];
                return AdminIntegrationBatchService;
            }());
            services.AdminIntegrationBatchService = AdminIntegrationBatchService;
            demat.app.service('AdminIntegrationBatchService', AdminIntegrationBatchService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var AdminReferencialService = (function () {
                function AdminReferencialService(http, q, uiUploader) {
                    this.http = http;
                    this.q = q;
                    this.uiUploader = uiUploader;
                    this.httpAddress = "http://localhost:8080";
                }
                AdminReferencialService.prototype.createReferencialQuery = function (referencialQuery) {
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/referencial/referencialQuery", referencialQuery).success(function (result) {
                        deferred.resolve(result);
                    }).catch(function (error) {
                        console.error('problem occured when creating new referencialQuery');
                    });
                    return deferred.promise;
                };
                AdminReferencialService.prototype.deleteReferencialQuery = function (refQueryId) {
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/referencial/referencialQuery/" + refQueryId).success(function (response) {
                        deferred.resolve(response);
                    }).catch(function (error) {
                        console.error('problem occured when deleting referencialQuery id :' + refQueryId);
                    });
                    return deferred.promise;
                };
                AdminReferencialService.prototype.loadReferencialQueries = function () {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/referencial/referencialQuery").success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading referencial queries');
                    });
                    return deferred.promise;
                };
                AdminReferencialService.prototype.updateReferencialQuery = function (referencialQuery) {
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/referencial/referencialQuery", referencialQuery).success(function (result) {
                        deferred.resolve(result);
                    }).catch(function (error) {
                        console.error('problem occured when updating referencialQuery id ' + referencialQuery.id);
                    });
                    return deferred.promise;
                };
                AdminReferencialService.prototype.loadReferencialTypeQueries = function () {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/referencial/type").success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading referencial type queries');
                    });
                    return deferred.promise;
                };
                AdminReferencialService.$inject = ["$http", "$q", "uiUploader"];
                return AdminReferencialService;
            }());
            services.AdminReferencialService = AdminReferencialService;
            demat.app.service('AdminReferencialService', AdminReferencialService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var AdministrationService = (function () {
                function AdministrationService(http, q, uiUploader) {
                    this.http = http;
                    this.q = q;
                    this.uiUploader = uiUploader;
                    this.httpAddress = "http://localhost:8080";
                }
                AdministrationService.prototype.export = function (trayId, fileType) {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/exchange/export/" + trayId + "/" + fileType).success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject('problem occured when exporting file type : ' + fileType);
                    });
                    return deferred.promise;
                };
                AdministrationService.prototype.uploadOnProgress = function (file) {
                    console.log(file.name + '=' + file.humanSize);
                };
                AdministrationService.$inject = ["$http", "$q", "uiUploader"];
                return AdministrationService;
            }());
            services.AdministrationService = AdministrationService;
            demat.app.service('AdministrationService', AdministrationService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var AppSharedService = (function () {
                function AppSharedService(rootScope) {
                    this.rootScope = rootScope;
                }
                AppSharedService.prototype.displayLoading = function () {
                    this.rootScope.isLoading = true;
                };
                AppSharedService.prototype.closeLoading = function () {
                    this.rootScope.isLoading = false;
                };
                AppSharedService.prototype.notifyError = function (error) {
                    this.rootScope.error = error;
                    this.closeLoading();
                };
                AppSharedService.prototype.notifyErrorWithObjectError = function (error, object) {
                    this.rootScope.error = error;
                    this.rootScope.errorObject = object;
                    this.closeLoading();
                };
                AppSharedService.prototype.getError = function () {
                    return this.rootScope.error;
                };
                AppSharedService.prototype.getErrorObject = function () {
                    return this.rootScope.errorObject;
                };
                AppSharedService.prototype.showAlert = function (msg) {
                    this.rootScope.showAlert = true;
                    this.rootScope.msgAlert = msg;
                };
                AppSharedService.prototype.closeAlert = function () {
                    this.rootScope.showAlert = false;
                };
                AppSharedService.$inject = ["$rootScope"];
                return AppSharedService;
            }());
            services.AppSharedService = AppSharedService;
            demat.app.service("AppSharedService", AppSharedService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var ENDPOINT = "http://localhost:8082";
            var BoardService = (function () {
                function BoardService(http, q, appSharedService) {
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                }
                BoardService.prototype.getBoard = function (url) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(ENDPOINT + url).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading " + url);
                    });
                    return deferred.promise;
                };
                BoardService.$inject = ["$http", "$q", "AppSharedService"];
                return BoardService;
            }());
            services.BoardService = BoardService;
            demat.app.service("BoardService", BoardService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var DropdownService = (function () {
                function DropdownService(http, appSharedService, q) {
                    this.http = http;
                    this.appSharedService = appSharedService;
                    this.q = q;
                    this.httpAddress = "http://localhost:8081";
                }
                DropdownService.prototype.loadDropdowns = function (entitySimple) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/entity-type/" + entitySimple).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        var reason = 'problem occured when loading dropdowns';
                        _this.appSharedService.notifyErrorWithObjectError(reason, error);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                };
                DropdownService.$inject = ["$http", "AppSharedService", "$q"];
                return DropdownService;
            }());
            services.DropdownService = DropdownService;
            demat.app.service('DropdownService', DropdownService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var EnvelopeService = (function () {
                function EnvelopeService(http, q, appSharedService, filter) {
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                    this.filter = filter;
                    this.httpAddress = "http://localhost:8080";
                }
                EnvelopeService.prototype.findEnvelopes = function (batchId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/batches/" + batchId + "/envelopes").success(function (envelopes) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(envelopes);
                    }).catch(function (error) {
                        deferred.reject("problem occured when find envelopes");
                    });
                    return deferred.promise;
                };
                EnvelopeService.$inject = ["$http", "$q", "AppSharedService", "$filter"];
                return EnvelopeService;
            }());
            services.EnvelopeService = EnvelopeService;
            demat.app.service("EnvelopeService", EnvelopeService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var GenericService = (function () {
                function GenericService(http, q, appSharedService) {
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                    this.httpAddress = "http://localhost:8080";
                    this.endPointAdmin = "http://localhost:8081";
                }
                GenericService.$inject = ["$http", "$q", "AppSharedService"];
                return GenericService;
            }());
            services.GenericService = GenericService;
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var TrayService = (function () {
                function TrayService(http, q, appSharedService, filter) {
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                    this.filter = filter;
                    this.httpAddress = "http://localhost:8080";
                    this.trays = [];
                }
                TrayService.prototype.loadTrays = function () {
                    var _this = this;
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays").success(function (data) {
                        deferred.resolve(data);
                        _this.trays.length = 0;
                        _this.trays.push.apply(_this.trays, data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading trays");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadTray = function (trayId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/" + trayId).success(function (data) {
                        _this.currentTray = data;
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading tray id : " + trayId);
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadTrayDetail = function (trayId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/" + trayId + "/detail").success(function (data) {
                        _this.currentTray = data;
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading tray id : " + trayId);
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadEnvelopes = function (trayId, search) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/trays/" + trayId + "/criteria", search).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading envelopes for tray id :" + trayId + " and envelopeId =" + search.envelopeId + " and batchId =" + search.batchId);
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadDocTypes = function (trayId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/" + trayId + "/docTypes").success(function (data) {
                        _this.docTypes = data;
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading document types for tray id :" + trayId);
                    });
                };
                TrayService.prototype.loadEnvelopeTypes = function (trayId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/" + trayId + "/envelopeTypes").success(function (data) {
                        _this.envTypes = data;
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading envelope types for tray id :" + trayId);
                    });
                };
                TrayService.prototype.loadRejectTypes = function (trayId) {
                    var _this = this;
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/" + trayId + "/rejectTypes").success(function (data) {
                        _this.rejectTypes = data;
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading reject types for tray id :" + trayId);
                    });
                };
                TrayService.prototype.loadRejectTypesByStructuralEntityType = function (trayId, codeStructuralEntityType) {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/" + trayId + "/rejectTypes/" + codeStructuralEntityType).success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading BATCH reject types for tray id :" + trayId);
                    });
                    return deferred.promise;
                };
                TrayService.prototype.getNextEnvelope = function (trayId) {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/" + trayId + "/envelope").success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading next envelope of tray id :" + trayId);
                    });
                    return deferred.promise;
                };
                TrayService.prototype.changeEnvelopeTray = function (envelopeId, trayId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/envelopes/" + envelopeId + "/tray", trayId).success(function (tray) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(tray);
                    }).catch(function (error) {
                        deferred.reject("problem occured when changing envelope tray to tray id: " + trayId);
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadEnvelope = function (envelopeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/envelopes/" + envelopeId).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading envelope id :" + envelopeId);
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadEnvelopeTree = function (envelopeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/envelopes/" + envelopeId + "/tree").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading envelope id :" + envelopeId);
                    });
                    return deferred.promise;
                };
                TrayService.prototype.indexEnvelope = function (envelopeId, envelope) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/index", envelope).success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when index envelope");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.validateQualityControl = function (envelopeId, isValidated) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/qualityControl", isValidated).success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when validating quality control envelope");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.rejectEnvelope = function (envelopeId, trayId, rejectId, comment) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/tray/" + trayId + "/reject/" + rejectId, comment).success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when reject an envelope");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.classifyEnvelope = function (envelopeId, documents) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/classify", documents).success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when classify envelope");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.quitEnvelope = function (envelopeId, comment) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/quit", comment).success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when quit envelope");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.changeEnvelopeStatus = function (envelopeId, newStatus) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/envelopes/" + envelopeId + "/status", newStatus).success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when change envelope status");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.saveRotateImage = function (imageSave) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/image/rotate", imageSave).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when saving image rotation");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadRefIndexes = function (key) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/referential/search", key).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading referential indexes");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.exportEnvelopePdf = function (envelopeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/exchange/export/envelope/" + envelopeId + "/pdf", { responseType: 'arraybuffer' }).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when exporting envelope into pdf file');
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadEnvelopeHistorics = function (envelopeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/envelopes/" + envelopeId + "/historics").success(function (historics) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(historics);
                    }).catch(function (error) {
                        deferred.reject("problem occured when load envelope historics");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.loadBatchHistorics = function (batchId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/batches/" + batchId + "/historics").success(function (historics) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(historics);
                    }).catch(function (error) {
                        deferred.reject("problem occured when load batch historics");
                    });
                    return deferred.promise;
                };
                TrayService.prototype.deleteBatch = function (batchId, comment) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/batches/" + batchId, comment).success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when delete batch");
                    });
                    return deferred.promise;
                };
                TrayService.$inject = ["$http", "$q", "AppSharedService", "$filter"];
                return TrayService;
            }());
            services.TrayService = TrayService;
            demat.app.service("TrayService", TrayService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            demat.app.service('AuthSharedService', function ($rootScope, $http, $resource, authService, Session) {
                return {
                    login: function (userName, password, rememberMe) {
                        var config = {
                            params: {
                                username: userName,
                                password: password,
                                rememberme: rememberMe
                            },
                            ignoreAuthModule: 'ignoreAuthModule'
                        };
                        $http.post('http://localhost:8080/authenticate', '', config)
                            .success(function (data, status, headers, config) {
                            authService.loginConfirmed(data);
                        }).error(function (data, status, headers, config) {
                            $rootScope.authenticationError = true;
                            Session.invalidate();
                        });
                    },
                    getAccount: function () {
                        $rootScope.loadingAccount = true;
                        $http.get('http://localhost:8080/security/account')
                            .then(function (response) {
                            authService.loginConfirmed(response.data);
                        });
                    },
                    isAuthorized: function (authorizedRoles) {
                        if (!angular.isArray(authorizedRoles)) {
                            if (authorizedRoles == '*') {
                                return true;
                            }
                            authorizedRoles = [authorizedRoles];
                        }
                        var isAuthorized = false;
                        angular.forEach(authorizedRoles, function (authorizedRole) {
                            var authorized = (!!Session.login &&
                                Session.userRoles.indexOf(authorizedRole) !== -1);
                            if (authorized || authorizedRole == '*') {
                                isAuthorized = true;
                            }
                        });
                        return isAuthorized;
                    },
                    logout: function () {
                        $rootScope.authenticationError = false;
                        $rootScope.authenticated = false;
                        $rootScope.account = null;
                        $http.get('http://localhost:8080/logout');
                        Session.invalidate();
                        authService.loginCancelled();
                    }
                };
            });
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            demat.app.controller('LoginController', function ($rootScope, $scope, AuthSharedService) {
                $scope.rememberMe = true;
                $scope.login = function () {
                    $rootScope.authenticationError = false;
                    AuthSharedService.login($scope.username, $scope.password, $scope.rememberMe);
                };
            });
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            demat.app.controller('LogoutController', function (AuthSharedService) {
                AuthSharedService.logout();
            });
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var ErrorController = (function () {
                function ErrorController(routeParams, appSharedService) {
                    this.routeParams = routeParams;
                    this.appSharedService = appSharedService;
                    this.code = routeParams.code;
                    switch (routeParams.code) {
                        case '403':
                            this.message = "Oops! Vous êtes arrivé à une page non autorisée..";
                            break;
                        case '404':
                            this.message = "Page non trouvée.";
                            break;
                        default:
                            this.code = '500';
                            this.message = "Oops! erreur inattendue";
                            this.error = appSharedService.getError();
                            this.errorObject = appSharedService.getErrorObject();
                    }
                }
                ErrorController.$inject = ["$routeParams", "AppSharedService"];
                return ErrorController;
            }());
            controller.ErrorController = ErrorController;
            demat.app.controller("ErrorController", ErrorController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var HomeController = (function () {
                function HomeController(trayService, homeService, authSharedService, $scope, hotkeys, $timeout) {
                    var _this = this;
                    this.trayService = trayService;
                    this.homeService = homeService;
                    this.authSharedService = authSharedService;
                    this.$scope = $scope;
                    this.hotkeys = hotkeys;
                    this.$timeout = $timeout;
                    this.trays = this.trayService.trays;
                    $scope.pieChart = { labels: [], data: [], colors: undefined };
                    $scope.barChart = { labels: [], data: [], colors: undefined };
                    this.trayService.loadTrays().then(function () {
                        _this.refreshChart();
                        _this.createKeyShorcuts($scope, $timeout);
                    });
                    homeService.loadDashbordData().then(function (data) {
                        $scope.dashboard = data;
                        for (var _i = 0, _a = data.treatedByUser; _i < _a.length; _i++) {
                            var item = _a[_i];
                            $scope.barChart.labels.push(item[0].toString());
                            $scope.barChart.data.push(parseInt(item[1].toString()));
                        }
                    });
                    $scope.countSeconds = 10;
                    var updateCounter = function () {
                        if (angular.element(document).find('#refreshSpan').length) {
                            $scope.countSeconds--;
                            if ($scope.countSeconds === -1) {
                                $scope.countSeconds = 10;
                                trayService.loadTrays().then(function (trays) {
                                    $scope.pieChart.labels.length = 0;
                                    $scope.pieChart.data.length = 0;
                                    for (var i = 1; i <= trays.length; i++) {
                                        if (trays[i - 1].authoritiesAsString) {
                                            var roles = trays[i - 1].authoritiesAsString.split(',');
                                            if (roles.length > 0 && authSharedService.isAuthorized(roles)) {
                                                $scope.pieChart.labels.push(trays[i - 1].label);
                                                $scope.pieChart.data.push(trays[i - 1].nbEnvelopes);
                                            }
                                        }
                                    }
                                });
                                homeService.loadDashbordData().then(function (data) {
                                    $scope.dashboard = data;
                                    var usernames = [];
                                    var nbEnvTreated = [];
                                    for (var _i = 0, _a = data.treatedByUser; _i < _a.length; _i++) {
                                        var item = _a[_i];
                                        usernames.push(item[0].toString());
                                        nbEnvTreated.push(parseInt(item[1].toString()));
                                    }
                                    $scope.barChart.labels = usernames;
                                    $scope.barChart.data = nbEnvTreated;
                                });
                            }
                            $timeout(updateCounter, 1000);
                        }
                    };
                    updateCounter();
                }
                HomeController.prototype.createKeyShorcuts = function ($scope, $timeout) {
                    for (var i = 1; i <= this.trays.length; i++) {
                        if (this.trays[i - 1].authoritiesAsString) {
                            var roles = this.trays[i - 1].authoritiesAsString.split(',');
                            if (roles.length > 0 && this.authSharedService.isAuthorized(roles)) {
                                this.hotkeys.bindTo(this.$scope).add({
                                    combo: 'ctrl+' + i,
                                    description: 'Ouvrir la corbeille ' + this.trays[i - 1].label,
                                    callback: function (event) {
                                        event.preventDefault();
                                        $timeout(function () {
                                            angular.element(document).find('#trayPanel' + event.key).click();
                                        });
                                    }
                                });
                            }
                        }
                    }
                };
                HomeController.prototype.refreshChart = function () {
                    for (var i = 1; i <= this.trays.length; i++) {
                        if (this.trays[i - 1].authoritiesAsString) {
                            var roles = this.trays[i - 1].authoritiesAsString.split(',');
                            if (roles.length > 0 && this.authSharedService.isAuthorized(roles)) {
                                this.$scope.pieChart.labels.push(this.trays[i - 1].label);
                                this.$scope.pieChart.data.push(this.trays[i - 1].nbEnvelopes);
                            }
                        }
                    }
                };
                HomeController.prototype.getClass = function (tray) {
                    return 'panel panel-' + tray.color;
                };
                HomeController.prototype.getSubTypeIcon = function (tray) {
                    if (tray.structuralEntityType.code === 'ENV') {
                        return 'fa fa-envelope-o';
                    }
                    else if (tray.structuralEntityType.code === 'DOC') {
                        return 'fa fa-file-o';
                    }
                };
                HomeController.prototype.getTreatedAndCadenceDetails = function () {
                    var _this = this;
                    this.openPopin = true;
                    this.homeService.loadTreatedByActionData().then(function (data) {
                        if (data.length) {
                            _this.totalCadence = 0;
                            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                                var line = data_1[_i];
                                _this.totalCadence += line.timeClassfication;
                                _this.totalCadence += line.timeIndexation;
                                _this.totalCadence += line.timeRedirection;
                                _this.totalCadence += line.timeRejet;
                                _this.totalCadence += line.timeQualityCtrl;
                            }
                        }
                        _this.treatedAndCadence = data;
                    });
                };
                HomeController.prototype.getUriOfTrayByTypeAndId = function (trayType, trayId) {
                    if (trayType == 'STRUCT') {
                        return "#/control-image/treatment/" + trayId;
                    }
                    else if (trayType == 'RJTSTRUCT') {
                        return "#/control-image/reject/" + trayId;
                    }
                    return "#/tray-detail/" + trayId;
                };
                HomeController.$inject = ["TrayService", "HomeService", "AuthSharedService", "$scope", "hotkeys", "$timeout"];
                return HomeController;
            }());
            controller.HomeController = HomeController;
            demat.app.controller("HomeController", HomeController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var HomeService = (function (_super) {
                __extends(HomeService, _super);
                function HomeService(http, q, appSharedService) {
                    _super.call(this, http, q, appSharedService);
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                }
                HomeService.prototype.loadDashbordData = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/dashboard").success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading data for dashboard");
                    });
                    return deferred.promise;
                };
                HomeService.prototype.loadTreatedByActionData = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/dashboard/treatedAndTimeSpent").success(function (data) {
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading nb treated task and cadence");
                    });
                    return deferred.promise;
                };
                return HomeService;
            }(services.GenericService));
            services.HomeService = HomeService;
            demat.app.service("HomeService", HomeService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var ClientService = (function (_super) {
                __extends(ClientService, _super);
                function ClientService(http, q, appSharedService) {
                    _super.call(this, http, q, appSharedService);
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                    this.client = { id: undefined, name: undefined, logo: undefined, enable: false };
                }
                ClientService.prototype.loadCurrentClient = function () {
                    var _this = this;
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/clients/current").success(function (data) {
                        _this.refreshSharedClient(data);
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading current client');
                    });
                    return deferred.promise;
                };
                ClientService.prototype.updateClient = function (client) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/clients", client).success(function (data) {
                        _this.refreshSharedClient(data);
                        _this.appSharedService.closeLoading();
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject('problem occured when create client');
                    });
                    return deferred.promise;
                };
                ClientService.prototype.refreshSharedClient = function (client) {
                    this.client.id = client.id;
                    this.client.logo = client.logo;
                    this.client.name = client.name;
                    this.client.enable = client.enable;
                };
                return ClientService;
            }(services.GenericService));
            services.ClientService = ClientService;
            demat.app.service('ClientService', ClientService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var NavigationController = (function () {
                function NavigationController(trayService, clientService, hotkeys, $scope, $location, $timeout) {
                    this.trayService = trayService;
                    this.clientService = clientService;
                    this.hotkeys = hotkeys;
                    this.$scope = $scope;
                    this.$location = $location;
                    this.$timeout = $timeout;
                    this.trays = this.trayService.trays;
                    this.client = this.clientService.client;
                    this.clientService.loadCurrentClient();
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+h', description: 'Page d\'Accueil', callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#idLinkHome').click();
                            });
                        }
                    });
                }
                NavigationController.prototype.refreshTrays = function () {
                    this.trayService.loadTrays();
                };
                NavigationController.prototype.toggleHelp = function () {
                    this.hotkeys.toggleCheatSheet();
                };
                NavigationController.prototype.goHome = function () {
                    this.$location.path("/home");
                };
                NavigationController.$inject = ["TrayService", "ClientService", "hotkeys", "$scope", "$location", "$timeout"];
                return NavigationController;
            }());
            controller.NavigationController = NavigationController;
            demat.app.controller("NavigationController", NavigationController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var Session = (function () {
                function Session() {
                    this.userRoles = [];
                    return this;
                }
                Session.prototype.create = function (data) {
                    this.id = data.id;
                    this.login = data.login;
                    this.firstName = data.firstName;
                    this.honorific = data.honorific;
                    this.lastName = data.lastName;
                    this.email = data.email;
                    this.phone = data.phone;
                    this.authoritiesAsString = data.authoritiesAsString;
                    this.userRoles = [];
                    angular.forEach(data.authorities, function (value, key) {
                        this.push(value.label);
                    }, this.userRoles);
                };
                Session.prototype.invalidate = function () {
                    this.id = null;
                    this.login = null;
                    this.firstName = null;
                    this.lastName = null;
                    this.civility = null;
                    this.email = null;
                    this.phone = null;
                    this.userRoles = null;
                };
                return Session;
            }());
            services.Session = Session;
            demat.app.service("Session", Session);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            demat.app.controller('TranslateController', function ($translate, $scope) {
                $scope.changeLanguage = function (langKey) {
                    $translate.use(langKey);
                };
            });
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var UserController = (function () {
                function UserController(adminUserService) {
                    this.adminUserService = adminUserService;
                    this.openPopinConfirmChangePassword = false;
                }
                UserController.prototype.resetFormChangePwd = function () {
                    this.passWordNotIdentique = undefined;
                    this.oldPassword = undefined;
                    this.newPassword = undefined;
                    this.confirmPassword = undefined;
                };
                UserController.prototype.isFormChangePwdFilled = function () {
                    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };
                UserController.prototype.prepareChangePassword = function () {
                    if (this.newPassword !== this.confirmPassword) {
                        this.passWordNotIdentique = true;
                    }
                    else {
                        this.openPopinConfirmChangePassword = true;
                    }
                };
                UserController.prototype.changePassword = function () {
                    var _this = this;
                    this.adminUserService.updateUserPassword(this.oldPassword, this.newPassword).then(function () {
                        _this.openPopinConfirmChangePassword = false;
                        _this.oldPassword = undefined;
                        _this.newPassword = undefined;
                        _this.confirmPassword = undefined;
                    });
                };
                UserController.$inject = ["AdminUserService"];
                return UserController;
            }());
            controller.UserController = UserController;
            demat.app.controller("UserController", UserController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            var controlimage;
            (function (controlimage) {
                "use strict";
                var ControlImageDetailService = (function () {
                    function ControlImageDetailService(http, q, appSharedService, filter) {
                        this.http = http;
                        this.q = q;
                        this.appSharedService = appSharedService;
                        this.filter = filter;
                        this.httpAddress = "http://localhost:8080";
                    }
                    ControlImageDetailService.prototype.loadBatch = function (batchId, trayId) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.get(this.httpAddress + "/control-image/detail/" + batchId + "/tray/" + trayId)
                            .success(function (data) {
                            _this.appSharedService.closeLoading();
                            deferred.resolve(data);
                        }).catch(function (error) {
                            deferred.reject("problem occured when loading batchs : " + batchId);
                        });
                        return deferred.promise;
                    };
                    ControlImageDetailService.prototype.validateEnvelope = function (envelope) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.post(this.httpAddress + "/control-image/detail/envelope/validate", envelope)
                            .success(function (data) {
                            _this.appSharedService.closeLoading();
                            deferred.resolve(data);
                        }).catch(function (error) {
                            deferred.reject("problem occured when save envelope");
                        });
                        return deferred.promise;
                    };
                    ControlImageDetailService.prototype.saveEnvelope = function (envelope) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.post(this.httpAddress + "/control-image/detail/envelope", envelope)
                            .success(function (data) {
                            _this.appSharedService.closeLoading();
                            deferred.resolve(data);
                        }).catch(function (error) {
                            deferred.reject("problem occured when save page");
                        });
                        return deferred.promise;
                    };
                    ControlImageDetailService.prototype.saveDocument = function (document) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.post(this.httpAddress + "/control-image/detail/document", document)
                            .success(function (data) {
                            _this.appSharedService.closeLoading();
                            deferred.resolve(data);
                        }).catch(function (error) {
                            deferred.reject("problem occured when save page");
                        });
                        return deferred.promise;
                    };
                    ControlImageDetailService.prototype.savePage = function (page) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.post(this.httpAddress + "/control-image/detail/page", page)
                            .success(function (data) {
                            _this.appSharedService.closeLoading();
                            deferred.resolve(data);
                        }).catch(function (error) {
                            deferred.reject("problem occured when save page");
                        });
                        return deferred.promise;
                    };
                    ControlImageDetailService.prototype.getEnvelopeUnlockedByTrayAndBatch = function (batchId, trayId) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.get(this.httpAddress + "/control-image/detail/" + batchId + "/tray/" + trayId + "/envelopes/unlocked").success(function (data) {
                            _this.appSharedService.closeLoading();
                            deferred.resolve(data);
                        }).catch(function (error) {
                            deferred.reject("problem occured when loading batchs : " + trayId);
                        });
                        return deferred.promise;
                    };
                    ControlImageDetailService.prototype.printBatch = function (batchId) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.get(this.httpAddress + "/exchange/export/batch/" + batchId + "/pdf", { responseType: 'arraybuffer' }).success(function (data) {
                            deferred.resolve(data);
                            _this.appSharedService.closeLoading();
                        }).catch(function (error) {
                            deferred.reject('problem occured when exporting batch into pdf file');
                        });
                        return deferred.promise;
                    };
                    ControlImageDetailService.$inject = ["$http", "$q", "AppSharedService", "$filter"];
                    return ControlImageDetailService;
                }());
                controlimage.ControlImageDetailService = ControlImageDetailService;
                demat.app.service("ControlImageDetailService", ControlImageDetailService);
            })(controlimage = services.controlimage || (services.controlimage = {}));
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            var controlimage;
            (function (controlimage) {
                "use strict";
                var ControlImageRejectService = (function () {
                    function ControlImageRejectService(http, q, appSharedService, filter) {
                        this.http = http;
                        this.q = q;
                        this.appSharedService = appSharedService;
                        this.filter = filter;
                        this.httpAddress = "http://localhost:8080";
                    }
                    ControlImageRejectService.prototype.loadBatchs = function (trayId, search) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.post(this.httpAddress + "/control-image/reject/" + trayId, search).success(function (data) {
                            _this.appSharedService.closeLoading();
                            deferred.resolve(data);
                        }).catch(function (error) {
                            deferred.reject("problem occured when loading batchs : " + trayId);
                        });
                        return deferred.promise;
                    };
                    ControlImageRejectService.$inject = ["$http", "$q", "AppSharedService", "$filter"];
                    return ControlImageRejectService;
                }());
                controlimage.ControlImageRejectService = ControlImageRejectService;
                demat.app.service("ControlImageRejectService", ControlImageRejectService);
            })(controlimage = services.controlimage || (services.controlimage = {}));
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            var controlimage;
            (function (controlimage) {
                "use strict";
                var ControlImageTreatmentService = (function () {
                    function ControlImageTreatmentService(http, q, appSharedService, filter) {
                        this.http = http;
                        this.q = q;
                        this.appSharedService = appSharedService;
                        this.filter = filter;
                        this.httpAddress = "http://localhost:8080";
                    }
                    ControlImageTreatmentService.prototype.loadBatchs = function (trayId, search) {
                        var _this = this;
                        this.appSharedService.displayLoading();
                        var deferred = this.q.defer();
                        this.http.post(this.httpAddress + "/control-image/treatment/" + trayId, search).success(function (data) {
                            _this.appSharedService.closeLoading();
                            deferred.resolve(data);
                        }).catch(function (error) {
                            deferred.reject("problem occured when loading batchs : " + trayId);
                        });
                        return deferred.promise;
                    };
                    ControlImageTreatmentService.$inject = ["$http", "$q", "AppSharedService", "$filter"];
                    return ControlImageTreatmentService;
                }());
                controlimage.ControlImageTreatmentService = ControlImageTreatmentService;
                demat.app.service("ControlImageTreatmentService", ControlImageTreatmentService);
            })(controlimage = services.controlimage || (services.controlimage = {}));
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var AdminAppController = (function (_super) {
                __extends(AdminAppController, _super);
                function AdminAppController(clientService, $scope, $location) {
                    _super.call(this);
                    this.clientService = clientService;
                    this.$scope = $scope;
                    this.$location = $location;
                    this.client = angular.copy(this.clientService.client);
                    this.logos = undefined;
                }
                AdminAppController.prototype.updateClient = function () {
                    this.clientService.updateClient(this.client);
                };
                AdminAppController.prototype.cancelUpdateClientparameters = function () {
                    this.client = angular.copy(this.clientService.client);
                };
                AdminAppController.prototype.isClientFilled = function () {
                    return this.client.logo && this.client.name;
                };
                AdminAppController.$inject = ["ClientService", "$scope", "$location"];
                return AdminAppController;
            }(controller.GenericAdminController));
            controller.AdminAppController = AdminAppController;
            demat.app.controller("AdminAppController", AdminAppController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var EntityTypeService = (function () {
                function EntityTypeService(http, appSharedService, q) {
                    this.http = http;
                    this.appSharedService = appSharedService;
                    this.q = q;
                    this.httpAddress = "http://localhost:8081";
                }
                EntityTypeService.prototype.loadEntityType = function (entityType, entityTypeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    console.log(this.httpAddress + "/admin/entity-type/" + entityType + "/" + entityTypeId);
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/entity-type/" + entityType + "/" + entityTypeId).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        var reason = 'problem occured when get entity type by id : ' + entityTypeId;
                        _this.appSharedService.notifyErrorWithObjectError(reason, error);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                };
                EntityTypeService.prototype.loadEntityTypes = function (entityType) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/entity-type/" + entityType).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        var reason = 'problem occured when loading batch types';
                        _this.appSharedService.notifyErrorWithObjectError(reason, error);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                };
                EntityTypeService.prototype.addEntityType = function (entityType, entityTypeModel) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/entity-type/" + entityType, entityTypeModel).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        var reason = 'problem occured when creating entity type';
                        _this.appSharedService.notifyErrorWithObjectError(reason, error);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                };
                EntityTypeService.prototype.updateEntityType = function (entityType, entityTypeModel) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/entity-type/" + entityType, entityTypeModel).success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        var reason = 'problem occured when updating entity type id : ' + entityTypeModel.id;
                        _this.appSharedService.notifyErrorWithObjectError(reason, error.data);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                };
                EntityTypeService.prototype.deleteEntityType = function (entityType, entityTypeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/entity-type/" + entityType + "/" + entityTypeId).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        var reason = 'problem occured when deleting entity type id : ' + entityTypeId;
                        _this.appSharedService.notifyErrorWithObjectError(reason, error);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                };
                EntityTypeService.$inject = ["$http", "AppSharedService", "$q"];
                return EntityTypeService;
            }());
            services.EntityTypeService = EntityTypeService;
            demat.app.service('EntityTypeService', EntityTypeService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var AdminIndexService = (function (_super) {
                __extends(AdminIndexService, _super);
                function AdminIndexService(http, q, appSharedService) {
                    _super.call(this, http, q, appSharedService);
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                }
                AdminIndexService.prototype.getIndexById = function (indexId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    var url = this.endPointAdmin + "/admin/indexes/simples/" + indexId;
                    this.http.get(url).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading index by id');
                    });
                    return deferred.promise;
                };
                AdminIndexService.prototype.loadAllCompositeIndexes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/indexes/composite").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading composite indexes');
                    });
                    return deferred.promise;
                };
                AdminIndexService.prototype.postSimpleIndex = function (simpleIndex) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    var url = this.endPointAdmin + "/admin/indexes/simples";
                    this.http.post(url, simpleIndex).success(function (createdIndex) {
                        deferred.resolve(createdIndex);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating simple index');
                    });
                    return deferred.promise;
                };
                AdminIndexService.prototype.updateSimpleIndex = function (simpleIndex) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    var url = this.endPointAdmin + "/admin/indexes/simples";
                    this.http.put(url, simpleIndex).success(function (updatedIndex) {
                        deferred.resolve(updatedIndex);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        var reason = 'problem occured when update simple index id : ' + simpleIndex.id;
                        _this.appSharedService.notifyErrorWithObjectError(reason, error);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                };
                AdminIndexService.prototype.deleteSimpleIndex = function (indexId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    var url = this.endPointAdmin + "/admin/indexes/simples/" + indexId;
                    this.http.delete(url).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        var reason = 'problem occured when deleting simple index id : ' + indexId;
                        _this.appSharedService.notifyErrorWithObjectError(reason, error);
                        deferred.reject(reason);
                    });
                    return deferred.promise;
                };
                AdminIndexService.prototype.createCompositeIndex = function (compositeIndex) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/indexes/composite", compositeIndex).success(function (createdIndex) {
                        deferred.resolve(createdIndex);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating composite index');
                    });
                    return deferred.promise;
                };
                AdminIndexService.prototype.updateCompositeIndex = function (compositeIndex) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/indexes/composite", compositeIndex).success(function (updateIndex) {
                        deferred.resolve(updateIndex);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating composite index with id : ' + compositeIndex.id);
                    });
                    return deferred.promise;
                };
                AdminIndexService.prototype.deleteCompositeIndex = function (compositeIndexId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/indexes/composite/" + compositeIndexId).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when deleting composite index with id : ' + compositeIndexId);
                    });
                    return deferred.promise;
                };
                return AdminIndexService;
            }(services.GenericService));
            services.AdminIndexService = AdminIndexService;
            demat.app.service('AdminIndexService', AdminIndexService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var URL_SIMPLE_INDEX_BOARD = "/boards-settings/indexes";
            var AdminIndexesController = (function (_super) {
                __extends(AdminIndexesController, _super);
                function AdminIndexesController(boardService) {
                    _super.call(this);
                    this.boardService = boardService;
                }
                AdminIndexesController.prototype.loadBoardIndex = function () {
                    var _this = this;
                    this.boardService.getBoard(URL_SIMPLE_INDEX_BOARD).then(function (board) {
                        _this.board = board;
                        console.info("this.board", _this.board);
                    });
                };
                AdminIndexesController.$inject = ["BoardService"];
                return AdminIndexesController;
            }(controller.GenericAdminController));
            controller.AdminIndexesController = AdminIndexesController;
            demat.app.controller("AdminIndexesController", AdminIndexesController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var AdminIntegrationBatchController = (function (_super) {
                __extends(AdminIntegrationBatchController, _super);
                function AdminIntegrationBatchController(adminService, adminReferencialService, appSharedService, $scope) {
                    _super.call(this);
                    this.adminService = adminService;
                    this.adminReferencialService = adminReferencialService;
                    this.appSharedService = appSharedService;
                    this.$scope = $scope;
                }
                AdminIntegrationBatchController.prototype.loadXPathExpressions = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.adminService.loadXPathExpressions().then(function (result) {
                        _this.xpathExpr = result;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminIntegrationBatchController.prototype.loadRefQueries = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.referentialQueries = [];
                    this.adminReferencialService.loadReferencialQueries().then(function (result) {
                        _this.referentialQueries = result;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminIntegrationBatchController.prototype.loadRegex = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.adminService.loadRegex().then(function (result) {
                        _this.regexList = result;
                        _this.regexListSortable = angular.copy(result);
                        _this.appSharedService.closeLoading();
                    });
                    this.loadRefQueries();
                };
                AdminIntegrationBatchController.prototype.saveXpathExpressions = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.adminService.saveXpathExpressions(this.xpathExpr).then(function (result) {
                        _this.xpathExpr = result;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminIntegrationBatchController.prototype.isRegexFilled = function (regex) {
                    if (regex && regex.label && regex.regex && regex.referencialQuery && regex.referencialQuery.id) {
                        return true;
                    }
                    return false;
                };
                AdminIntegrationBatchController.prototype.createRegex = function () {
                    var _this = this;
                    this.regexAdd.xpathExpr = this.xpathExpr;
                    this.appSharedService.displayLoading();
                    this.adminService.createRegex(this.regexAdd).then(function (regex) {
                        _this.regexList.unshift(regex);
                        _this.regexListSortable.unshift(regex);
                        _this.regexAdd = undefined;
                        _this.openPopinRegexAdd = false;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminIntegrationBatchController.prototype.prepareDeleteRegex = function (reflQuery) {
                    this.regexEdit = reflQuery;
                    this.openPopinRegexConfirm = true;
                };
                AdminIntegrationBatchController.prototype.confirmDeleteRegex = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.openPopinRegexConfirm = false;
                    this.regexEdit.xpathExpr = this.xpathExpr;
                    this.adminService.deleteRegex(this.regexEdit).then(function (response) {
                        if (response.code && response.code.toString() !== '500') {
                            for (var i = 0; i < _this.regexList.length; i++) {
                                if (_this.regexList[i].referencialQuery.id === _this.regexEdit.referencialQuery.id) {
                                    _this.regexList.splice(i, 1);
                                    break;
                                }
                            }
                            for (var i = 0; i < _this.regexListSortable.length; i++) {
                                if (_this.regexListSortable[i].referencialQuery.id === _this.regexEdit.referencialQuery.id) {
                                    _this.regexListSortable.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        else {
                            _this.appSharedService.showAlert(response.message);
                        }
                        _this.regexEdit = undefined;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminIntegrationBatchController.prototype.prepareUpdateRegex = function (regex) {
                    this.regexEdit = angular.copy(regex);
                    this.openPopinRegexEdit = true;
                };
                AdminIntegrationBatchController.prototype.updateRegex = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.openPopinRegexEdit = false;
                    this.regexEdit.xpathExpr = this.xpathExpr;
                    this.adminService.updateRegex(this.regexEdit).then(function (regex) {
                        for (var i = 0; i < _this.regexList.length; i++) {
                            if (_this.regexList[i].referencialQuery.id === regex.referencialQuery.id) {
                                _this.regexList.splice(i, 1, regex);
                                break;
                            }
                        }
                        for (var i = 0; i < _this.regexListSortable.length; i++) {
                            if (_this.regexListSortable[i].referencialQuery.id === regex.referencialQuery.id) {
                                _this.regexListSortable.splice(i, 1, regex);
                                break;
                            }
                        }
                        _this.regexEdit = undefined;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminIntegrationBatchController.prototype.updateRegexPriority = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.adminService.updateRegexPriority(this.regexListSortable).then(function () {
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminIntegrationBatchController.$inject = ["AdminIntegrationBatchService", "AdminReferencialService", "AppSharedService", "$scope"];
                return AdminIntegrationBatchController;
            }(controller.GenericAdminController));
            controller.AdminIntegrationBatchController = AdminIntegrationBatchController;
            demat.app.controller('AdminIntegrationBatchController', AdminIntegrationBatchController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var AdminListService = (function () {
                function AdminListService(http, appSharedService, q) {
                    this.http = http;
                    this.appSharedService = appSharedService;
                    this.q = q;
                    this.httpAddress = "http://localhost:8080";
                }
                AdminListService.prototype.loadLists = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/lists").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading lists');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.createList = function (list) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/lists", list).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating list');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.deleteList = function (listId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/lists/" + listId).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when deleting list id : ' + listId);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.updateList = function (list) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/lists", list).success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating list id : ' + list.id);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.createListItems = function (listId, listItems) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/lists/" + listId + "/items", listItems).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating list items');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.loadDocTypes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/doctypes").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading doctypes');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.createDocType = function (doctype) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/doctypes", doctype).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating doctype');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.deleteDocType = function (doctypeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/doctypes/" + doctypeId).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when deleting doctype id : ' + doctypeId);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.updateDocType = function (doctype) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/doctypes", doctype).success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating doctype id : ' + doctype.id);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.loadEnvTypes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/envtypes").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading envelope types');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.createEnvType = function (envType) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/envtypes", envType).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating envelope type');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.updateEnvType = function (envType) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/envtypes", envType).success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating envelope type id : ' + envType.id);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.deleteEnvType = function (envTypeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/envtypes/" + envTypeId).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when deleting envelope type id : ' + envTypeId);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.loadRejectTypes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/rejectTypes").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading reject types');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.loadStructuralEntityTypes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/structuralEntityTypes").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading Structural Entity types');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.createRejectType = function (rejectType) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/rejectTypes", rejectType).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating reject type');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.updateRejectType = function (rejectType) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/rejectTypes", rejectType).success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating reject type id : ' + rejectType.id);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.deleteRejectType = function (rejectTypeId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/rejectTypes/" + rejectTypeId).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when deleting reject type id : ' + rejectTypeId);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.loadCategories = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/categories").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading categories');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.createCategory = function (category) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/categories", category).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating new category');
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.updateCategory = function (category) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/categories", category).success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating category id : ' + category.id);
                    });
                    return deferred.promise;
                };
                AdminListService.prototype.deleteCategory = function (categoryId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/categories/" + categoryId).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when deleting category type id : ' + categoryId);
                    });
                    return deferred.promise;
                };
                AdminListService.$inject = ["$http", "AppSharedService", "$q"];
                return AdminListService;
            }());
            services.AdminListService = AdminListService;
            demat.app.service('AdminListService', AdminListService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var AdminListsController = (function (_super) {
                __extends(AdminListsController, _super);
                function AdminListsController(adminListService, adminIndexService, constants) {
                    var _this = this;
                    _super.call(this);
                    this.adminListService = adminListService;
                    this.adminIndexService = adminIndexService;
                    this.constants = constants;
                    this.openPopinConfirmEditListItem = false;
                    this.editItemPopinListItem = false;
                    this.adminListService.loadStructuralEntityTypes().then(function (structuralEntityTypes) {
                        _this.structuralEntityTypes = structuralEntityTypes;
                    });
                }
                AdminListsController.prototype.loadLists = function () {
                    var _this = this;
                    this.adminListService.loadLists().then(function (lists) {
                        _this.lists = lists;
                    });
                };
                AdminListsController.prototype.createList = function () {
                    var _this = this;
                    if (this.listAdd && this.listAdd.label) {
                        this.adminListService.createList(this.listAdd).then(function (list) {
                            _this.loadLists();
                            _this.listAdd = undefined;
                            _this.openPopinAdd = false;
                        });
                    }
                };
                AdminListsController.prototype.prepareDeleteList = function (list) {
                    this.listEdit = list;
                    this.openPopinConfirm = true;
                };
                AdminListsController.prototype.confirmDeleteList = function () {
                    var _this = this;
                    this.adminListService.deleteList(this.listEdit.id).then(function () {
                        for (var i = 0; i < _this.lists.length; i++) {
                            if (_this.lists[i].id === _this.listEdit.id) {
                                _this.lists.splice(i, 1);
                                break;
                            }
                        }
                        _this.openPopinConfirm = false;
                        _this.listEdit = undefined;
                    });
                };
                AdminListsController.prototype.prepareUpdateList = function (list) {
                    this.listEdit = angular.copy(list);
                    if (!this.listEdit.items) {
                        this.listEdit.items = [];
                    }
                    this.openPopinEdit = true;
                };
                AdminListsController.prototype.updateList = function () {
                    var _this = this;
                    this.adminListService.updateList(this.listEdit).then(function (list) {
                        for (var i = 0; i < _this.lists.length; i++) {
                            if (_this.lists[i].id === list.id) {
                                _this.lists.splice(i, 1);
                                _this.lists.unshift(list);
                                break;
                            }
                        }
                        _this.openPopinEdit = false;
                        _this.listEdit = undefined;
                    });
                };
                AdminListsController.prototype.manageListItems = function (list) {
                    this.listEdit = angular.copy(list);
                    this.openPopinConfirmEditListItem = true;
                };
                AdminListsController.prototype.deleteItemFromList = function (itemIndex) {
                    this.listEdit.items.splice(itemIndex, 1);
                    return true;
                };
                AdminListsController.prototype.addItemToList = function (itemToAdd) {
                    this.listEdit.items.push(angular.copy(itemToAdd));
                    if (itemToAdd.defaultItem == true) {
                        this.setDefaultListItem(this.listEdit.items.length - 1);
                    }
                    itemToAdd.label = undefined;
                    itemToAdd.code = undefined;
                    itemToAdd.defaultItem = undefined;
                };
                AdminListsController.prototype.validateListItems = function () {
                    var _this = this;
                    console.log(angular.toJson(this.listEdit.items));
                    this.adminListService.createListItems(this.listEdit.id, this.listEdit.items).then(function (items) {
                        _this.openPopinConfirmEditListItem = false;
                        for (var _i = 0, _a = _this.lists; _i < _a.length; _i++) {
                            var list = _a[_i];
                            if (list.id === _this.listEdit.id) {
                                list.items = items;
                                _this.listEdit = undefined;
                                break;
                            }
                        }
                    });
                };
                AdminListsController.prototype.setDefaultListItem = function (index) {
                    for (var i = 0; i < this.listEdit.items.length; i++) {
                        if (i !== index) {
                            this.listEdit.items[i].defaultItem = false;
                        }
                    }
                };
                AdminListsController.prototype.loadDocTypes = function () {
                    var _this = this;
                    this.adminListService.loadDocTypes().then(function (doctyes) {
                        _this.doctyes = doctyes;
                    });
                    this.loadAllIndexes();
                };
                AdminListsController.prototype.createDocType = function () {
                    var _this = this;
                    if (this.doctypeAdd && this.doctypeAdd.label) {
                        this.adminListService.createDocType(this.doctypeAdd).then(function (doctype) {
                            _this.doctyes.unshift(doctype);
                            _this.doctypeAdd = undefined;
                            _this.openPopinDoctypeAdd = false;
                        });
                    }
                };
                AdminListsController.prototype.prepareDeleteDocType = function (doctype) {
                    this.doctypeEdit = doctype;
                    this.openPopinDoctypeConfirm = true;
                };
                AdminListsController.prototype.confirmDeleteDocType = function () {
                    var _this = this;
                    this.adminListService.deleteDocType(this.doctypeEdit.id).then(function () {
                        for (var i = 0; i < _this.doctyes.length; i++) {
                            if (_this.doctyes[i].id === _this.doctypeEdit.id) {
                                _this.doctyes.splice(i, 1);
                                break;
                            }
                        }
                        _this.openPopinDoctypeConfirm = false;
                        _this.doctypeEdit = undefined;
                    });
                };
                AdminListsController.prototype.prepareUpdateDocType = function (doctype) {
                    this.doctypeEdit = angular.copy(doctype);
                    this.openPopinDoctypeEdit = true;
                };
                AdminListsController.prototype.updateDocType = function () {
                    var _this = this;
                    this.adminListService.updateDocType(this.doctypeEdit).then(function (doctype) {
                        for (var i = 0; i < _this.doctyes.length; i++) {
                            if (_this.doctyes[i].id === doctype.id) {
                                _this.doctyes.splice(i, 1);
                                _this.doctyes.unshift(doctype);
                                break;
                            }
                        }
                        _this.openPopinDoctypeEdit = false;
                        _this.doctypeEdit = undefined;
                    });
                };
                AdminListsController.prototype.loadEnvTypes = function () {
                    var _this = this;
                    this.loadDocTypes();
                    this.adminListService.loadEnvTypes().then(function (envTypes) {
                        _this.envTypes = envTypes;
                    });
                };
                AdminListsController.prototype.createEnvtype = function () {
                    var _this = this;
                    if (this.envtypeAdd && this.envtypeAdd.label) {
                        this.adminListService.createEnvType(this.envtypeAdd).then(function (envType) {
                            _this.envTypes.unshift(envType);
                            _this.envtypeAdd = undefined;
                            _this.openPopinEnvtypeAdd = false;
                        });
                    }
                };
                AdminListsController.prototype.prepareDeleteEnvType = function (envType) {
                    this.envtypeEdit = envType;
                    this.openPopinEnvtypeConfirm = true;
                };
                AdminListsController.prototype.confirmDeleteEnvType = function () {
                    var _this = this;
                    this.adminListService.deleteEnvType(this.envtypeEdit.id).then(function () {
                        for (var i = 0; i < _this.envTypes.length; i++) {
                            if (_this.envTypes[i].id === _this.envtypeEdit.id) {
                                _this.envTypes.splice(i, 1);
                                break;
                            }
                        }
                        _this.openPopinEnvtypeConfirm = false;
                        _this.envtypeEdit = undefined;
                    });
                };
                AdminListsController.prototype.prepareUpdateEnvType = function (envType) {
                    this.envtypeEdit = angular.copy(envType);
                    this.openPopinEnvtypeEdit = true;
                };
                AdminListsController.prototype.updateEnvType = function () {
                    var _this = this;
                    this.adminListService.updateEnvType(this.envtypeEdit).then(function (envtype) {
                        for (var i = 0; i < _this.envTypes.length; i++) {
                            if (_this.envTypes[i].id === envtype.id) {
                                _this.envTypes.splice(i, 1);
                                _this.envTypes.unshift(envtype);
                                break;
                            }
                        }
                        _this.openPopinEnvtypeEdit = false;
                        _this.envtypeEdit = undefined;
                    });
                };
                AdminListsController.prototype.loadAllIndexes = function () {
                    var _this = this;
                    this.adminIndexService.loadAllIndexes().then(function (indexes) {
                        _this.allIndexes = indexes;
                    });
                };
                AdminListsController.prototype.loadRejectTypes = function () {
                    var _this = this;
                    this.loadDocTypes();
                    this.adminListService.loadRejectTypes().then(function (rejectTypes) {
                        _this.rejectTypes = rejectTypes;
                        console.log('this.rejectTypes => ' + _this.rejectTypes);
                    });
                };
                AdminListsController.prototype.createRejectType = function () {
                    var _this = this;
                    if (this.rejectTypeAdd && this.rejectTypeAdd.label) {
                        console.log(this.rejectTypeAdd);
                        this.adminListService.createRejectType(this.rejectTypeAdd).then(function (rejectType) {
                            _this.rejectTypes.unshift(rejectType);
                            _this.rejectTypeAdd = undefined;
                            _this.openPopinRejectTypeAdd = false;
                        });
                    }
                };
                AdminListsController.prototype.prepareUpdateRejectType = function (rejectType) {
                    console.log(this.rejectTypeEdit);
                    this.rejectTypeEdit = angular.copy(rejectType);
                    this.openPopinRejectTypeEdit = true;
                };
                AdminListsController.prototype.updateRejectType = function () {
                    var _this = this;
                    console.log(this.rejectTypeEdit);
                    this.adminListService.updateRejectType(this.rejectTypeEdit).then(function (rejectType) {
                        for (var i = 0; i < _this.rejectTypes.length; i++) {
                            if (_this.rejectTypes[i].id === rejectType.id) {
                                _this.rejectTypes.splice(i, 1);
                                _this.rejectTypes.unshift(rejectType);
                                break;
                            }
                        }
                        _this.rejectTypeEdit = undefined;
                        _this.openPopinRejectTypeEdit = false;
                    });
                };
                AdminListsController.prototype.prepareDeleteRejectType = function (rejectType) {
                    this.rejectTypeEdit = rejectType;
                    this.openPopinRejectTypeConfirm = true;
                };
                AdminListsController.prototype.confirmDeleteRejectType = function () {
                    var _this = this;
                    this.adminListService.deleteRejectType(this.rejectTypeEdit.id).then(function () {
                        for (var i = 0; i < _this.rejectTypes.length; i++) {
                            if (_this.rejectTypes[i].id === _this.rejectTypeEdit.id) {
                                _this.rejectTypes.splice(i, 1);
                                break;
                            }
                        }
                        _this.openPopinRejectTypeConfirm = false;
                        _this.rejectTypeEdit = undefined;
                    });
                };
                AdminListsController.prototype.loadCategories = function () {
                    var _this = this;
                    this.adminListService.loadCategories().then(function (categories) {
                        _this.categories = categories;
                    });
                };
                AdminListsController.prototype.getCategoryColorValues = function () {
                    return this.constants.colors;
                };
                AdminListsController.prototype.getCategoryTypeValues = function () {
                    return this.constants.categoryTypes;
                };
                AdminListsController.prototype.isCategoryFilled = function (category) {
                    if (category && category.label && category.type) {
                        return true;
                    }
                    return false;
                };
                AdminListsController.prototype.createCategory = function () {
                    var _this = this;
                    this.adminListService.createCategory(this.categoryAdd).then(function (category) {
                        _this.categories.unshift(category);
                        _this.categoryAdd = undefined;
                        _this.openPopinCategoryAdd = false;
                    });
                };
                AdminListsController.prototype.prepareUpdateCategory = function (category) {
                    this.categoryEdit = angular.copy(category);
                    this.openPopinCategoryEdit = true;
                };
                AdminListsController.prototype.updateCategory = function () {
                    var _this = this;
                    this.adminListService.updateCategory(this.categoryEdit).then(function (category) {
                        for (var i = 0; i < _this.categories.length; i++) {
                            if (_this.categories[i].id === category.id) {
                                _this.categories.splice(i, 1);
                                _this.categories.unshift(category);
                                break;
                            }
                        }
                        _this.categoryEdit = undefined;
                        _this.openPopinCategoryEdit = false;
                    });
                };
                AdminListsController.prototype.prepareDeleteCategory = function (category) {
                    this.categoryEdit = category;
                    this.openPopinCategoryConfirm = true;
                };
                AdminListsController.prototype.confirmDeleteCategory = function () {
                    var _this = this;
                    this.adminListService.deleteCategory(this.categoryEdit.id).then(function () {
                        for (var i = 0; i < _this.categories.length; i++) {
                            if (_this.categories[i].id === _this.categoryEdit.id) {
                                _this.categories.splice(i, 1);
                                break;
                            }
                        }
                        _this.openPopinCategoryConfirm = false;
                        _this.categoryEdit = undefined;
                    });
                };
                AdminListsController.$inject = ["AdminListService", "AdminIndexService", "Constants"];
                return AdminListsController;
            }(controller.GenericAdminController));
            controller.AdminListsController = AdminListsController;
            demat.app.controller("AdminListsController", AdminListsController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var AdminReferencialController = (function (_super) {
                __extends(AdminReferencialController, _super);
                function AdminReferencialController(adminService, appSharedService, $scope) {
                    _super.call(this);
                    this.adminService = adminService;
                    this.appSharedService = appSharedService;
                    this.$scope = $scope;
                }
                AdminReferencialController.prototype.loadRefQueries = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.referentialQueries = [];
                    this.adminService.loadReferencialQueries().then(function (result) {
                        _this.referentialQueries = result;
                        _this.appSharedService.closeLoading();
                    });
                    this.loadRefTypeQueries();
                };
                AdminReferencialController.prototype.loadRefTypeQueries = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.referencialTypeQueries = [];
                    this.adminService.loadReferencialTypeQueries().then(function (result) {
                        _this.referencialTypeQueries = result;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminReferencialController.prototype.createReferencialQuery = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.adminService.createReferencialQuery(this.referencialQueryAdd).then(function (referencialQuery) {
                        _this.referentialQueries.unshift(referencialQuery);
                        _this.referencialQueryAdd = undefined;
                        _this.openPopinAdd = false;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminReferencialController.prototype.prepareDeleteRefQuery = function (reflQuery) {
                    this.referencialQueryEdit = reflQuery;
                    this.openPopinConfirm = true;
                };
                AdminReferencialController.prototype.confirmDeleteRefQuery = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.openPopinConfirm = false;
                    this.adminService.deleteReferencialQuery(this.referencialQueryEdit.id).then(function (response) {
                        if (response.code && response.code.toString() !== '500') {
                            for (var i = 0; i < _this.referentialQueries.length; i++) {
                                if (_this.referentialQueries[i].id === _this.referencialQueryEdit.id) {
                                    _this.referentialQueries.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        else {
                            _this.appSharedService.showAlert(response.message);
                        }
                        _this.referencialQueryEdit = undefined;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminReferencialController.prototype.prepareUpdateRefQuery = function (reflQuery) {
                    this.referencialQueryEdit = angular.copy(reflQuery);
                    this.openPopinEdit = true;
                };
                AdminReferencialController.prototype.updateRefQuery = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    this.openPopinEdit = false;
                    this.adminService.updateReferencialQuery(this.referencialQueryEdit).then(function (referencialQuery) {
                        for (var i = 0; i < _this.referentialQueries.length; i++) {
                            if (_this.referentialQueries[i].id === referencialQuery.id) {
                                _this.referentialQueries.splice(i, 1, referencialQuery);
                                break;
                            }
                        }
                        _this.referencialQueryEdit = undefined;
                        _this.appSharedService.closeLoading();
                    });
                };
                AdminReferencialController.prototype.isRefQueryFilled = function (refQuery) {
                    if (refQuery && refQuery.index && refQuery.label && refQuery.type && refQuery.referencialType.id) {
                        return true;
                    }
                    return false;
                };
                AdminReferencialController.$inject = ["AdminReferencialService", "AppSharedService", "$scope"];
                return AdminReferencialController;
            }(controller.GenericAdminController));
            controller.AdminReferencialController = AdminReferencialController;
            demat.app.controller("AdminReferencialController", AdminReferencialController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var AdminTrayController = (function (_super) {
                __extends(AdminTrayController, _super);
                function AdminTrayController(adminTrayService, adminIndexService, categoryService, $location) {
                    var _this = this;
                    _super.call(this);
                    this.adminTrayService = adminTrayService;
                    this.adminIndexService = adminIndexService;
                    this.categoryService = categoryService;
                    this.$location = $location;
                    this.sortableOptions = { connectWith: '.connectedList' };
                    this.trayDocTypesAffectation = {
                        tray: undefined,
                        affectedDocTypes: undefined,
                        unaffectedDocTypes: undefined
                    };
                    this.trayEnvTypesAffectation = { tray: undefined, affectedEnvTypes: undefined, unaffectedEnvTypes: undefined };
                    this.trayRolesAffectation = { tray: undefined, affectedRoles: [], unaffectedRoles: [] };
                    this.trayRejectsAffectation = { tray: undefined, affectedRejects: [], unaffectedRejects: [] };
                    this.trayIndexesAffectation = { tray: undefined, affectedIndexes: [], unaffectedIndexes: [] };
                    this.loadAllTrays();
                    this.loadAllTrayTypes();
                    this.loadAllStructuralEntityType();
                    this.loadAllTrayRejects();
                    this.loadAllTrayRoles();
                    this.loadAllTrayIndexes();
                    this.loadAllEnvTypes();
                    this.loadAllDocTypes();
                    this.loadAllCategories();
                    adminTrayService.loadTraysCriterion().then(function (data) {
                        _this.searchCriterion = data;
                    });
                }
                AdminTrayController.prototype.loadAllTrays = function () {
                    var _this = this;
                    this.adminTrayService.loadTrays().then(function (trays) {
                        _this.trays = trays;
                    });
                };
                AdminTrayController.prototype.loadAllTrayTypes = function () {
                    var _this = this;
                    this.adminTrayService.loadTrayTypes().then(function (trayTypes) {
                        _this.trayTypes = trayTypes;
                    });
                };
                AdminTrayController.prototype.loadAllStructuralEntityType = function () {
                    var _this = this;
                    this.adminTrayService.loadStructuralEntityType().then(function (structuralEntityTypes) {
                        _this.structuralEntityTypes = structuralEntityTypes;
                    });
                };
                AdminTrayController.prototype.loadAllDocTypes = function () {
                    var _this = this;
                    this.adminTrayService.loadAllDocTypes().then(function (docTypes) {
                        _this.allDocTypes = docTypes;
                    });
                };
                AdminTrayController.prototype.loadAllEnvTypes = function () {
                    var _this = this;
                    this.adminTrayService.loadAllEnvTypes().then(function (envTypes) {
                        _this.allEnvTypes = envTypes;
                    });
                };
                AdminTrayController.prototype.createTray = function () {
                    var _this = this;
                    if (this.trayAdd && this.trayAdd.type) {
                        this.adminTrayService.createTray(this.trayAdd).then(function (tray) {
                            _this.trays.unshift(tray);
                            _this.trayAdd = undefined;
                            _this.openPopinAdd = false;
                        });
                    }
                };
                AdminTrayController.prototype.isTrayFilled = function (tray) {
                    if (tray && tray.label && tray.type && tray.color && tray.icon && tray.structuralEntityType) {
                        return true;
                    }
                    return false;
                };
                AdminTrayController.prototype.prepareDeleteTray = function (tray) {
                    this.trayEdit = tray;
                    this.openPopinConfirm = true;
                };
                AdminTrayController.prototype.confirmDeleteTray = function () {
                    var _this = this;
                    this.adminTrayService.deleteTray(this.trayEdit.id).then(function () {
                        for (var i = 0; i < _this.trays.length; i++) {
                            if (_this.trays[i].id === _this.trayEdit.id) {
                                _this.trays.splice(i, 1);
                                break;
                            }
                        }
                        _this.openPopinConfirm = false;
                        _this.trayEdit = undefined;
                    });
                };
                AdminTrayController.prototype.prepareUpdateTray = function (tray) {
                    this.trayEdit = angular.copy(tray);
                    this.openPopinEdit = true;
                };
                AdminTrayController.prototype.updateTray = function () {
                    var _this = this;
                    this.adminTrayService.updateTray(this.trayEdit).then(function (tray) {
                        for (var i = 0; i < _this.trays.length; i++) {
                            if (_this.trays[i].id === tray.id) {
                                _this.trays.splice(i, 1, tray);
                                break;
                            }
                        }
                        _this.openPopinEdit = false;
                        _this.trayEdit = undefined;
                    });
                };
                AdminTrayController.prototype.manageTrayDocType = function (tray) {
                    var _this = this;
                    switch (tray.structuralEntityType.code) {
                        case 'ENV':
                            this.openPopinEnvTypesAffectation = true;
                            this.trayEnvTypesAffectation.tray = tray;
                            this.adminTrayService.loadEnvTypes(tray.id).then(function (envTypes) {
                                _this.trayEnvTypesAffectation.affectedEnvTypes = envTypes;
                                _this.trayEnvTypesAffectation.unaffectedEnvTypes = _this.allEnvTypes;
                                for (var _i = 0, _a = _this.trayEnvTypesAffectation.affectedEnvTypes; _i < _a.length; _i++) {
                                    var affectedEnvType = _a[_i];
                                    for (var i = 0; i < _this.trayEnvTypesAffectation.unaffectedEnvTypes.length; i++) {
                                        if (_this.trayEnvTypesAffectation.unaffectedEnvTypes[i].id === affectedEnvType.id) {
                                            _this.trayEnvTypesAffectation.unaffectedEnvTypes.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                            });
                            break;
                        case 'DOC':
                            this.openPopinDocTypesAffectation = true;
                            this.trayDocTypesAffectation.tray = tray;
                            this.adminTrayService.loadAllDocTypes().then(function (doctypes) {
                                _this.trayDocTypesAffectation.affectedDocTypes = angular.copy(tray.docTypes);
                                _this.trayDocTypesAffectation.unaffectedDocTypes = doctypes;
                                for (var _i = 0, _a = _this.trayDocTypesAffectation.affectedDocTypes; _i < _a.length; _i++) {
                                    var affectedDocType = _a[_i];
                                    for (var i = 0; i < _this.trayDocTypesAffectation.unaffectedDocTypes.length; i++) {
                                        if (_this.trayDocTypesAffectation.unaffectedDocTypes[i].id === affectedDocType.id) {
                                            _this.trayDocTypesAffectation.unaffectedDocTypes.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                            });
                            break;
                        default:
                            break;
                    }
                };
                AdminTrayController.prototype.validateTrayDocTypes = function () {
                    var _this = this;
                    this.adminTrayService.updateTrayDocTypes(this.trayDocTypesAffectation.tray.id, this.trayDocTypesAffectation.affectedDocTypes).then(function () {
                        _this.openPopinDocTypesAffectation = false;
                        _this.loadAllTrays();
                    });
                };
                AdminTrayController.prototype.validateTrayEnvTypes = function () {
                    var _this = this;
                    this.adminTrayService.updateTrayEnvTypes(this.trayEnvTypesAffectation.tray.id, this.trayEnvTypesAffectation.affectedEnvTypes).then(function () {
                        _this.openPopinEnvTypesAffectation = false;
                        _this.loadAllTrays();
                    });
                };
                AdminTrayController.prototype.loadAllTrayRoles = function () {
                    var _this = this;
                    this.adminTrayService.loadAllTrayRoles().then(function (roles) {
                        _this.allRoles = roles;
                    });
                };
                AdminTrayController.prototype.openTrayRolesAffectation = function (tray) {
                    this.openPopinRoleAffectation = true;
                    this.trayRolesAffectation.tray = tray;
                    this.trayRolesAffectation.unaffectedRoles = angular.copy(this.allRoles);
                    this.trayRolesAffectation.affectedRoles = angular.copy(tray.authoritiesAccess);
                    for (var _i = 0, _a = this.trayRolesAffectation.affectedRoles; _i < _a.length; _i++) {
                        var affectedRole = _a[_i];
                        for (var i = 0; i < this.trayRolesAffectation.unaffectedRoles.length; i++) {
                            if (this.trayRolesAffectation.unaffectedRoles[i].id === affectedRole.id) {
                                this.trayRolesAffectation.unaffectedRoles.splice(i, 1);
                                break;
                            }
                        }
                    }
                };
                AdminTrayController.prototype.validateTrayRoles = function () {
                    var _this = this;
                    this.adminTrayService.updateOrCreateTrayRoles(this.trayRolesAffectation.tray.id, this.trayRolesAffectation.affectedRoles).then(function (result) {
                        _this.openPopinRoleAffectation = false;
                        _this.loadAllTrays();
                    });
                };
                AdminTrayController.prototype.loadAllTrayIndexes = function () {
                    var _this = this;
                    this.adminIndexService.loadAllIndexes().then(function (indexes) {
                        _this.allIndexes = indexes;
                    });
                };
                AdminTrayController.prototype.openTrayIndexesAffectation = function (tray) {
                    var _this = this;
                    this.openPopinIndexAffectation = true;
                    this.trayIndexesAffectation.tray = tray;
                    this.trayIndexesAffectation.unaffectedIndexes = angular.copy(this.allIndexes);
                    this.adminTrayService.loadTrayIndexes(tray.id).then(function (trayIndexes) {
                        _this.trayIndexesAffectation.affectedIndexes = angular.copy(trayIndexes);
                        for (var _i = 0, _a = _this.trayIndexesAffectation.affectedIndexes; _i < _a.length; _i++) {
                            var affectedIndex = _a[_i];
                            for (var i = 0; i < _this.trayIndexesAffectation.unaffectedIndexes.length; i++) {
                                if (_this.trayIndexesAffectation.unaffectedIndexes[i].id === affectedIndex.id) {
                                    _this.trayIndexesAffectation.unaffectedIndexes.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
                };
                AdminTrayController.prototype.validateTrayIndexes = function () {
                    var _this = this;
                    this.adminTrayService.updateOrCreateTrayIndexes(this.trayIndexesAffectation.tray.id, this.trayIndexesAffectation.affectedIndexes).then(function (result) {
                        _this.openPopinIndexAffectation = false;
                    });
                };
                AdminTrayController.prototype.loadAllTrayRejects = function () {
                    var _this = this;
                    this.adminTrayService.loadAllTrayRejectTypes().then(function (trayRejects) {
                        _this.allTrayReject = trayRejects;
                    });
                };
                AdminTrayController.prototype.openTrayRejectsAffectation = function (tray) {
                    var _this = this;
                    this.openPopinRejectAffectation = true;
                    this.trayRejectsAffectation.tray = tray;
                    this.trayRejectsAffectation.unaffectedRejects = angular.copy(this.allTrayReject);
                    this.adminTrayService.loadTrayRejectTypes(tray.id).then(function (trayRejects) {
                        _this.trayRejectsAffectation.affectedRejects = angular.copy(trayRejects);
                        for (var _i = 0, _a = _this.trayRejectsAffectation.affectedRejects; _i < _a.length; _i++) {
                            var affectedRole = _a[_i];
                            for (var i = 0; i < _this.trayRejectsAffectation.unaffectedRejects.length; i++) {
                                if (_this.trayRejectsAffectation.unaffectedRejects[i].id === affectedRole.id) {
                                    _this.trayRejectsAffectation.unaffectedRejects.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
                };
                AdminTrayController.prototype.validateTrayRejects = function () {
                    var _this = this;
                    this.adminTrayService.updateOrCreateTrayRejects(this.trayRejectsAffectation.tray.id, this.trayRejectsAffectation.affectedRejects).then(function (result) {
                        _this.openPopinRejectAffectation = false;
                    });
                };
                AdminTrayController.prototype.changeDefaultTray = function (trayId) {
                    for (var _i = 0, _a = this.trays; _i < _a.length; _i++) {
                        var tray = _a[_i];
                        tray.isDefault = tray.id === trayId ? true : false;
                    }
                };
                AdminTrayController.prototype.validateDefaultTray = function () {
                    var _this = this;
                    for (var _i = 0, _a = this.trays; _i < _a.length; _i++) {
                        var tray = _a[_i];
                        if (tray.isDefault) {
                            this.adminTrayService.saveDefaultTray(tray.id).then(function () {
                                _this.openPopinDefaultTray = false;
                            });
                            break;
                        }
                    }
                };
                AdminTrayController.prototype.openTraysPriorityPoPin = function () {
                    this.openPopinTraysPriority = true;
                    this.traysInOrder = angular.copy(this.trays).sort(function (tray1, tray2) {
                        return tray1.order - tray2.order;
                    });
                };
                AdminTrayController.prototype.validateTraysPriority = function () {
                    var _this = this;
                    var listTrayId = [];
                    for (var _i = 0, _a = this.traysInOrder; _i < _a.length; _i++) {
                        var tray = _a[_i];
                        listTrayId.push(tray.id);
                    }
                    this.adminTrayService.saveTraysPriority(listTrayId).then(function () {
                        _this.openPopinTraysPriority = false;
                    });
                };
                AdminTrayController.prototype.openAffectedTrayIndexeEdition = function (index) {
                    this.trayIndexEdit = index;
                    this.openAffectedTrayIndexeEdit = true;
                };
                AdminTrayController.prototype.editTrayIndex = function () {
                    this.openAffectedTrayIndexeEdit = false;
                };
                AdminTrayController.prototype.checkRegexValidity = function (indexRegex) {
                    var isValid = true;
                    try {
                        new RegExp(indexRegex);
                    }
                    catch (e) {
                        isValid = false;
                    }
                    return isValid;
                };
                AdminTrayController.prototype.loadAllCategories = function () {
                    var _this = this;
                    this.categoryService.loadAllCategories().then(function (categories) {
                        _this.categories = categories;
                    });
                };
                AdminTrayController.$inject = ["AdminTrayService", "AdminIndexService", "CategoryService", "$location"];
                return AdminTrayController;
            }(controller.GenericAdminController));
            controller.AdminTrayController = AdminTrayController;
            demat.app.controller("AdminTrayController", AdminTrayController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var AdminTrayService = (function (_super) {
                __extends(AdminTrayService, _super);
                function AdminTrayService(http, q, appSharedService) {
                    _super.call(this, http, q, appSharedService);
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                }
                AdminTrayService.prototype.loadTrays = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/trays").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading trays');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadTrayTypes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/trays/types").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading tray types');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadStructuralEntityType = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/structuralEntityTypes").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading tray types');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadAllTrayRejectTypes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/trays/rejectTypes").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading tray types');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadTrayRejectTypes = function (trayId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/trays/" + trayId + "/rejectTypes").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading reject types for tray id :" + trayId);
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.updateOrCreateTrayRejects = function (trayId, trayRejects) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/trays/" + trayId + "/rejectTypes", trayRejects).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when updating tray reject types");
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.createTray = function (tray) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/trays", tray).success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating new tray');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.updateTray = function (tray) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/trays", tray).success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating tray id ' + tray.id);
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.deleteTray = function (trayId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/trays/" + trayId).success(function () {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when deleting tray id' + trayId);
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadAllDocTypes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/documents/types").success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading all documents types');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadAllEnvTypes = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/trays/envTypes").success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading all envelopes types');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadEnvTypes = function (idTray) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/trays/" + idTray + "/envTypes").success(function (result) {
                        deferred.resolve(result);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading envelopes types for tray id : ' + idTray);
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.updateTrayDocTypes = function (trayId, docTypes) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/trays/" + trayId + "/docTypes", docTypes).success(function (result) {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating tray document types');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.updateTrayEnvTypes = function (trayId, envTypes) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/trays/" + trayId + "/envTypes", envTypes).success(function (result) {
                        deferred.resolve();
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating tray envelope types');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadAllTrayRoles = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/roles").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading users roles');
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.updateOrCreateTrayRoles = function (trayId, trayRoles) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/trays/" + trayId + "/roles", trayRoles).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when updating user roles");
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadTrayIndexes = function (trayId) {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/trays/" + trayId + "/indexes").success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading indexes for tray id :" + trayId);
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.updateOrCreateTrayIndexes = function (trayId, indexes) {
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/trays/" + trayId + "/indexes", indexes).success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when updating indexes for tray id :" + trayId);
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.saveDefaultTray = function (trayId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/trays/default", trayId).success(function (data) {
                        deferred.resolve(true);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when updating default tray");
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.saveTraysPriority = function (traysId) {
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/trays/order", traysId).success(function (data) {
                        deferred.resolve(true);
                    }).catch(function (error) {
                        deferred.reject("problem occured when updating trays priority");
                    });
                    return deferred.promise;
                };
                AdminTrayService.prototype.loadTraysCriterion = function () {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/trays/envSearchcriterion").success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading envelope search criterion");
                    });
                    return deferred.promise;
                };
                return AdminTrayService;
            }(services.GenericService));
            services.AdminTrayService = AdminTrayService;
            demat.app.service('AdminTrayService', AdminTrayService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var CategoryService = (function (_super) {
                __extends(CategoryService, _super);
                function CategoryService(http, q, appSharedService) {
                    _super.call(this, http, q, appSharedService);
                    this.http = http;
                    this.q = q;
                    this.appSharedService = appSharedService;
                }
                CategoryService.prototype.loadAllCategories = function () {
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/categories").success(function (data) {
                        deferred.resolve(data);
                    }).catch(function (error) {
                        deferred.reject("problem occured when loading categories");
                    });
                    return deferred.promise;
                };
                return CategoryService;
            }(services.GenericService));
            services.CategoryService = CategoryService;
            demat.app.service('CategoryService', CategoryService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var services;
        (function (services) {
            "use strict";
            var AdminUserService = (function () {
                function AdminUserService(http, appSharedService, q) {
                    this.http = http;
                    this.appSharedService = appSharedService;
                    this.q = q;
                    this.httpAddress = "http://localhost:8080";
                }
                AdminUserService.prototype.loadUsers = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/users").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading users');
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.createUser = function (user) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/users", user).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating new user');
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.deleteUser = function (userId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/users/" + userId).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        console.log(error);
                        deferred.reject('problem occured when deleting user id' + userId);
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.updateUser = function (user) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/users", user).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating user');
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.loadAllUserRoles = function () {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.get(this.httpAddress + "/admin/users/roles").success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when loading users roles');
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.updateOrCreateUserRoles = function (userId, userRoles) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/users/" + userId + "/roles", userRoles).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject("problem occured when updating user roles");
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.updateUserPassword = function (oldPassword, newPassWord) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/security/password", { 'current-password': oldPassword, 'new-password': newPassWord }).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating user password');
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.generateNewUserPassword = function (userId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/users/" + userId + "/generate", {}).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when generating new user password, user id : ' + userId);
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.createRole = function (role) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.post(this.httpAddress + "/admin/users/roles", role).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when creating new role');
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.deleteRole = function (roleId) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.delete(this.httpAddress + "/admin/users/roles/" + roleId).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when deleting role id' + roleId);
                    });
                    return deferred.promise;
                };
                AdminUserService.prototype.updateRole = function (role) {
                    var _this = this;
                    this.appSharedService.displayLoading();
                    var deferred = this.q.defer();
                    this.http.put(this.httpAddress + "/admin/users/roles", role).success(function (data) {
                        deferred.resolve(data);
                        _this.appSharedService.closeLoading();
                    }).catch(function (error) {
                        deferred.reject('problem occured when updating role');
                    });
                    return deferred.promise;
                };
                AdminUserService.$inject = ["$http", "AppSharedService", "$q"];
                return AdminUserService;
            }());
            services.AdminUserService = AdminUserService;
            demat.app.service('AdminUserService', AdminUserService);
        })(services = demat.services || (demat.services = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var AdminUsersController = (function (_super) {
                __extends(AdminUsersController, _super);
                function AdminUsersController(adminUserService, $location) {
                    _super.call(this);
                    this.adminUserService = adminUserService;
                    this.$location = $location;
                    this.openPopinConfirmGeneratePassword = false;
                    this.sortableOptions = { connectWith: '.connectedList' };
                    this.userRolesAffectation = { user: undefined, affectedRoles: [], unaffectedRoles: [] };
                }
                AdminUsersController.prototype.loadAllRoles = function () {
                    var _this = this;
                    this.currentPage = 1;
                    this.adminUserService.loadAllUserRoles().then(function (roles) {
                        _this.roles = roles;
                    });
                };
                AdminUsersController.prototype.loadAllUsers = function () {
                    var _this = this;
                    this.adminUserService.loadUsers().then(function (result) {
                        _this.users = result;
                        _this.loadAllRoles();
                    });
                };
                AdminUsersController.prototype.isUserFilled = function (user) {
                    if (user && user.honorific && user.lastName && user.firstName && user.email && user.login) {
                        return true;
                    }
                    return false;
                };
                AdminUsersController.prototype.createUser = function () {
                    var _this = this;
                    this.adminUserService.createUser(this.userAdd).then(function (user) {
                        _this.users.unshift(user);
                        _this.userAdd = undefined;
                        _this.openPopinAdd = false;
                    });
                };
                AdminUsersController.prototype.prepareDeleteUser = function (user) {
                    this.userEdit = user;
                    this.openPopinConfirm = true;
                };
                AdminUsersController.prototype.confirmDeleteUser = function () {
                    var _this = this;
                    this.adminUserService.deleteUser(this.userEdit.id).then(function () {
                        for (var i = 0; i < _this.users.length; i++) {
                            if (_this.users[i].id === _this.userEdit.id) {
                                _this.users.splice(i, 1);
                                break;
                            }
                        }
                        _this.openPopinConfirm = false;
                        _this.userEdit = undefined;
                    });
                };
                AdminUsersController.prototype.prepareUpdateUser = function (user) {
                    this.userEdit = angular.copy(user);
                    this.openPopinEdit = true;
                };
                AdminUsersController.prototype.updateUser = function () {
                    var _this = this;
                    this.adminUserService.updateUser(this.userEdit).then(function (user) {
                        for (var i = 0; i < _this.users.length; i++) {
                            if (_this.users[i].id === user.id) {
                                _this.users.splice(i, 1, user);
                                break;
                            }
                        }
                        _this.openPopinEdit = false;
                        _this.userEdit = undefined;
                    });
                };
                AdminUsersController.prototype.openUserRolesAffectation = function (user) {
                    this.openPopinRoleAffectation = true;
                    this.userRolesAffectation.user = user;
                    this.userRolesAffectation.unaffectedRoles = angular.copy(this.roles);
                    this.userRolesAffectation.affectedRoles = angular.copy(user.authorities);
                    for (var _i = 0, _a = this.userRolesAffectation.affectedRoles; _i < _a.length; _i++) {
                        var affectedRole = _a[_i];
                        for (var i = 0; i < this.userRolesAffectation.unaffectedRoles.length; i++) {
                            if (this.userRolesAffectation.unaffectedRoles[i].id === affectedRole.id) {
                                this.userRolesAffectation.unaffectedRoles.splice(i, 1);
                                break;
                            }
                        }
                    }
                };
                AdminUsersController.prototype.validateUserRoles = function () {
                    var _this = this;
                    this.adminUserService.updateOrCreateUserRoles(this.userRolesAffectation.user.id, this.userRolesAffectation.affectedRoles).then(function (result) {
                        _this.openPopinRoleAffectation = false;
                        _this.loadAllUsers();
                    });
                };
                AdminUsersController.prototype.prepareGenerateNewPassword = function (user) {
                    this.userEdit = angular.copy(user);
                    this.openPopinConfirmGeneratePassword = true;
                };
                AdminUsersController.prototype.confirmGenerateNewPassword = function () {
                    var _this = this;
                    this.adminUserService.generateNewUserPassword(this.userEdit.id).then(function () {
                        _this.openPopinConfirmGeneratePassword = false;
                        _this.userEdit = undefined;
                    });
                };
                AdminUsersController.prototype.isRoleFilled = function (role) {
                    if (role && role.label && role.code) {
                        return true;
                    }
                    return false;
                };
                AdminUsersController.prototype.createRole = function () {
                    var _this = this;
                    this.adminUserService.createRole(this.roleAdd).then(function (role) {
                        _this.roles.unshift(role);
                        _this.roleAdd = undefined;
                        _this.openPopinRoleAdd = false;
                    });
                };
                AdminUsersController.prototype.prepareDeleteRole = function (role) {
                    this.roleEdit = role;
                    this.openPopinRoleConfirm = true;
                };
                AdminUsersController.prototype.confirmDeleteRole = function () {
                    var _this = this;
                    this.adminUserService.deleteRole(this.roleEdit.id).then(function () {
                        for (var i = 0; i < _this.roles.length; i++) {
                            if (_this.roles[i].id === _this.roleEdit.id) {
                                _this.roles.splice(i, 1);
                                break;
                            }
                        }
                        _this.openPopinRoleConfirm = false;
                        _this.roleEdit = undefined;
                    });
                };
                AdminUsersController.prototype.prepareUpdateRole = function (role) {
                    this.roleEdit = angular.copy(role);
                    this.openPopinRoleEdit = true;
                };
                AdminUsersController.prototype.updateRole = function () {
                    var _this = this;
                    this.adminUserService.updateRole(this.roleEdit).then(function (role) {
                        for (var i = 0; i < _this.roles.length; i++) {
                            if (_this.roles[i].id === role.id) {
                                _this.roles.splice(i, 1, role);
                                break;
                            }
                        }
                        _this.openPopinRoleEdit = false;
                        _this.roleEdit = undefined;
                    });
                };
                AdminUsersController.$inject = ["AdminUserService", "$location"];
                return AdminUsersController;
            }(controller.GenericAdminController));
            controller.AdminUsersController = AdminUsersController;
            demat.app.controller("AdminUsersController", AdminUsersController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var ControlImageRejectBaseController = (function () {
                function ControlImageRejectBaseController($location, routeParams, authService, controlImageService, trayService) {
                    this.$location = $location;
                    this.routeParams = routeParams;
                    this.authService = authService;
                    this.controlImageService = controlImageService;
                    this.trayService = trayService;
                    this.trayId = routeParams.trayId;
                    this.init();
                }
                ControlImageRejectBaseController.prototype.init = function () {
                    var _this = this;
                    this.trayService.loadTray(this.trayId).then(function (result) {
                        if (!result || !_this.authService.isAuthorized(result.authoritiesAsString.split(','))) {
                            _this.$location.path("home");
                        }
                        _this.initSearch();
                    }, function (error) {
                        _this.$location.path("home");
                    });
                };
                ControlImageRejectBaseController.prototype.initSearch = function () {
                    this.search = { batchId: undefined, sortType: 'createDate', sortReverse: true, startDate: undefined, endDate: undefined, currentPage: 1, itemsPerPage: 18 };
                    this.loadBatchs();
                };
                ControlImageRejectBaseController.prototype.loadBatchs = function () {
                    var _this = this;
                    this.controlImageService.loadBatchs(this.trayId, this.search).then(function (result) {
                        _this.batchs = result.batchs;
                        _this.numberBatch = result.total;
                    }, function (error) {
                        _this.batchs = [];
                        _this.numberBatch = 0;
                    });
                };
                ControlImageRejectBaseController.prototype.open = function (batchId) {
                    this.$location.path("control-image/reject/" + this.trayId + "/detail/" + batchId);
                };
                ControlImageRejectBaseController.$inject = ["$location", "$routeParams", "AuthSharedService", "ControlImageRejectService", "TrayService"];
                return ControlImageRejectBaseController;
            }());
            controller.ControlImageRejectBaseController = ControlImageRejectBaseController;
            demat.app.controller("ControlImageRejectBaseController", ControlImageRejectBaseController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var ControlImageRejectDetailController = (function () {
                function ControlImageRejectDetailController($location, q, $scope, routeParams, authService, controlImageService, trayService) {
                    this.$location = $location;
                    this.q = q;
                    this.$scope = $scope;
                    this.routeParams = routeParams;
                    this.authService = authService;
                    this.controlImageService = controlImageService;
                    this.trayService = trayService;
                    this.$scope = $scope;
                    this.$scope.pagePictures = [];
                    this.$scope.treeData = [];
                    this.trayId = routeParams.trayId;
                    this.batchId = routeParams.batchId;
                    this.init(this.$scope);
                    this.initUi(this.$scope);
                }
                ControlImageRejectDetailController.prototype.initUi = function ($scope) {
                    var contexteSave = this;
                    this.$scope.treeOptions = {
                        beforeDrop: function (e) {
                            var deferred = contexteSave.q.defer();
                            var sourceValue = e.source.nodeScope.node;
                            if (!e.dest.nodesScope.node) {
                                deferred.reject("deplacement racine impossible");
                                return deferred.promise;
                            }
                            var destValue = e.dest.nodesScope.node;
                            if ((sourceValue.elementType - destValue.elementType) != 1) {
                                deferred.reject("deplacement dans un sous type  sup a -1 impossible");
                                return deferred.promise;
                            }
                            if (sourceValue.elementType == "3") {
                                var oldIdDocument = sourceValue.documentId;
                                sourceValue.documentId = destValue.id;
                                contexteSave.controlImageService.savePage(sourceValue).then(function (data) {
                                    contexteSave.generateListImage();
                                    deferred.resolve();
                                }, function (error) {
                                    sourceValue.documentId = oldIdDocument;
                                    deferred.reject("erreur");
                                });
                            }
                            else if (sourceValue.elementType == "2") {
                                var oldIdEnvelope = sourceValue.envelopeId;
                                sourceValue.envelopeId = destValue.id;
                                contexteSave.controlImageService.saveDocument(sourceValue).then(function (data) {
                                    contexteSave.generateListImage();
                                    deferred.resolve();
                                }, function (error) {
                                    sourceValue.envelopeId = oldIdEnvelope;
                                    deferred.reject("erreur");
                                });
                            }
                            return deferred.promise;
                        }
                    };
                    $scope.openPopPinRejectLot = false;
                    $scope.optionsCanvasViewer = { controls: { toolbar: false, image: false, fit: 'height' }, zoom: { value: 0.25, step: 0.01 }, rotate: { value: 90 } };
                    $scope.$on("control-image-view-picture", function (event, node) {
                        if (node.elementType == "3") {
                            $scope.fileInput = 'http://svlvdcom01/data' + node.imagePath;
                        }
                        contexteSave.resetPicture(node.id);
                        node.select = true;
                    });
                    $scope.indexPagePicture = 0;
                    $scope.pagePictures = [];
                };
                ControlImageRejectDetailController.prototype.init = function ($scope) {
                    var _this = this;
                    this.trayService.loadTray(this.trayId).then(function (result) {
                        if (!result || !_this.authService.isAuthorized(result.authoritiesAsString.split(','))) {
                            _this.$location.path("control-image/reject/" + _this.trayId);
                        }
                        _this.trayService.loadRejectTypesByStructuralEntityType(_this.trayId, "BATCH").then(function (data) {
                            $scope.rejectTypesByBatch = data;
                        }, function (error) { });
                        _this.loadBatch($scope);
                    }, function (error) {
                        _this.$location.path("control-image/reject/" + _this.trayId);
                    });
                };
                ControlImageRejectDetailController.prototype.loadBatch = function ($scope) {
                    var _this = this;
                    this.controlImageService.loadBatch(this.batchId, this.trayId).then(function (batch) {
                        _this.controlImageService.getEnvelopeUnlockedByTrayAndBatch(_this.batchId, _this.trayId).then(function (listEnvelope) {
                            $scope.batchTree = batch;
                            _this.remplir_label($scope, listEnvelope);
                            _this.$scope.treeData = [$scope.batchTree];
                        }, function (error) { });
                    }, function (error) {
                        _this.$location.path("control-image/reject/" + _this.trayId);
                    });
                };
                ControlImageRejectDetailController.prototype.generateListImage = function () {
                    while (this.$scope.pagePictures.length) {
                        this.$scope.pagePictures.pop();
                    }
                    for (var indexEnvelope = 0; indexEnvelope < this.$scope.batchTree.envelopes.length; indexEnvelope++) {
                        var envelope = this.$scope.batchTree.envelopes[indexEnvelope];
                        for (var indexDocument = 0; indexDocument < envelope.documents.length; indexDocument++) {
                            var document = envelope.documents[indexDocument];
                            for (var indexPage = 0; indexPage < document.pages.length; indexPage++) {
                                var page = document.pages[indexPage];
                                if (page.deleted)
                                    continue;
                                this.$scope.pagePictures.push(page);
                            }
                        }
                    }
                };
                ControlImageRejectDetailController.prototype.remplir_label = function ($scope, listEnvelope) {
                    $scope.batchTree.label = $scope.batchTree.name;
                    $scope.batchTree.nodes = $scope.batchTree.envelopes;
                    $scope.batchTree.elementType = 0;
                    for (var indexEnvelope = 0; indexEnvelope < $scope.batchTree.envelopes.length; indexEnvelope++) {
                        var envelope = $scope.batchTree.envelopes[indexEnvelope];
                        envelope.label = envelope.number;
                        envelope.nodes = envelope.documents;
                        envelope.hidden = listEnvelope.indexOf(envelope.id) == -1;
                        envelope.elementType = 1;
                        for (var indexDocument = 0; indexDocument < envelope.documents.length; indexDocument++) {
                            var document = envelope.documents[indexDocument];
                            document.label = document.name;
                            document.nodes = document.pages;
                            document.elementType = 2;
                            for (var indexPage = 0; indexPage < document.pages.length; indexPage++) {
                                var page = document.pages[indexPage];
                                if (page.deleted)
                                    continue;
                                page.label = page.name;
                                page.elementType = 3;
                                $scope.pagePictures.push(page);
                            }
                        }
                    }
                    $scope.fileInput = 'http://svlvdcom01/data' + $scope.pagePictures[0].imagePath;
                };
                ControlImageRejectDetailController.prototype.openPopPinRejectBatch = function () {
                    this.$scope.openPopPinRejectLot = true;
                };
                ControlImageRejectDetailController.prototype.rejectBatch = function (rejectId, comment) {
                    this.$scope.openPopPinRejectLot = false;
                    for (var _i = 0, _a = this.$scope.batchTree.envelopes; _i < _a.length; _i++) {
                        var envelope = _a[_i];
                        if (!envelope.hidden && !envelope.deleted) {
                            this.trayService.rejectEnvelope(envelope.id, this.trayId, rejectId, comment);
                        }
                    }
                    this.$location.path("/control-image/reject/" + this.trayId);
                };
                ControlImageRejectDetailController.prototype.deleteBatch = function () {
                    this.trayService.deleteBatch(this.batchId, 'Rejet Controle Image');
                    this.$location.path("/control-image/reject/" + this.trayId);
                };
                ControlImageRejectDetailController.prototype.printBatch = function () {
                    console.log(this.batchId);
                    this.controlImageService.printBatch(this.batchId).then(function (data) {
                        var file = new Blob([data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    });
                };
                ControlImageRejectDetailController.prototype.reset = function () {
                    this.$scope.$broadcast("canvas-viewer-resize", 'page');
                };
                ControlImageRejectDetailController.prototype.rotate = function (val) {
                    this.$scope.$broadcast("canvas-viewer-rotate", val);
                };
                ControlImageRejectDetailController.prototype.zoom = function (val) {
                    this.$scope.$broadcast("canvas-viewer-zoom", val);
                };
                ControlImageRejectDetailController.prototype.prev = function () {
                    this.$scope.indexPagePicture--;
                    if (this.$scope.indexPagePicture < 0) {
                        this.$scope.indexPagePicture = 0;
                    }
                    this.refreshViewer();
                };
                ControlImageRejectDetailController.prototype.next = function () {
                    this.$scope.indexPagePicture++;
                    if (this.$scope.indexPagePicture >= this.$scope.pagePictures.length) {
                        this.$scope.indexPagePicture = this.$scope.pagePictures.length - 1;
                    }
                    this.refreshViewer();
                };
                ControlImageRejectDetailController.prototype.first = function () {
                    this.$scope.indexPagePicture = 0;
                    this.refreshViewer();
                };
                ControlImageRejectDetailController.prototype.last = function () {
                    this.$scope.indexPagePicture = this.$scope.pagePictures.length - 1;
                    this.refreshViewer();
                };
                ControlImageRejectDetailController.prototype.remove = function () {
                    var page = this.$scope.pagePictures[this.$scope.indexPagePicture];
                    this.$scope.$emit("control-image-remove-page", page);
                };
                ControlImageRejectDetailController.prototype.refreshViewer = function () {
                    this.$scope.fileInput = 'http://svlvdcom01/data' + this.$scope.pagePictures[this.$scope.indexPagePicture].imagePath;
                };
                ControlImageRejectDetailController.prototype.resetPicture = function (idPage) {
                    for (var indexPicture = 0; indexPicture < this.$scope.pagePictures.length; indexPicture++) {
                        if (idPage == this.$scope.pagePictures[indexPicture].id) {
                            this.$scope.indexPagePicture = indexPicture;
                        }
                    }
                };
                ControlImageRejectDetailController.$inject = ["$location", "$q", "$scope", "$routeParams", "AuthSharedService", "ControlImageDetailService", "TrayService"];
                return ControlImageRejectDetailController;
            }());
            controller.ControlImageRejectDetailController = ControlImageRejectDetailController;
            demat.app.controller("ControlImageRejectDetailController", ControlImageRejectDetailController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var ControlImageTreatmentBaseController = (function () {
                function ControlImageTreatmentBaseController($location, routeParams, authService, controlImageService, trayService) {
                    this.$location = $location;
                    this.routeParams = routeParams;
                    this.authService = authService;
                    this.controlImageService = controlImageService;
                    this.trayService = trayService;
                    this.trayId = routeParams.trayId;
                    this.init();
                }
                ControlImageTreatmentBaseController.prototype.init = function () {
                    var _this = this;
                    this.trayService.loadTray(this.trayId).then(function (result) {
                        if (!result || !_this.authService.isAuthorized(result.authoritiesAsString.split(','))) {
                            _this.$location.path("home");
                        }
                        _this.initSearch();
                    }, function (error) {
                        _this.$location.path("home");
                    });
                };
                ControlImageTreatmentBaseController.prototype.initSearch = function () {
                    this.search = { batchId: undefined, sortType: 'createDate', sortReverse: true, startDate: undefined, endDate: undefined, currentPage: 1, itemsPerPage: 18 };
                    this.loadBatchs();
                };
                ControlImageTreatmentBaseController.prototype.loadBatchs = function () {
                    var _this = this;
                    this.controlImageService.loadBatchs(this.trayId, this.search).then(function (result) {
                        _this.batchs = result.batchs;
                        _this.numberBatch = result.total;
                    }, function (error) {
                        _this.batchs = [];
                        _this.numberBatch = 0;
                    });
                };
                ControlImageTreatmentBaseController.prototype.open = function (batchId) {
                    this.$location.path("control-image/treatment/" + this.trayId + "/detail/" + batchId);
                };
                ControlImageTreatmentBaseController.$inject = ["$location", "$routeParams", "AuthSharedService", "ControlImageTreatmentService", "TrayService"];
                return ControlImageTreatmentBaseController;
            }());
            controller.ControlImageTreatmentBaseController = ControlImageTreatmentBaseController;
            demat.app.controller("ControlImageTreatmentBaseController", ControlImageTreatmentBaseController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller_1) {
            "use strict";
            var ControlImageTreatmentDetailController = (function () {
                function ControlImageTreatmentDetailController($location, q, $scope, routeParams, $timeout, authService, controlImageService, trayService) {
                    this.$location = $location;
                    this.q = q;
                    this.$scope = $scope;
                    this.routeParams = routeParams;
                    this.$timeout = $timeout;
                    this.authService = authService;
                    this.controlImageService = controlImageService;
                    this.trayService = trayService;
                    this.CST_MILLISECOND_TO_MINUTE = 60000;
                    this.CST_NUMBER_OF_MINUTE_BEFORE_POPUP_TIMEOUT = 10; 
                    this.CST_NUMBER_OF_MINUTE_BEFORE_DECLARE_TIMEOUT = 1; 
                    this.$scope = $scope;
                    this.$scope.pagePictures = [];
                    this.$scope.treeData = [];
                    this.trayId = routeParams.trayId;
                    this.batchId = routeParams.batchId;
                    console.time("init");
                    this.init(this.$scope);
                    console.timeEnd("init");
                    console.time("initUi");
                    this.initUi(this.$scope);
                    console.timeEnd("initUi");
                    this.timerPopPinTimeOut = $timeout(this.displayPopPinTimeOut, this.timeBeforePopupTimeout(), true, this);
                }
                ControlImageTreatmentDetailController.prototype.timeBeforePopupTimeout = function () {
                    return this.CST_NUMBER_OF_MINUTE_BEFORE_POPUP_TIMEOUT * this.CST_MILLISECOND_TO_MINUTE;
                };
                ControlImageTreatmentDetailController.prototype.timeBeforeDeclareTimeout = function () {
                    return this.CST_NUMBER_OF_MINUTE_BEFORE_DECLARE_TIMEOUT * this.CST_MILLISECOND_TO_MINUTE;
                };
                ControlImageTreatmentDetailController.prototype.initUi = function ($scope) {
                    var contexteSave = this;
                    this.$scope.treeOptions = {
                        beforeDrop: function (e) {
                            var deferred = contexteSave.q.defer();
                            var sourceValue = e.source.nodeScope.node;
                            if (!e.dest.nodesScope.node) {
                                deferred.reject("deplacement racine impossible");
                                return deferred.promise;
                            }
                            var destValue = e.dest.nodesScope.node;
                            if ((sourceValue.elementType - destValue.elementType) != 1) {
                                deferred.reject("deplacement dans un sous type  sup a -1 impossible");
                                return deferred.promise;
                            }
                            if (sourceValue.elementType == "3") {
                                var oldIdDocument = sourceValue.documentId;
                                sourceValue.documentId = destValue.id;
                                contexteSave.controlImageService.savePage(sourceValue).then(function (data) {
                                    contexteSave.generateListImage();
                                    deferred.resolve();
                                }, function (error) {
                                    sourceValue.documentId = oldIdDocument;
                                    deferred.reject("erreur");
                                });
                            }
                            else if (sourceValue.elementType == "2") {
                                var oldIdEnvelope = sourceValue.envelopeId;
                                sourceValue.envelopeId = destValue.id;
                                contexteSave.controlImageService.saveDocument(sourceValue).then(function (data) {
                                    contexteSave.generateListImage();
                                    deferred.resolve();
                                }, function (error) {
                                    sourceValue.envelopeId = oldIdEnvelope;
                                    deferred.reject("erreur");
                                });
                            }
                            return deferred.promise;
                        }
                    };
                    $scope.openPopPinRejectLot = false;
                    $scope.openPopPinRejectPli = false;
                    $scope.openPopPinTimeOut = false;
                    $scope.currentNode;
                    $scope.optionsCanvasViewer = {
                        controls: { toolbar: false, image: false, fit: 'height' },
                        zoom: { value: 0.25, step: 0.01 },
                        rotate: { value: 90 }
                    };
                    $scope.$on("control-image-view-picture", function (event, node) {
                        if (node.elementType == "3") {
                            $scope.fileInput = 'http://svlvdcom01/data' + node.imagePath;
                        }
                        contexteSave.resetPicture(node.id);
                        node.select = true;
                    });
                    $scope.$on("control-image-add-envelope", function (event, node) {
                        var documents = [];
                        var newEnvelope = {
                            nodes: documents,
                            documents: documents,
                            batchId: contexteSave.batchId
                        };
                        contexteSave.controlImageService.saveEnvelope(newEnvelope).then(function (result) {
                            result.label = result.number;
                            result.nodes = result.documents;
                            result.elementType = parseInt("1");
                            $scope.batchTree.envelopes.unshift(result);
                        }, function (error) {
                        });
                    });
                    $scope.$on("control-image-add-document", function (event, node) {
                        var pages = [];
                        var newDocument = {
                            pages: pages,
                            envelopeId: node.id
                        };
                        contexteSave.controlImageService.saveDocument(newDocument).then(function (result) {
                            result.label = result.name;
                            result.nodes = result.pages;
                            result.elementType = parseInt("2");
                            node.documents.unshift(result);
                        });
                    });
                    $scope.$on("control-image-remove-envelope", function (event, node) {
                        node.deleted = true;
                        contexteSave.controlImageService.saveEnvelope(node).then(function (result) {
                        }, function (error) {
                            node.deleted = false;
                        });
                    });
                    $scope.$on("control-image-remove-document", function (event, node) {
                        node.deleted = true;
                        contexteSave.controlImageService.saveDocument(node).then(function (result) {
                        }, function (error) {
                            node.deleted = false;
                        });
                    });
                    $scope.$on("control-image-remove-page", function (event, node) {
                        node.deleted = true;
                        contexteSave.controlImageService.savePage(node).then(function (result) {
                            contexteSave.generateListImage();
                            contexteSave.$scope.indexPagePicture = 0;
                        }, function (error) {
                            node.deleted = false;
                        });
                    });
                    $scope.indexPagePicture = 0;
                    $scope.pagePictures = [];
                };
                ControlImageTreatmentDetailController.prototype.init = function ($scope) {
                    var _this = this;
                    this.trayService.loadTray(this.trayId).then(function (result) {
                        if (!result || !_this.authService.isAuthorized(result.authoritiesAsString.split(','))) {
                            _this.$location.path("control-image/treatment/" + _this.trayId);
                        }
                        _this.trayService.loadRejectTypesByStructuralEntityType(_this.trayId, "BATCH").then(function (data) {
                            $scope.rejectTypesByBatch = data;
                        }, function (error) {
                        });
                        _this.trayService.loadRejectTypesByStructuralEntityType(_this.trayId, "ENVELOPE").then(function (data) {
                            $scope.rejectTypesByEnvelope = data;
                        }, function (error) {
                        });
                        _this.loadBatch($scope);
                    }, function (error) {
                        _this.$location.path("control-image/treatment/" + _this.trayId);
                    });
                };
                ControlImageTreatmentDetailController.prototype.loadBatch = function ($scope) {
                    var _this = this;
                    console.time("loadBatch");
                    this.controlImageService.loadBatch(this.batchId, this.trayId).then(function (batch) {
                        _this.controlImageService.getEnvelopeUnlockedByTrayAndBatch(_this.batchId, _this.trayId).then(function (listEnvelope) {
                            $scope.batchTree = batch;
                            console.time("remplir_label");
                            _this.remplir_label($scope, listEnvelope);
                            console.timeEnd("remplir_label");
                            _this.$scope.treeData = [$scope.batchTree];
                        }, function (error) {
                        });
                    }, function (error) {
                        _this.$location.path("control-image/treatment/" + _this.trayId);
                    });
                    console.timeEnd("loadBatch");
                };
                ControlImageTreatmentDetailController.prototype.generateListImage = function () {
                    while (this.$scope.pagePictures.length) {
                        this.$scope.pagePictures.pop();
                    }
                    for (var indexEnvelope = 0; indexEnvelope < this.$scope.batchTree.envelopes.length; indexEnvelope++) {
                        var envelope = this.$scope.batchTree.envelopes[indexEnvelope];
                        for (var indexDocument = 0; indexDocument < envelope.documents.length; indexDocument++) {
                            var document = envelope.documents[indexDocument];
                            for (var indexPage = 0; indexPage < document.pages.length; indexPage++) {
                                var page = document.pages[indexPage];
                                if (page.deleted)
                                    continue;
                                this.$scope.pagePictures.push(page);
                            }
                        }
                    }
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.remplir_label = function ($scope, listEnvelope) {
                    $scope.batchTree.label = $scope.batchTree.name;
                    $scope.batchTree.nodes = $scope.batchTree.envelopes;
                    $scope.batchTree.elementType = 0;
                    for (var indexEnvelope = 0; indexEnvelope < $scope.batchTree.envelopes.length; indexEnvelope++) {
                        var envelope = $scope.batchTree.envelopes[indexEnvelope];
                        envelope.label = envelope.number;
                        envelope.nodes = envelope.documents;
                        envelope.hidden = listEnvelope.indexOf(envelope.id) == -1;
                        envelope.elementType = 1;
                        for (var indexDocument = 0; indexDocument < envelope.documents.length; indexDocument++) {
                            var document = envelope.documents[indexDocument];
                            document.label = document.name;
                            document.nodes = document.pages;
                            document.elementType = 2;
                            for (var indexPage = 0; indexPage < document.pages.length; indexPage++) {
                                var page = document.pages[indexPage];
                                if (page.deleted)
                                    continue;
                                page.label = page.name;
                                page.elementType = 3;
                                $scope.pagePictures.push(page);
                            }
                        }
                    }
                    $scope.fileInput = 'http://svlvdcom01/data' + $scope.pagePictures[0].imagePath;
                };
                ControlImageTreatmentDetailController.prototype.openPopPinRejectBatch = function (batch) {
                    this.$scope.openPopPinRejectLot = true;
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.rejectBatch = function (rejectId, comment) {
                    this.$scope.openPopPinRejectLot = false;
                    for (var _i = 0, _a = this.$scope.batchTree.envelopes; _i < _a.length; _i++) {
                        var envelope = _a[_i];
                        if (!envelope.hidden && !envelope.deleted) {
                            this.trayService.rejectEnvelope(envelope.id, this.trayId, rejectId, comment);
                        }
                    }
                    this.$location.path("/control-image/treatment/" + this.trayId);
                };
                ControlImageTreatmentDetailController.prototype.validateBatch = function (batch) {
                    for (var _i = 0, _a = batch.envelopes; _i < _a.length; _i++) {
                        var envelope = _a[_i];
                        if (!envelope.hidden && !envelope.deleted) {
                            this.validateEnvelope(envelope);
                        }
                    }
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.validateEnvelope = function (envelope) {
                    var _this = this;
                    this.controlImageService.validateEnvelope(envelope).then(function (result) {
                        envelope.hidden = true;
                        for (var _i = 0, _a = _this.$scope.batchTree.envelopes; _i < _a.length; _i++) {
                            var envelope_1 = _a[_i];
                            if (!envelope_1.deleted && !envelope_1.hidden) {
                                return;
                            }
                        }
                        _this.$location.path("/control-image/treatment/" + _this.trayId);
                    }, function (error) {
                    });
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.openPopPinRejectPli = function (envelope) {
                    this.$scope.openPopPinRejectPli = true;
                    this.$scope.currentNode = envelope;
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.rejectEnvelope = function (rejectId, comment) {
                    var _this = this;
                    this.trayService.rejectEnvelope(this.$scope.currentNode.id, this.trayId, rejectId, comment).then(function (result) {
                        _this.$scope.currentNode.hidden = true;
                        for (var _i = 0, _a = _this.$scope.batchTree.envelopes; _i < _a.length; _i++) {
                            var envelope = _a[_i];
                            if (!envelope.deleted && !envelope.hidden) {
                                return;
                            }
                        }
                        _this.$location.path("/control-image/treatment/" + _this.trayId);
                    });
                    this.$scope.openPopPinRejectPli = false;
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.isValidToDeleteEnvelope = function (envelope) {
                    for (var _i = 0, _a = envelope.documents; _i < _a.length; _i++) {
                        var document_1 = _a[_i];
                        if (!document_1.deleted) {
                            return false;
                        }
                    }
                    return true;
                };
                ControlImageTreatmentDetailController.prototype.isValidToDeleteDocument = function (document) {
                    for (var _i = 0, _a = document.pages; _i < _a.length; _i++) {
                        var page = _a[_i];
                        if (!page.deleted) {
                            return false;
                        }
                    }
                    return true;
                };
                ControlImageTreatmentDetailController.prototype.isValidBatch = function (batch) {
                    if (batch.envelopes.length == 0) {
                        return false;
                    }
                    for (var _i = 0, _a = batch.envelopes; _i < _a.length; _i++) {
                        var envelope = _a[_i];
                        if (envelope.deleted)
                            continue;
                        if (!this.isValidEnvelope(envelope)) {
                            return false;
                        }
                    }
                    return true;
                };
                ControlImageTreatmentDetailController.prototype.isValidEnvelope = function (envelope) {
                    if (envelope.documents.length == 0) {
                        return false;
                    }
                    for (var _i = 0, _a = envelope.documents; _i < _a.length; _i++) {
                        var document_2 = _a[_i];
                        if (document_2.deleted)
                            continue;
                        if (document_2.pages.length == 0) {
                            return false;
                        }
                    }
                    return true;
                };
                ControlImageTreatmentDetailController.prototype.reset = function () {
                    this.$scope.$broadcast("canvas-viewer-resize", 'page');
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.rotate = function (val) {
                    this.$scope.$broadcast("canvas-viewer-rotate", val);
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.zoom = function (val) {
                    this.$scope.$broadcast("canvas-viewer-zoom", val);
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.prev = function () {
                    this.$scope.indexPagePicture--;
                    if (this.$scope.indexPagePicture < 0) {
                        this.$scope.indexPagePicture = 0;
                    }
                    this.refreshViewer();
                };
                ControlImageTreatmentDetailController.prototype.next = function () {
                    this.$scope.indexPagePicture++;
                    if (this.$scope.indexPagePicture >= this.$scope.pagePictures.length) {
                        this.$scope.indexPagePicture = this.$scope.pagePictures.length - 1;
                    }
                    this.refreshViewer();
                };
                ControlImageTreatmentDetailController.prototype.first = function () {
                    this.$scope.indexPagePicture = 0;
                    this.refreshViewer();
                };
                ControlImageTreatmentDetailController.prototype.last = function () {
                    this.$scope.indexPagePicture = this.$scope.pagePictures.length - 1;
                    this.refreshViewer();
                };
                ControlImageTreatmentDetailController.prototype.remove = function () {
                    var page = this.$scope.pagePictures[this.$scope.indexPagePicture];
                    this.$scope.$emit("control-image-remove-page", page);
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.refreshViewer = function () {
                    this.$scope.fileInput = 'http://svlvdcom01/data' + this.$scope.pagePictures[this.$scope.indexPagePicture].imagePath;
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.resetPicture = function (idPage) {
                    for (var indexPicture = 0; indexPicture < this.$scope.pagePictures.length; indexPicture++) {
                        if (idPage == this.$scope.pagePictures[indexPicture].id) {
                            this.$scope.indexPagePicture = indexPicture;
                        }
                    }
                    this.resetTimeout();
                };
                ControlImageTreatmentDetailController.prototype.displayPopPinTimeOut = function (controller) {
                    controller.$scope.openPopPinTimeOut = true;
                    controller.timerDeclareTimeOut = controller.$timeout(function () {
                        controller.unlockAllEnvelopes();
                        controller.returnTray();
                    }, controller.timeBeforeDeclareTimeout());
                };
                ControlImageTreatmentDetailController.prototype.resetTimeout = function () {
                    this.$timeout.cancel(this.timerPopPinTimeOut);
                    if (this.timerDeclareTimeOut != null) {
                        this.$timeout.cancel(this.timerDeclareTimeOut);
                    }
                    this.timerPopPinTimeOut = this.$timeout(this.displayPopPinTimeOut, this.timeBeforePopupTimeout(), true, this);
                    this.$scope.openPopPinTimeOut = false;
                };
                ControlImageTreatmentDetailController.prototype.unlockAllEnvelopes = function () {
                    for (var _i = 0, _a = this.$scope.batchTree.envelopes; _i < _a.length; _i++) {
                        var envelope = _a[_i];
                        if (!envelope.hidden && !envelope.deleted) {
                            this.trayService.quitEnvelope(envelope.id, "Abandon controle qualite");
                        }
                    }
                };
                ControlImageTreatmentDetailController.prototype.returnTray = function () {
                    this.$scope.openPopPinTimeOut = false;
                    this.$location.path("/control-image/treatment/" + this.trayId);
                };
                ControlImageTreatmentDetailController.$inject = ["$location", "$q", "$scope", "$routeParams", "$timeout", "AuthSharedService", "ControlImageDetailService", "TrayService"];
                return ControlImageTreatmentDetailController;
            }());
            controller_1.ControlImageTreatmentDetailController = ControlImageTreatmentDetailController;
            demat.app.controller("ControlImageTreatmentDetailController", ControlImageTreatmentDetailController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var HistoricBatchController = (function (_super) {
                __extends(HistoricBatchController, _super);
                function HistoricBatchController(trayService, $location, $scope, $timeout, hotkeys) {
                    _super.call(this);
                    this.trayService = trayService;
                    this.$location = $location;
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.hotkeys = hotkeys;
                    this.hotkeys.bindTo($scope).add({
                        combo: 'enter',
                        description: 'chercher un lot',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#searchBatch').click();
                            });
                        }
                    });
                }
                HistoricBatchController.prototype.loadBatchHistorics = function (batchNumber) {
                    var _this = this;
                    this.trayService.loadBatchHistorics(batchNumber).then(function (historics) {
                        _this.historics = historics;
                    });
                };
                HistoricBatchController.prototype.deleteBatch = function () {
                    var _this = this;
                    this.trayService.deleteBatch(this.historic.id, this.comment).then(function (historic) {
                        _this.openPopinConfirm = false;
                        _this.comment = undefined;
                        _this.historic = undefined;
                        for (var i = 0; i < _this.historics.length; i++) {
                            if (_this.historics[i].id === historic.id) {
                                _this.historics[i].nbDeletedEnv = historic.nbDeletedEnv;
                                _this.historics[i].nbPendingEnv = historic.nbPendingEnv;
                                _this.historics[i].nbTreatedEnv = historic.nbTreatedEnv;
                                break;
                            }
                        }
                    });
                };
                HistoricBatchController.prototype.cancelBatchDeletion = function () {
                    this.openPopinConfirm = false;
                    this.comment = undefined;
                    this.historic = undefined;
                };
                HistoricBatchController.prototype.prepareBatchDeletion = function (batchHistoric) {
                    this.historic = batchHistoric;
                    this.openPopinConfirm = true;
                };
                HistoricBatchController.prototype.openEnvelopes = function (batchId) {
                    this.$location.path("envelopes/" + batchId);
                };
                HistoricBatchController.$inject = ["TrayService", "$location", "$scope", "$timeout", "hotkeys"];
                return HistoricBatchController;
            }(controller.GenericAdminController));
            controller.HistoricBatchController = HistoricBatchController;
            demat.app.controller("HistoricBatchController", HistoricBatchController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var EnvelopeController = (function (_super) {
                __extends(EnvelopeController, _super);
                function EnvelopeController(envelopeService, routeParams, $location, $scope, $timeout, hotkeys) {
                    _super.call(this);
                    this.envelopeService = envelopeService;
                    this.routeParams = routeParams;
                    this.$location = $location;
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.hotkeys = hotkeys;
                    if (routeParams.batchId) {
                        this.findEnv(routeParams.batchId);
                    }
                }
                EnvelopeController.prototype.findEnv = function (batchId) {
                    var _this = this;
                    this.envelopeService.findEnvelopes(batchId).then(function (envelopes) {
                        _this.envelopes = envelopes;
                    });
                };
                EnvelopeController.prototype.openEnvelopeHistoric = function (envelopeId) {
                    this.$location.path("historic/" + envelopeId);
                };
                EnvelopeController.$inject = ["EnvelopeService", "$routeParams", "$location", "$scope", "$timeout", "hotkeys"];
                return EnvelopeController;
            }(controller.GenericAdminController));
            controller.EnvelopeController = EnvelopeController;
            demat.app.controller("EnvelopeController", EnvelopeController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var HistoricController = (function () {
                function HistoricController(trayService, $scope, $timeout, hotkeys) {
                    this.trayService = trayService;
                    this.$scope = $scope;
                    this.$timeout = $timeout;
                    this.hotkeys = hotkeys;
                    this.hotkeys.bindTo($scope).add({
                        combo: 'enter',
                        description: 'chercher un pli',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#searchEnvelope').click();
                            });
                        }
                    });
                }
                HistoricController.prototype.loadEnvelopeHistorics = function (envelopeId) {
                    var _this = this;
                    this.trayService.loadEnvelopeHistorics(envelopeId).then(function (historics) {
                        _this.envelopeHistorics = historics;
                    });
                };
                HistoricController.prototype.getTimelineBadgeIconCss = function (actionId) {
                    var integrationAction = 1;
                    var classificationAction = 2;
                    var indexationAction = 3;
                    var rejectAction = 4;
                    var redirectionAction = 5;
                    var exportAction = 6;
                    var deletionAction = 7;
                    var ctrlQualityAction = 8;
                    switch (actionId) {
                        case integrationAction:
                            return "fa fa-cart-arrow-down";
                        case classificationAction:
                            return "fa fa-random";
                        case indexationAction:
                            return "fa fa-keyboard-o";
                        case rejectAction:
                            return "fa fa-times-circle";
                        case redirectionAction:
                            return "fa fa-reply";
                        case exportAction:
                            return "fa fa-paper-plane-o";
                        case deletionAction:
                            return "fa fa-trash-o";
                        case ctrlQualityAction:
                            return "fa fa-binoculars";
                    }
                    return "";
                };
                HistoricController.prototype.getTimelineBadgeCssClass = function (actionId) {
                    var integrationAction = 1;
                    var classificationAction = 2;
                    var indexationAction = 3;
                    var rejectAction = 4;
                    var redirectionAction = 5;
                    var exportAction = 6;
                    var deletionAction = 7;
                    var ctrlQualityAction = 8;
                    switch (actionId) {
                        case integrationAction:
                            return "timeline-badge success";
                        case classificationAction:
                            return "timeline-badge default";
                        case indexationAction:
                            return "timeline-badge info";
                        case rejectAction:
                            return "timeline-badge danger";
                        case redirectionAction:
                            return "timeline-badge warning";
                        case exportAction:
                            return "timeline-badge success";
                        case deletionAction:
                            return "timeline-badge danger";
                        case ctrlQualityAction:
                            return "timeline-badge success";
                    }
                    return "";
                };
                HistoricController.$inject = ["TrayService", "$scope", "$timeout", "hotkeys"];
                return HistoricController;
            }());
            controller.HistoricController = HistoricController;
            demat.app.controller("HistoricController", HistoricController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var HistoricParamsController = (function (_super) {
                __extends(HistoricParamsController, _super);
                function HistoricParamsController(trayService, routeParams, $scope, $timeout, hotkeys) {
                    _super.call(this, trayService, $scope, $timeout, hotkeys);
                    this.loadEnvelopeHistorics(routeParams.envelopeId);
                }
                HistoricParamsController.$inject = ["TrayService", "$routeParams", "$scope", "$timeout", "hotkeys"];
                return HistoricParamsController;
            }(controller.HistoricController));
            controller.HistoricParamsController = HistoricParamsController;
            demat.app.controller("HistoricParamsController", HistoricParamsController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var TrayDetailController = (function () {
                function TrayDetailController(trayService, $location, routeParams, authService) {
                    this.trayService = trayService;
                    this.$location = $location;
                    this.routeParams = routeParams;
                    this.authService = authService;
                    this.init(routeParams.trayId);
                }
                TrayDetailController.prototype.init = function (trayId) {
                    var _this = this;
                    this.trayService.loadTrayDetail(trayId).then(function (result) {
                        if (!result || !_this.authService.isAuthorized(result.authoritiesAsString.split(','))) {
                            _this.$location.path("home");
                        }
                        else {
                            _this.initSearch();
                            _this.tray = result;
                            for (var _i = 0, _a = _this.trayService.trays; _i < _a.length; _i++) {
                                var tray2 = _a[_i];
                                if (tray2.id === _this.tray.id) {
                                    _this.tray.nbEnvelopes = tray2.nbEnvelopes;
                                    break;
                                }
                            }
                            if (_this.tray.type.code === 'CLF') {
                                if (_this.tray.structuralEntityType.code === 'ENV') {
                                    _this.trayService.loadEnvelopeTypes(trayId);
                                }
                                else if (_this.tray.structuralEntityType.code === 'DOC') {
                                    _this.trayService.loadDocTypes(trayId);
                                }
                            }
                        }
                    });
                    this.trayService.loadRejectTypes(trayId);
                };
                TrayDetailController.prototype.initSearch = function () {
                    this.search = {
                        batchId: undefined,
                        envelopeId: undefined,
                        sortType: 'createDate',
                        sortReverse: true,
                        startDate: undefined,
                        endDate: undefined,
                        currentPage: 1,
                        itemsPerPage: 18
                    };
                    this.loadEnvelopesByCriteria();
                };
                TrayDetailController.prototype.openEnvelope = function (envelopeId) {
                    this.$location.path("envelope-detail/" + envelopeId);
                };
                TrayDetailController.prototype.loadEnvelopesByCriteria = function () {
                    var _this = this;
                    this.trayService.loadEnvelopes(this.routeParams.trayId, this.search).then(function (result) {
                        _this.envelopesSearch = result;
                    });
                };
                TrayDetailController.$inject = ["TrayService", "$location", "$routeParams", "AuthSharedService"];
                return TrayDetailController;
            }());
            controller.TrayDetailController = TrayDetailController;
            demat.app.controller("TrayDetailController", TrayDetailController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var EnvelopeDetailController = (function () {
                function EnvelopeDetailController(trayService, $scope, routeParams, $location, hotkeys, $timeout) {
                    var _this = this;
                    this.trayService = trayService;
                    this.$scope = $scope;
                    this.routeParams = routeParams;
                    this.$location = $location;
                    this.hotkeys = hotkeys;
                    this.$timeout = $timeout;
                    this.pagesPictures = [];
                    this.imageSave = { imagePath: undefined, angle: undefined };
                    if (!this.trayService.currentTray) {
                        this.$location.path("/home");
                    }
                    else {
                        this.$scope.options = {
                            controls: { toolbar: false, fit: 'height' },
                            zoom: { value: 0.25, step: 0.01 },
                            rotate: { value: 90 }
                        };
                        $scope.imageAddress = "http://svlvdcom01/data";
                        this.$scope.currentTray = this.trayService.currentTray;
                        this.currentTray = this.trayService.currentTray;
                        this.createSortcuts($scope, $timeout);
                        this.docTypes = this.trayService.docTypes;
                        this.envTypes = this.trayService.envTypes;
                        console.log("this?envTypes => " + angular.toJson(this.envTypes));
                        this.rejectTypes = this.trayService.rejectTypes;
                        this.trayService.loadEnvelope(routeParams.envelopeId).then(function (envelope) {
                            if (!envelope) {
                                _this.$location.path("/tray-detail/" + _this.currentTray.id);
                            }
                            else {
                                _this.envelopeObject = envelope;
                            }
                        });
                        this.trayService.loadEnvelopeTree(routeParams.envelopeId).then(function (node) {
                            _this.$scope.treedata = node;
                            _this.$scope.treedataArray = [node];
                            console.log("treedata => " + angular.toJson($scope.treedata));
                            _this.$scope.tree.currentNode = node.children[0]; 
                            console.log("tree => " + angular.toJson(_this.$scope.tree.currentNode));
                            switch (_this.currentTray.type.code) {
                                case 'IDX':
                                case 'QLT':
                                    _this.$scope.treedata.children[0].selected = 'selected';
                                    break;
                                case 'CLF':
                                    _this.selectNextDocumentWithoutType();
                                    break;
                                default:
                                    _this.$scope.treedata.children[0].selected = 'selected';
                            }
                            console.log(' => ' + _this.$scope.treedata.children);
                            for (var _i = 0, _a = _this.$scope.treedata.children; _i < _a.length; _i++) {
                                var document = _a[_i];
                                console.log(document.children);
                                for (var _b = 0, _c = document.children; _b < _c.length; _b++) {
                                    var page = _c[_b];
                                    _this.pagesPictures.push(page);
                                }
                            }
                            $scope.$watch('tree.currentNode', function (newObj, oldObj) {
                                if ($scope.tree && angular.isObject($scope.tree.currentNode)) {
                                    console.log("watch tree => " + angular.toJson($scope.tree.currentNode));
                                    if (!$scope.tree.currentNode.children) {
                                        console.log("tree ici99 => $scope.tree.currentNode.imagePath " + $scope.tree.currentNode.imagePath);
                                        $scope.fileInput = $scope.imageAddress + "/" + $scope.tree.currentNode.imagePath + "?" + Date.now();
                                    }
                                    else if ($scope.tree.currentNode.structuralEntityType.code == 'DOC') {
                                        console.log("tree ici => $scope.tree.currentNode.children[0].imagePath " + $scope.tree.currentNode.children[0].imagePath);
                                        $scope.fileInput = $scope.imageAddress + "/" + $scope.tree.currentNode.children[0].imagePath + "?" + Date.now();
                                    }
                                }
                            }, false);
                        });
                    }
                }
                EnvelopeDetailController.prototype.createSortcuts = function ($scope, $timeout) {
                    if (this.currentTray.type.code === 'IDX') {
                        this.hotkeys.bindTo($scope).add({
                            combo: 'ctrl+r',
                            description: 'Rejeter la tâche',
                            callback: function (event) {
                                event.preventDefault();
                                $scope.openPopPinReject = true;
                            }
                        });
                    }
                    else if (this.currentTray.type.code === 'RJT') {
                        this.hotkeys.bindTo($scope).add({
                            combo: 'ctrl+r',
                            description: 'Renvoyer la tâche',
                            callback: function (event) {
                                event.preventDefault();
                                $scope.openPopSendBack = true;
                            }
                        });
                    }
                    else if (this.currentTray.type.code === 'CLF') {
                        this.hotkeys.bindTo($scope).add({
                            combo: 'ctrl+r',
                            description: 'Rejeter la tâche',
                            callback: function (event) {
                                event.preventDefault();
                                $scope.openPopPinReject = true;
                            }
                        });
                        if (this.currentTray.structuralEntityType.code === 'ENV') {
                            this.hotkeys.bindTo($scope).add({
                                combo: 'ctrl+v',
                                description: 'Valider le type d\'enveloppe',
                                callback: function (event) {
                                    event.preventDefault();
                                    $timeout(function () {
                                        angular.element(document).find('#validateEnvTypeBtn').click();
                                    });
                                }
                            });
                            this.hotkeys.bindTo($scope).add({
                                combo: 'ctrl+del',
                                description: 'Supprimer le type d\'enveloppe',
                                callback: function (event) {
                                    event.preventDefault();
                                    $timeout(function () {
                                        if ($scope.tree.currentNode.documentType && $scope.tree.currentNode.documentType.label) {
                                            angular.element(document).find('#dropDocTypeBtn').click();
                                        }
                                    });
                                }
                            });
                        }
                        else if (this.currentTray.structuralEntityType.code === 'DOC') {
                            this.hotkeys.bindTo($scope).add({
                                combo: 'ctrl+v',
                                description: 'Valider le type de document',
                                callback: function (event) {
                                    event.preventDefault();
                                    $timeout(function () {
                                        if ($scope.tree.currentNode.documentType && $scope.tree.currentNode.documentType.id) {
                                            angular.element(document).find('#validateDocTypeBtn').click();
                                        }
                                    });
                                }
                            });
                            this.hotkeys.bindTo($scope).add({
                                combo: 'ctrl+del',
                                description: 'Supprimer le type de document',
                                callback: function (event) {
                                    event.preventDefault();
                                    $timeout(function () {
                                        if ($scope.tree.currentNode.documentType && $scope.tree.currentNode.documentType.label) {
                                            angular.element(document).find('#dropDocTypeBtn').click();
                                        }
                                    });
                                }
                            });
                        }
                    }
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+q', description: 'Quitter la tâche', callback: function (event) {
                            $timeout(function () {
                                angular.element(document).find('#quitEnvelope').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl++',
                        description: 'Zoomer l\'image',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#zoomin').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+-',
                        description: 'Dézoomer sur l\'image',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#zoomout').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+*',
                        description: 'Redimensionner l\'image',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#resizeImage').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+left',
                        description: 'Rotation gauche de l\'image',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#rotateleft').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+right',
                        description: 'Rotation droite de l\'image',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#rotateright').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+i',
                        description: 'Corriger l\'image',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#saveImageBtn').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+down', description: 'Naviguer dans les images', callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                var selectedFound = false;
                                var newSelectedFound = false;
                                if ($scope.treedata[0] && $scope.treedata[0].children) {
                                    for (var _i = 0, _a = $scope.treedata[0].children; _i < _a.length; _i++) {
                                        var document = _a[_i];
                                        if (document.id === $scope.tree.currentNode.id) {
                                            document.selected = '';
                                            selectedFound = true;
                                        }
                                        else if (selectedFound) {
                                            document.selected = 'selected';
                                            newSelectedFound = true;
                                            $scope.tree.currentNode = document;
                                            break;
                                        }
                                        for (var _b = 0, _c = document.children; _b < _c.length; _b++) {
                                            var page = _c[_b];
                                            if (page.id === $scope.tree.currentNode.id) {
                                                page.selected = '';
                                                selectedFound = true;
                                            }
                                            else if (selectedFound) {
                                                page.selected = 'selected';
                                                newSelectedFound = true;
                                                $scope.tree.currentNode = page;
                                                break;
                                            }
                                        }
                                        if (newSelectedFound) {
                                            break;
                                        }
                                    }
                                }
                                if (!newSelectedFound && $scope.treedata[0] && $scope.treedata[0].children) {
                                    $scope.treedata[0].children[0].selected = 'selected';
                                    $scope.tree.currentNode = $scope.treedata[0].children[0];
                                }
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+space', description: 'Mode Saisie', callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                if ($scope.openPopPinReject || $scope.openPopSendBack) {
                                    angular.element(document).find('select:visible:first').focus();
                                }
                                else {
                                    if (angular.element(document).find('input:visible:first').length) {
                                        angular.element(document).find('input:visible:first').focus();
                                    }
                                    else {
                                        angular.element(document).find('select:visible:first').focus();
                                    }
                                }
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+enter', description: 'Valider l\'opération en cours', callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                if ($scope.openPopPinReject) {
                                    angular.element(document).find('#rejectTypeSubmit').click();
                                }
                                else if ($scope.openPopSendBack) {
                                    angular.element(document).find('#sendBackSubmit').click();
                                }
                                else if ($scope.currentTray.type.code === 'CLF') {
                                    angular.element(document).find('#classifySubmit').click();
                                }
                                else if ($scope.currentTray.type.code === 'IDX') {
                                    angular.element(document).find('#indexSubmit').click();
                                }
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'esc', description: 'Annuler l\'opération en cours', callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                if ($scope.openPopPinReject) {
                                    angular.element(document).find('#rejectTypeCancel').click();
                                }
                                else if ($scope.openPopSendBack) {
                                    angular.element(document).find('#sendBackCancel').click();
                                }
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'enter', description: 'Chercher dans le referentiel', callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(window.document.activeElement).parent().find('span.input-group-btn>button#callRefBtn').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'tab', description: 'Tabulations entre les champs de saisie', callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                var idCurrentFocusedInput = angular.element(window.document.activeElement).attr('id');
                                var idfirstInput;
                                var isFocusedFound = false;
                                var nextInputIsFocused;
                                angular.element(document).find('input:visible').each(function (index, element) {
                                    if (!idfirstInput) {
                                        idfirstInput = element.getAttribute('id');
                                    }
                                    if (isFocusedFound) {
                                        angular.element(document).find('#' + element.getAttribute('id')).focus();
                                        nextInputIsFocused = true;
                                        return false;
                                    }
                                    else if (idCurrentFocusedInput === element.getAttribute('id')) {
                                        isFocusedFound = true;
                                    }
                                });
                                if (!nextInputIsFocused) {
                                    angular.element(document).find('#' + idfirstInput).focus();
                                }
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+b', description: 'Tabulations entre les accordions', callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                if (['IDX', 'QLT'].indexOf($scope.currentTray.type.code) >= 0) {
                                    switch ($scope.currentTray.structuralEntityType.code) {
                                        case 'ENV':
                                            for (var i = 0; i < $scope.treedata[0].categories.length; i++) {
                                                if ($scope.treedata[0].categories[i].open && i < $scope.treedata[0].categories.length - 1) {
                                                    $scope.treedata[0].categories[i + 1].open = true;
                                                    return;
                                                }
                                            }
                                            $scope.treedata[0].categories[0].open = true;
                                            break;
                                        case 'DOC':
                                            if ($scope.treedata[0] && $scope.tree.currentNode) {
                                                if (!$scope.tree.currentNode.structuralEntityType) {
                                                    for (var _i = 0, _a = $scope.treedata[0].children; _i < _a.length; _i++) {
                                                        var document = _a[_i];
                                                        for (var _b = 0, _c = document.children; _b < _c.length; _b++) {
                                                            var page = _c[_b];
                                                            if ($scope.tree.currentNode.id === page.id) {
                                                                for (var i = 0; i < document.categories.length; i++) {
                                                                    if (document.categories[i].open && i < document.categories.length - 1) {
                                                                        document.categories[i + 1].open = true;
                                                                        return;
                                                                    }
                                                                }
                                                                document.categories[0].open = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                                else if ($scope.tree.currentNode.structuralEntityType.code == 'DOC') {
                                                    for (var _d = 0, _e = $scope.treedata[0].children; _d < _e.length; _d++) {
                                                        var document = _e[_d];
                                                        if ($scope.tree.currentNode && (document.id === $scope.tree.currentNode.id)) {
                                                            for (var i = 0; i < document.categories.length; i++) {
                                                                if (document.categories[i].open && i < document.categories.length - 1) {
                                                                    document.categories[i + 1].open = true;
                                                                    return;
                                                                }
                                                            }
                                                            document.categories[0].open = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                    }
                                }
                            });
                        }
                    });
                };
                EnvelopeDetailController.prototype.callReferential = function (index) {
                    var _this = this;
                    if (index.value[0]) {
                        this.trayService.loadRefIndexes({
                            trayId: this.currentTray.id,
                            indexId: index.id,
                            searchId: index.value[0]
                        }).then(function (refIndexes) {
                            for (var _i = 0, _a = _this.getCategoriesForIndexationPanel(); _i < _a.length; _i++) {
                                var category = _a[_i];
                                for (var _b = 0, _c = category.indexes; _b < _c.length; _b++) {
                                    var index = _c[_b];
                                    if (refIndexes.length) {
                                        for (var _d = 0, refIndexes_1 = refIndexes; _d < refIndexes_1.length; _d++) {
                                            var refIndex = refIndexes_1[_d];
                                            if (index.refLabel === refIndex.code) {
                                                if (refIndex.values.length) {
                                                    switch (index.inputType) {
                                                        case 'list':
                                                            index.items = refIndex.values;
                                                            break;
                                                        case 'number':
                                                            index.value[0] = parseFloat(refIndex.values[0].label);
                                                            break;
                                                        default:
                                                            index.value[0] = refIndex.values[0].label;
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        index.value[0] = undefined;
                                    }
                                }
                            }
                        });
                    }
                };
                EnvelopeDetailController.prototype.validateControleQuality = function () {
                    var _this = this;
                    if (this.isControleQualityValidated !== undefined) {
                        this.trayService.validateQualityControl(this.envelopeObject.id, this.isControleQualityValidated).then(function (result) {
                            _this.getNextEnvelope();
                        });
                    }
                };
                EnvelopeDetailController.prototype.index = function () {
                    var _this = this;
                    for (var _i = 0, _a = this.envelopeObject.children; _i < _a.length; _i++) {
                        var document = _a[_i];
                        for (var _b = 0, _c = document.categories; _b < _c.length; _b++) {
                            var category = _c[_b];
                            for (var _d = 0, _e = category.indexes; _d < _e.length; _d++) {
                                var index = _e[_d];
                                if (index.inputType === 'date' && index.value.length && index.value[0]) {
                                    index.value[0] = index.value[0].toLocaleDateString();
                                }
                            }
                        }
                    }
                    this.trayService.indexEnvelope(this.envelopeObject.id, this.envelopeObject).then(function (result) {
                        _this.getNextEnvelope();
                    });
                };
                EnvelopeDetailController.prototype.classify = function () {
                    var _this = this;
                    this.trayService.classifyEnvelope(this.envelopeObject.id, this.envelopeObject.children).then(function (result) {
                        _this.getNextEnvelope();
                    });
                };
                EnvelopeDetailController.prototype.rejectEnvelope = function (rejectId, comment) {
                    var _this = this;
                    this.$scope.openPopPinReject = false;
                    this.trayService.rejectEnvelope(this.envelopeObject.id, this.currentTray.id, rejectId, comment).then(function (result) {
                        _this.getNextEnvelope();
                    });
                };
                EnvelopeDetailController.prototype.changeEnvelopeTray = function (tray) {
                    var _this = this;
                    this.$scope.openPopSendBack = false;
                    this.trayService.changeEnvelopeTray(this.envelopeObject.id, tray.id).then(function (result) {
                        _this.getNextEnvelope();
                    });
                };
                EnvelopeDetailController.prototype.getNextEnvelope = function () {
                    var _this = this;
                    this.trayService.getNextEnvelope(this.currentTray.id).then(function (nextEnvelopeId) {
                        if (nextEnvelopeId) {
                            _this.$location.path("/envelope-detail/" + nextEnvelopeId);
                        }
                        else {
                            _this.$location.path("/tray-detail/" + _this.currentTray.id);
                        }
                    });
                };
                EnvelopeDetailController.prototype.quitEnvelope = function (comment) {
                    var _this = this;
                    this.trayService.quitEnvelope(this.envelopeObject.id, comment).then(function (result) {
                        _this.$scope.openPopPinReject = false;
                        _this.$scope.openPopSendBack = false;
                        _this.$location.path("/tray-detail/" + _this.currentTray.id);
                    });
                };
                EnvelopeDetailController.prototype.saveRedressImage = function () {
                    var _this = this;
                    var path = this.$scope.fileInput;
                    this.imageSave.imagePath = path.substring(path.lastIndexOf("\/") + 1, path.lastIndexOf("\?"));
                    this.imageSave.angle = angular.element('canvas').scope().options.rotate.value;
                    this.trayService.saveRotateImage(this.imageSave).then(function (data) {
                        _this.$scope.fileInput = _this.$scope.imageAddress + "/" + path.substring(path.lastIndexOf("\/") + 1, path.lastIndexOf("\?")) + "?" + Date.now();
                    });
                };
                EnvelopeDetailController.prototype.formatDate = function (index) {
                    if (index.inputType === 'date') {
                        for (var i = 0; i < index.value.length; i++) {
                            if (index.value[i]) {
                                index.value[i] = new Date(index.value[i].toString());
                            }
                        }
                    }
                };
                EnvelopeDetailController.prototype.changePictureView = function (pictureName) {
                    this.envelopeObject.selected = undefined;
                    for (var _i = 0, _a = this.$scope.treedata.children; _i < _a.length; _i++) {
                        var document = _a[_i];
                        document.selected = undefined;
                        for (var _b = 0, _c = document.children; _b < _c.length; _b++) {
                            var page = _c[_b];
                            if (page.label === pictureName) {
                                page.selected = "selected";
                                this.$scope.tree.currentNode = page;
                            }
                            else {
                                page.selected = undefined;
                            }
                        }
                    }
                };
                EnvelopeDetailController.prototype.addNewLine = function (index) {
                    for (var _i = 0, _a = index.childIndexes; _i < _a.length; _i++) {
                        var childIndex = _a[_i];
                        if (!childIndex.value) {
                            childIndex.value = new Array();
                        }
                        childIndex.value.push(null);
                    }
                };
                EnvelopeDetailController.prototype.dropLine = function (index, lineId) {
                    if (index) {
                        for (var _i = 0, _a = index.childIndexes; _i < _a.length; _i++) {
                            var childIndex = _a[_i];
                            childIndex.value.splice(lineId, 1);
                        }
                    }
                };
                EnvelopeDetailController.prototype.duplicateLine = function (index, lineId) {
                    if (index) {
                        for (var _i = 0, _a = index.childIndexes; _i < _a.length; _i++) {
                            var childIndex = _a[_i];
                            childIndex.value.push(angular.copy(childIndex.value[lineId]));
                        }
                    }
                };
                EnvelopeDetailController.prototype.canClassify = function () {
                    if (this.$scope.treedata && this.$scope.treedata.children) {
                        for (var _i = 0, _a = this.$scope.treedata.children; _i < _a.length; _i++) {
                            var document = _a[_i];
                            if (!(document.documentType && document.documentType.label)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                EnvelopeDetailController.prototype.canIndex = function () {
                    if (this.envelopeObject && this.envelopeObject.categories) {
                        var nbIndexInformed = 0;
                        for (var _i = 0, _a = this.envelopeObject.categories; _i < _a.length; _i++) {
                            var category = _a[_i];
                            for (var _b = 0, _c = category.indexes; _b < _c.length; _b++) {
                                var index = _c[_b];
                                if (!index.childIndexes.length) {
                                    if (index.required === true && (index.value.length === 0 || index.value[0] === undefined || index.value[0] === null || !index.value[0].toString().length)) {
                                        return false;
                                    }
                                    else if (index.value.length > 0 && index.value[0]) {
                                        nbIndexInformed++;
                                    }
                                }
                            }
                        }
                        if (nbIndexInformed < this.currentTray.nbRequiredIndex) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    else {
                        return false;
                    }
                };
                EnvelopeDetailController.prototype.refreshDocTypeLabel = function (currentDocType) {
                    for (var _i = 0, _a = this.docTypes; _i < _a.length; _i++) {
                        var doctype = _a[_i];
                        if (currentDocType.id === doctype.id) {
                            currentDocType.label = doctype.label;
                            break;
                        }
                    }
                    this.selectNextDocumentWithoutType();
                };
                EnvelopeDetailController.prototype.selectNextDocumentWithoutType = function () {
                    var untypedDocumentFound = false;
                    for (var _i = 0, _a = this.$scope.treedata.children; _i < _a.length; _i++) {
                        var document = _a[_i];
                        if (!document.documentType || !document.documentType.id) {
                            untypedDocumentFound = true;
                            document.selected = "selected";
                            if (this.$scope.tree.currentNode) {
                                this.$scope.tree.currentNode.selected = undefined;
                            }
                            this.$scope.tree.currentNode = document;
                            break;
                        }
                    }
                    if (!untypedDocumentFound) {
                        this.$scope.treedata.children[0].selected = "selected";
                        this.$scope.tree.currentNode = this.$scope.treedata.children[0];
                    }
                };
                EnvelopeDetailController.prototype.formatDateIndexes = function (envelopeObject) {
                };
                EnvelopeDetailController.prototype.exportEnvelopePdf = function (envelopeId) {
                    this.trayService.exportEnvelopePdf(envelopeId).then(function (data) {
                        var file = new Blob([data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    });
                };
                EnvelopeDetailController.prototype.flagExportEnvelope = function (envelopeId) {
                    var _this = this;
                    this.trayService.changeEnvelopeStatus(envelopeId, '2').then(function (data) {
                        _this.getNextEnvelope();
                    });
                };
                EnvelopeDetailController.prototype.getSelectedOrDefaultItem = function (index) {
                    if (index.value[0]) {
                        return index.value[0].toString();
                    }
                    else {
                        for (var _i = 0, _a = index.items; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (item.isDefault) {
                                return item.code;
                            }
                        }
                    }
                };
                EnvelopeDetailController.prototype.getCategoriesForIndexationPanel = function () {
                    if (this.showEnvelopeIndexationPanel()) {
                        return this.envelopeObject.categories;
                    }
                    else if (this.showDocumentIndexationPanel()) {
                        return this.getCurrentDocIndexes();
                    }
                    return null;
                };
                EnvelopeDetailController.prototype.showEnvelopeIndexationPanel = function () {
                    if (this.envelopeObject && this.envelopeObject.categories.length && this.currentTray.structuralEntityType.code === 'ENV' && ['IDX', 'QLT'].indexOf(this.currentTray.type.code) >= 0) {
                        return true;
                    }
                    return false;
                };
                EnvelopeDetailController.prototype.showDocumentIndexationPanel = function () {
                    if (this.currentTray && this.currentTray.structuralEntityType.code === 'DOC' && ['IDX', 'QLT'].indexOf(this.currentTray.type.code) >= 0 && this.getCurrentDocIndexes().length) {
                        return true;
                    }
                    return false;
                };
                EnvelopeDetailController.prototype.getCurrentDocIndexes = function () {
                    if (this.envelopeObject && this.$scope.tree.currentNode) {
                        if (!this.$scope.tree.currentNode.structuralEntityType) {
                            for (var _i = 0, _a = this.envelopeObject.children; _i < _a.length; _i++) {
                                var document = _a[_i];
                                for (var _b = 0, _c = document.children; _b < _c.length; _b++) {
                                    var page = _c[_b];
                                    if (this.$scope.tree.currentNode.id === page.id) {
                                        return document.categories;
                                    }
                                }
                            }
                        }
                        else if (this.$scope.tree.currentNode.structuralEntityType.code == 'DOC') {
                            for (var _d = 0, _e = this.envelopeObject.children; _d < _e.length; _d++) {
                                var document = _e[_d];
                                if (this.$scope.tree.currentNode && (document.id === this.$scope.tree.currentNode.id)) {
                                    return document.categories;
                                }
                            }
                        }
                    }
                    return [];
                };
                EnvelopeDetailController.prototype.getIndexByPosition = function (category, positionX, positionY) {
                    for (var i = 0; i < category.indexes.length; i++) {
                        if (category.indexes[i].positionX === positionX && category.indexes[i].positionY === positionY) {
                            return category.indexes[i];
                        }
                    }
                    return null;
                };
                EnvelopeDetailController.$inject = ["TrayService", "$scope", "$routeParams", "$location", "hotkeys", "$timeout", "HelperController"];
                return EnvelopeDetailController;
            }());
            controller.EnvelopeDetailController = EnvelopeDetailController;
            demat.app.controller("EnvelopeDetailController", EnvelopeDetailController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var EntityTypeAddController = (function () {
                function EntityTypeAddController($location, routeParams, entityTypeService, constants) {
                    this.$location = $location;
                    this.routeParams = routeParams;
                    this.entityTypeService = entityTypeService;
                    this.constants = constants;
                }
                EntityTypeAddController.prototype.isFilled = function () {
                    if (this.entityTypeModel && this.entityTypeModel.code && this.entityTypeModel.label) {
                        return true;
                    }
                    return false;
                };
                EntityTypeAddController.prototype.addEntityType = function () {
                    var _this = this;
                    this.entityTypeService.addEntityType(this.routeParams.entityTypeParams, this.entityTypeModel)
                        .then(function (promiseValue) { return _this.$location.path("admin/entity-type/" + _this.routeParams.entityTypeParams); })
                        .catch(function (reason) { return _this.$location.path(_this.constants.ERROR_500_PATH); });
                };
                EntityTypeAddController.$inject = ["$location", "$routeParams", "EntityTypeService", "Constants"];
                return EntityTypeAddController;
            }());
            controller.EntityTypeAddController = EntityTypeAddController;
            demat.app.controller("EntityTypeAddController", EntityTypeAddController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var EntityTypeListController = (function (_super) {
                __extends(EntityTypeListController, _super);
                function EntityTypeListController($location, routeParams, entityTypeService, constants) {
                    var _this = this;
                    _super.call(this);
                    this.$location = $location;
                    this.routeParams = routeParams;
                    this.entityTypeService = entityTypeService;
                    this.constants = constants;
                    entityTypeService.loadEntityTypes(this.routeParams.entityTypeParams)
                        .then(function (entityTypes) {
                        _this.entityTypes = entityTypes;
                    })
                        .catch(function (reason) { return _this.$location.path(_this.constants.ERROR_500_PATH); });
                }
                EntityTypeListController.prototype.prepareUpdateEntityType = function (currentModel) {
                    this.currentModel = currentModel;
                    this.$location.path("admin/entity-type/" + this.routeParams.entityTypeParams + "/update/" + this.currentModel.id);
                };
                EntityTypeListController.prototype.prepareDeleteEntityType = function (currentModel) {
                    this.currentModel = currentModel;
                    this.openPopinConfirm = true;
                };
                EntityTypeListController.prototype.deleteEntityType = function () {
                    var _this = this;
                    this.entityTypeService.deleteEntityType(this.routeParams.entityTypeParams, this.currentModel.id)
                        .then(function (promiseValue) {
                        console.log("admin/entity-type/" + _this.routeParams.entityTypeParams);
                        return _this.$location.path("admin/entity-type/" + _this.routeParams.entityTypeParams);
                    })
                        .catch(function (reason) { return _this.$location.path(_this.constants.ERROR_500_PATH); });
                    this.openPopinConfirm = false;
                };
                EntityTypeListController.$inject = ["$location", "$routeParams", "EntityTypeService", "Constants"];
                return EntityTypeListController;
            }(controller.GenericAdminController));
            controller.EntityTypeListController = EntityTypeListController;
            demat.app.controller("EntityTypeListController", EntityTypeListController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var EntityTypeUpdateController = (function () {
                function EntityTypeUpdateController($location, routeParams, entityTypeService, constants) {
                    var _this = this;
                    this.$location = $location;
                    this.routeParams = routeParams;
                    this.entityTypeService = entityTypeService;
                    this.constants = constants;
                    entityTypeService.loadEntityType(this.routeParams.entityTypeParams, this.routeParams.entityIdParams)
                        .then(function (entityType) {
                        _this.entityTypeModel = entityType;
                    })
                        .catch(function (reason) { return _this.$location.path(_this.constants.ERROR_500_PATH); });
                }
                EntityTypeUpdateController.prototype.isFilled = function () {
                    if (this.entityTypeModel && this.entityTypeModel.code && this.entityTypeModel.label) {
                        return true;
                    }
                    return false;
                };
                EntityTypeUpdateController.prototype.updateEntityType = function () {
                    var _this = this;
                    this.entityTypeService.updateEntityType(this.routeParams.entityTypeParams, this.entityTypeModel)
                        .then(function (promiseValue) { return _this.$location.path("admin/entity-type/" + _this.routeParams.entityTypeParams); })
                        .catch(function (reason) { return _this.$location.path(_this.constants.ERROR_500_PATH); });
                };
                EntityTypeUpdateController.$inject = ["$location", "$routeParams", "EntityTypeService", "Constants"];
                return EntityTypeUpdateController;
            }());
            controller.EntityTypeUpdateController = EntityTypeUpdateController;
            demat.app.controller("EntityTypeUpdateController", EntityTypeUpdateController);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var ModalDeleteIndexesCtrl = (function () {
                function ModalDeleteIndexesCtrl($uibModalInstance, adminIndexService, modalOptions) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.adminIndexService = adminIndexService;
                    this.modalOptions = modalOptions;
                    this.loadIndex(modalOptions.toString());
                }
                ModalDeleteIndexesCtrl.prototype.ok = function () {
                    this.deleteIndex();
                    this.$uibModalInstance.close();
                };
                ;
                ModalDeleteIndexesCtrl.prototype.cancel = function () {
                    this.$uibModalInstance.dismiss('cancel');
                };
                ;
                ModalDeleteIndexesCtrl.prototype.deleteIndex = function () {
                    this.adminIndexService.deleteSimpleIndex(this.simpleIndex.id);
                };
                ModalDeleteIndexesCtrl.prototype.loadIndex = function (indexId) {
                    var _this = this;
                    this.adminIndexService.getIndexById(indexId).then(function (simpleIndex) {
                        _this.simpleIndex = simpleIndex;
                    });
                };
                ModalDeleteIndexesCtrl.$inject = ['$uibModalInstance', 'AdminIndexService', 'modalOptions'];
                return ModalDeleteIndexesCtrl;
            }());
            controller.ModalDeleteIndexesCtrl = ModalDeleteIndexesCtrl;
            demat.app.controller("ModalDeleteIndexesCtrl", ModalDeleteIndexesCtrl);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var ModalIndexesCtrl = (function () {
                function ModalIndexesCtrl($uibModal) {
                    this.$uibModal = $uibModal;
                }
                ModalIndexesCtrl.prototype.openUpdate = function (board, params, action) {
                    var _this = this;
                    var modalInstance = this.$uibModal.open({
                        templateUrl: 'components/administration/indexes/upadd-admin-index-modal/upadd-admin-indexes-modal.html',
                        controller: controller.ModalUpAddIndexesCtrl,
                        bindToController: true,
                        controllerAs: 'modalUpAddIndexesCtrl',
                        resolve: {
                            modalOptions: function () { return [board, params, action]; }
                        }
                    });
                    modalInstance.result.then(function () {
                        _this.isClose = true;
                    });
                };
                ;
                ModalIndexesCtrl.prototype.openDelete = function (params) {
                    var _this = this;
                    var modalInstance = this.$uibModal.open({
                        templateUrl: 'components/administration/indexes/delete-index-modal/admin-delete-indexes-modal.html',
                        controller: controller.ModalDeleteIndexesCtrl,
                        bindToController: true,
                        controllerAs: 'modalDeleteIndexesCtrl',
                        resolve: {
                            modalOptions: function () { return params; }
                        }
                    });
                    modalInstance.result.then(function () {
                        _this.isClose = true;
                    });
                };
                ;
                ModalIndexesCtrl.$inject = ['$uibModal', '$timeout'];
                return ModalIndexesCtrl;
            }());
            controller.ModalIndexesCtrl = ModalIndexesCtrl;
            demat.app.controller("ModalIndexesCtrl", ModalIndexesCtrl);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

var arvato;
(function (arvato) {
    var demat;
    (function (demat) {
        var controller;
        (function (controller) {
            "use strict";
            var URL_SIMPLE_INDEX_BOARD = "/boards-settings/indexes";
            var ModalUpAddIndexesCtrl = (function () {
                function ModalUpAddIndexesCtrl($uibModalInstance, adminIndexService, modalOptions, boardService, $timeout, entityTypeService, dropdownService) {
                    this.$uibModalInstance = $uibModalInstance;
                    this.adminIndexService = adminIndexService;
                    this.modalOptions = modalOptions;
                    this.boardService = boardService;
                    this.$timeout = $timeout;
                    this.entityTypeService = entityTypeService;
                    this.dropdownService = dropdownService;
                    this.board = modalOptions[0];
                    this.action = modalOptions[2];
                    this.loadLists();
                    this.loadAllIndexType();
                    if (this.action === 'update') {
                        this.loadIndex(modalOptions[1].toString());
                    }
                }
                ModalUpAddIndexesCtrl.prototype.ok = function () {
                    if (this.action === 'update') {
                        this.updateIndex();
                    }
                    else if (this.action === 'add') {
                        this.adminIndexService.postSimpleIndex(this.simpleIndex);
                    }
                    else {
                        console.error('action not authorized');
                    }
                    this.$uibModalInstance.close();
                };
                ;
                ModalUpAddIndexesCtrl.prototype.cancel = function () {
                    this.$uibModalInstance.dismiss('cancel');
                };
                ;
                ModalUpAddIndexesCtrl.prototype.loadIndex = function (indexId) {
                    var _this = this;
                    this.adminIndexService.getIndexById(indexId).then(function (simpleIndex) {
                        _this.simpleIndex = simpleIndex;
                    });
                };
                ModalUpAddIndexesCtrl.prototype.reloadBoardIndexes = function (board) {
                    this.boardService.getBoard(URL_SIMPLE_INDEX_BOARD).then(function (boardService) {
                        board = boardService;
                    });
                };
                ModalUpAddIndexesCtrl.prototype.updateIndex = function () {
                    var _this = this;
                    this.adminIndexService.updateSimpleIndex(this.simpleIndex).then(function () {
                        _this.reloadBoardIndexes(_this.board);
                    });
                };
                ModalUpAddIndexesCtrl.prototype.checkRegexValidity = function (regex) {
                    var isValid = true;
                    try {
                        new RegExp(regex);
                    }
                    catch (e) {
                        isValid = false;
                    }
                    return isValid;
                };
                ModalUpAddIndexesCtrl.prototype.loadAllIndexType = function () {
                    var _this = this;
                    this.entityTypeService.loadEntityTypes("indexes-type").then(function (result) {
                        _this.indexTypes = result;
                    });
                };
                ModalUpAddIndexesCtrl.prototype.loadLists = function () {
                    var _this = this;
                    this.dropdownService.loadDropdowns("dropdowns").then(function (result) {
                        _this.dropdowns = result;
                    });
                };
                ModalUpAddIndexesCtrl.prototype.updateIndexType = function (simpleIndex) {
                    for (var _i = 0, _a = this.indexTypes; _i < _a.length; _i++) {
                        var indexType = _a[_i];
                        if (simpleIndex.indexType && simpleIndex.indexType.id === indexType.id) {
                            simpleIndex.indexType.code = indexType.code;
                            simpleIndex.indexType.label = indexType.label;
                            break;
                        }
                    }
                };
                ModalUpAddIndexesCtrl.prototype.updateIndexDropdown = function (simpleIndex) {
                    for (var _i = 0, _a = this.dropdowns; _i < _a.length; _i++) {
                        var dropdonw = _a[_i];
                        if (simpleIndex.dropdown && simpleIndex.dropdown.id === dropdonw.id) {
                            simpleIndex.dropdown.label = dropdonw.label;
                            break;
                        }
                    }
                };
                ModalUpAddIndexesCtrl.prototype.isIndexFilled = function (index) {
                    if (index && index.label && index.code && index.indexType) {
                        if (index.indexType.code === "list" && !index.dropdown) {
                            return false;
                        }
                        if (index.regex && !this.checkRegexValidity(index.regex)) {
                            return false;
                        }
                        return true;
                    }
                    return false;
                };
                ModalUpAddIndexesCtrl.$inject = ['$uibModalInstance', 'AdminIndexService', 'modalOptions', 'BoardService', '$timeout', 'EntityTypeService', 'DropdownService'];
                return ModalUpAddIndexesCtrl;
            }());
            controller.ModalUpAddIndexesCtrl = ModalUpAddIndexesCtrl;
            demat.app.controller("ModalUpAddIndexesCtrl", ModalUpAddIndexesCtrl);
        })(controller = demat.controller || (demat.controller = {}));
    })(demat = arvato.demat || (arvato.demat = {}));
})(arvato || (arvato = {}));

angular.module("my-demat-portail").run(["$templateCache", function($templateCache) {$templateCache.put("components/authentification/login.html","<div class=\"bg-extended\">\r\n	<div class=\"align-vertical-center\">\r\n		<div class=\"container\">\r\n			<div class=\"row\">\r\n				<div class=\"well col-sm-offset-3 col-sm-6\">\r\n					<div class=\"well-heading well-primary text-center\">\r\n						<img src=\"img/logo-login.png\" alt=\"\">\r\n					</div>\r\n					<form class=\"well-body\" role=\"form\">\r\n						<div class=\"form-group label-floating\" ng-class=\"{\'has-error is-focused\' : authenticationError}\">\r\n							<label class=\"control-label\" for=\"login\">Login</label>\r\n							<input id=\"login\" type=\"text\" class=\"form-control sharp\" ng-model=\"username\" required=\"required\" />\r\n							<span ng-show=\"authenticationError\" class=\"help-block\">\r\n                               Veuillez vérifier vos informations d\'identification.\r\n                            </span>\r\n						</div>\r\n\r\n						<div class=\"form-group label-floating\">\r\n							<label class=\"control-label\" for=\"password\">Password</label>\r\n							<input id=\"password\" type=\"password\" class=\"form-control sharp\" ng-model=\"password\" required=\"required\" />\r\n						</div>\r\n\r\n						<!--<div class=\"form-group\">\r\n							<label for=\"rememberMe\" class=\"col-sm-3 control-label\">Remember me</label>\r\n							<div class=\"col-sm-9\">\r\n								<input id=\"rememberMe\" type=\"checkbox\" ng-model=\"rememberMe\" />\r\n							</div>\r\n						</div>-->\r\n						<div class=\"col-sm-offset-3 col-sm-6\">\r\n							<button class=\"btn btn-lg btn-login btn-block sharp\" ng-click=\"login()\">Login</button>\r\n						</div>\r\n					</form>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>");
$templateCache.put("components/error/error.html","<div id=\"page-wrapper\">\r\n    <br/><br/><br/><br/><br/>\r\n    <div class=\"row\">\r\n        <div class=\"col-sm-offset-3 col-sm-6\">\r\n            <div class=\"panel panel-danger\">\r\n                <div class=\"panel-heading\">\r\n                    <h3 class=\"panel-title pull-left\"><i class=\"glyphicon glyphicon-warning-sign\"></i> Error\r\n                        {{errorCtrl.code}}</h3>\r\n                    <a class=\"btn btn-primary pull-right\" href=\"#/home\"><i class=\"glyphicon glyphicon-home\"></i></a>\r\n                    <div class=\"clearfix\"></div>\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <h4>{{errorCtrl.message}}</h4>\r\n                    <h5><b>{{errorCtrl.error}}</b></h5>\r\n\r\n                    <span ng-if=\"errorCtrl.errorObject\">\r\n                        <h6>1 => <b>{{errorCtrl.errorObject.code}}</b> : {{errorCtrl.errorObject.message}}</h6>\r\n                    </span>\r\n                    <a class=\"btn btn-primary pull-right\" href=\"#/home\">RETOUR PAGE D\'ACCUEIL</a>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!--/.panel .panel-danger-->\r\n        </div>\r\n        <!--/.ol-sm-offset-3 .col-sm-6-->\r\n    </div>\r\n    <!--/.row-->\r\n</div>\r\n<!--/.page-wrapper-->");
$templateCache.put("components/home/home.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h1 class=\"page-header\"><i class=\"fa fa-dashboard fa-fw \"></i> Tableau de bord\r\n                <span id=\"refreshSpan\" class=\"pull-right\"><i class=\"fa fa-refresh\"></i> {{countSeconds +\' seconde(s)\'}}</span>\r\n            </h1>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-8 col-md-8 col-sm-12\">\r\n            <div access=\"{{tray.authoritiesAsString}}\" class=\"col-lg-3 col-md-4 col-sm-6\" ng-repeat=\"tray in homeCtrl.trays\">\r\n                <a id=\"trayPanel{{$index+1}}\" href=\"{{homeCtrl.getUriOfTrayByTypeAndId(tray.type,tray.id)}}\">\r\n                    <div ng-class=\"homeCtrl.getClass(tray)\">\r\n                        <div class=\"panel-heading\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col-xs-3\">\r\n                                    <i class=\"fa {{tray.icon}} fa-4x\"></i>\r\n                                </div>\r\n                                <div class=\"col-xs-9 text-right\">\r\n                                    <div class=\"huge\">{{tray.nbEnvelopes}}</div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"row\">\r\n                                <div class=\"col-xs-2 text-left\"><i ng-class=\"homeCtrl.getSubTypeIcon(tray)\" aria-hidden=\"true\"></i></div>\r\n                                <div class=\"col-xs-10 text-right\">{{tray.label}}</div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </a>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-md-8 -->\r\n\r\n        <div class=\"col-lg-2 col-md-4 col-sm-6\">\r\n            <div class=\"panel panel-info\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-pie-chart\"></i> Répartition des enveloppes\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <canvas id=\"trays\" class=\"chart chart-pie\" chart-data=\"pieChart.data\" chart-labels=\"pieChart.labels\"></canvas>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-md-2 -->\r\n\r\n        <div class=\"col-lg-2 col-md-4 col-sm-6 pull-right\">\r\n            <div class=\"panel panel-green\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-share\" aria-hidden=\"true\"></i> Total des plis intégrés : {{dashboard.allIntegrated}}<br>\r\n                    <i class=\"fa fa-trash\" aria-hidden=\"true\"></i> Total des plis supprimés : {{dashboard.allDeleted}}<br>\r\n                    <i class=\"fa fa-reply\" aria-hidden=\"true\"></i> Total des plis traités : {{dashboard.allTreated}}<br>\r\n                    <i class=\"fa fa-paper-plane\" aria-hidden=\"true\"></i> Total des plis exportés : {{dashboard.allExported}}<br>\r\n                    <i class=\"fa fa-sign-language\" aria-hidden=\"true\"></i> Vous avez traité : {{dashboard.userTreated}}\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n\r\n                <a ng-click=\"homeCtrl.getTreatedAndCadenceDetails()\">\r\n                    <div class=\"panel-footer\">\r\n                        <span class=\"pull-left\">Afficher plus de détails</span>\r\n                        <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n                        <div class=\"clearfix\"></div>\r\n                    </div>\r\n                    <!-- /.panel-footer -->\r\n                </a>\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-md-2 -->\r\n\r\n        <div access=\"Administrateur,Superviseur\" class=\"col-lg-4 col-md-8 col-sm-12 pull-right\" ng-if=\"barChart.data.length\">\r\n            <div class=\"panel panel-info\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-bar-chart\"></i> Répartition des traitements de plis par utilisateur\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <canvas id=\"base\" class=\"chart-bar\" chart-labels=\"barChart.labels\" chart-data=\"barChart.data\" chart-colors=\"barChart.colors\"></canvas>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-md-4 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <!-- Modal to delete a tray -->\r\n    <div modal-show modal-visible=\"homeCtrl.openPopin\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n        <div class=\"modal-dialog modal-lg\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Nombre de plis traités par corbeille et étape</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <table class=\"table table-bordered\" ng-if=\"homeCtrl.treatedAndCadence.length\">\r\n                        <tbody>\r\n                            <tr class=\"success\">\r\n                                <th>Libellé</th>\r\n                                <th>Classification</th>\r\n                                <th>Indexation</th>\r\n                                <th>Rejet</th>\r\n                                <th>Redirection</th>\r\n                                <th>Contrôle qualité</th>\r\n                            </tr>\r\n                            <tr ng-repeat=\"line in homeCtrl.treatedAndCadence\">\r\n                                <td>{{line.label}}</td>\r\n                                <td class=\"text-center\">{{line.nbClassfication}}</td>\r\n                                <td class=\"text-center\">{{line.nbIndexation}}</td>\r\n                                <td class=\"text-center\">{{line.nbRejet}}</td>\r\n                                <td class=\"text-center\">{{line.nbRedirection}}</td>\r\n                                <td class=\"text-center\">{{line.nbQualityCtrl}}</td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <p ng-if=\"!homeCtrl.treatedAndCadence.length\">Aucun traitement n\'a été effectué aujourd\'hui</p>\r\n                </div>\r\n                <div class=\"modal-header\">\r\n                    <h4 class=\"modal-title\">Temps de traitement par corbeille et étape</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <table class=\"table table-bordered\" ng-if=\"homeCtrl.treatedAndCadence.length\">\r\n                        <tbody>\r\n                            <tr class=\"success\">\r\n                                <th>Libellé</th>\r\n                                <th>Classification</th>\r\n                                <th>Indexation</th>\r\n                                <th>Rejet</th>\r\n                                <th>Redirection</th>\r\n                                <th>Contrôle qualité</th>\r\n                            </tr>\r\n                            <tr ng-repeat=\"line in homeCtrl.treatedAndCadence\">\r\n                                <td>{{line.label}}</td>\r\n                                <td class=\"text-center\">{{line.timeClassfication | toHrMinSec}}</td>\r\n                                <td class=\"text-center\">{{line.timeIndexation | toHrMinSec}}</td>\r\n                                <td class=\"text-center\">{{line.timeRejet | toHrMinSec}}</td>\r\n                                <td class=\"text-center\">{{line.timeRedirection | toHrMinSec}}</td>\r\n                                <td class=\"text-center\">{{line.timeQualityCtrl | toHrMinSec}}</td>\r\n                            </tr>\r\n                            <tr class=\"info\">\r\n                                <th>Total</th>\r\n                                <td class=\"text-center\" colspan=\"5\">{{homeCtrl.totalCadence | toHrMinSec}}</td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <p ng-if=\"!homeCtrl.treatedAndCadence.length\">Aucun traitement n\'a été effectué aujourd\'hui</p>\r\n                </div>\r\n                <div class=\"modal-header\">\r\n                    <h4 class=\"modal-title\">Cadence de traitement par corbeille et étape</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <table class=\"table table-bordered\" ng-if=\"homeCtrl.treatedAndCadence.length\">\r\n                        <tbody>\r\n                            <tr class=\"success\">\r\n                                <th>Libellé</th>\r\n                                <th>Classification</th>\r\n                                <th>Indexation</th>\r\n                                <th>Rejet</th>\r\n                                <th>Redirection</th>\r\n                                <th>Contrôle qualité</th>\r\n                            </tr>\r\n                            <tr ng-repeat=\"line in homeCtrl.treatedAndCadence\">\r\n                                <td>{{line.label}}</td>\r\n                                <td class=\"text-center\">{{line.timeClassfication | toCadence:line.nbClassfication}}</td>\r\n                                <td class=\"text-center\">{{line.timeIndexation | toCadence:line.nbIndexation}}</td>\r\n                                <td class=\"text-center\">{{line.timeRejet | toCadence:line.nbRejet}}</td>\r\n                                <td class=\"text-center\">{{line.timeRedirection | toCadence:line.nbRedirection}}</td>\r\n                                <td class=\"text-center\">{{line.timeQualityCtrl | toCadence:line.nbQualityCtrl}}</td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <p ng-if=\"!homeCtrl.treatedAndCadence.length\">Aucun traitement n\'a été effectué aujourd\'hui</p>\r\n                </div>\r\n            </div>\r\n            <!-- ./modal-content -->\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/loading/loading.html","<div class=\"container\">\r\n    <br/><br/><br/><br/><br/><br/><br/>\r\n    <span us-spinner=\"{radius:30, width:8, length: 16}\"></span>\r\n</div>");
$templateCache.put("components/navigation/navbars.html","<!-- Navigation -->\r\n<header id=\"header\">\r\n    <nav id=\"navbar\" class=\"navbar navbar-custom navbar-default navbar-static-top\" role=\"navigation\"\r\n         ng-controller=\"NavigationController as navCtrl\">\r\n        <div class=\"navbar-header\">\r\n            <a class=\"navbar-brand\" ng-href=\"#/home\">\r\n                <img src=\"img/{{navCtrl.client.logo}}\" onerror=\"this.src=\'img/logo.png\'\">\r\n            </a>\r\n            <span class=\"profile-ava\"><img src=\"img/{{account.honorific}}.png\"></span>\r\n            <span class=\"navbar-text navbar-right\">Bonjour, {{account.honorific}}. {{account.firstName}} {{account.lastName}}</span>\r\n        </div>\r\n        <!-- /.navbar-header -->\r\n        <ul id=\"top-navbar\" class=\"nav navbar-top-links navbar-right\">\r\n\r\n            <li access=\"Administrateur,Superviseur,Opérateur\" class=\"dropdown\"\r\n                id=\"dropdown_dashboard\">\r\n                <button type=\"button\" id=\"idLinkHome\" ng-click=\"navCtrl.goHome()\" class=\"btn btn-primary navbar-btn\"><i\r\n                        class=\"fa fa-dashboard fa-fw \"></i> Tableau de bord\r\n                </button>\r\n            </li>\r\n            <!-- /.dropdown -->\r\n\r\n            <li access=\"Administrateur,Superviseur,Opérateur,OTC\" class=\"dropdown\"\r\n                id=\"dropdown_tray\">\r\n                <button type=\"button\" ng-click=\"navCtrl.refreshTrays()\"\r\n                        class=\"btn btn-primary navbar-btn dropdown-toggle\" data-toggle=\"dropdown\"><i\r\n                        class=\"fa fa-cubes \"></i> Corbeilles de traitements <i class=\"fa fa-caret-down \"></i></button>\r\n                <ul class=\"dropdown-menu\">\r\n                    <li access=\"{{tray.authoritiesAsString}}\" ng-repeat=\"tray in navCtrl.trays \">\r\n                        <a href=\"#/tray-detail/{{tray.id}} \">{{tray.label}}\r\n                            <span ng-class=\"tray.nbEnvelopes ? \'badge badge-success\':\'badge badge-warning\'\">{{tray.nbEnvelopes}}</span>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n                <!-- /.dropdown-menu -->\r\n            </li>\r\n            <!-- /.dropdown -->\r\n\r\n            <li access=\"Administrateur,Superviseur\" class=\"dropdown\" id=\"dropdown_administration\">\r\n                <button type=\"button\" class=\"btn btn-primary navbar-btn dropdown-toggle\" data-toggle=\"dropdown\"><i\r\n                        class=\"fa fa-wrench fa-fw \"></i> Administration <i class=\"fa fa-caret-down\"></i></button>\r\n                <ul class=\"dropdown-menu\">\r\n                    <li>\r\n                        <a href=\"#/admin-trays\">Corbeilles</a>\r\n                    </li>\r\n                    <li>\r\n                        <a href=\"#/admin-indexes\">Indexs</a>\r\n                    </li>\r\n                    <li>\r\n                        <a href=\"#/admin-lists\">Listes</a>\r\n                    </li>\r\n                    <li>\r\n                        <a href=\"#/admin/entity-type/batch-type\">Type de Lot</a>\r\n                    </li>\r\n                    <li>\r\n                        <a href=\"#/admin-users \">Utilisateurs / Rôle</a>\r\n                    </li>\r\n                    <li>\r\n                        <a href=\"#/admin-xpath\"> Batch intégration</a>\r\n                    </li>\r\n                    <li>\r\n                        <a href=\"#/admin-application\">Application</a>\r\n                    </li>\r\n                    <li>\r\n                        <a href=\"#/admin-referencial\">Réferentiel</a>\r\n                    </li>\r\n                </ul>\r\n                <!-- /.dropdown-menu -->\r\n            </li>\r\n            <!-- /.dropdown -->\r\n\r\n            <li access=\"Administrateur,Superviseur\" class=\"dropdown\" id=\"dropdown_supervision\">\r\n                <button type=\"button\" class=\"btn btn-primary navbar-btn dropdown-toggle\" data-toggle=\"dropdown\"><i\r\n                        class=\"fa fa-eye\"></i> supervision <i class=\"fa fa-caret-down\"></i></button>\r\n                <ul class=\"dropdown-menu\">\r\n                    <li>\r\n                        <a href=\"#/historic\">Historique des plis</a>\r\n                    </li>\r\n                    <li>\r\n                        <a href=\"#/historic-batch\">Historique des lots</a>\r\n                    </li>\r\n                </ul>\r\n                <!-- /.dropdown-menu -->\r\n            </li>\r\n            <!-- /.dropdown -->\r\n\r\n            <li class=\"dropdown\" id=\"dropdown_user\">\r\n                <button type=\"button\" class=\"btn btn-primary navbar-btn dropdown-toggle\" data-toggle=\"dropdown\"><i\r\n                        class=\"fa fa-user fa-fw \"></i> <i class=\"fa fa-caret-down\"></i></button>\r\n                <ul class=\"dropdown-menu\">\r\n                    <li><a href=\"#/user/profile \"><i class=\"fa fa-user fa-fw \"></i> Profil</a>\r\n                    </li>\r\n                    <li class=\"divider \"></li>\r\n                    <li><a ng-href=\"#/logout \"><i class=\"fa fa-sign-out fa-fw \"></i> Déconnexion</a>\r\n                    </li>\r\n                </ul>\r\n                <!-- /.dropdown-menu -->\r\n            </li>\r\n            <!-- /.dropdown -->\r\n\r\n            <li class=\"dropdown\" id=\"dropdown_help\">\r\n                <button type=\"button\" class=\"btn btn-primary navbar-btn\" ng-click=\"navCtrl.toggleHelp()\"><i\r\n                        class=\"fa fa-keyboard-o\"></i> Aide\r\n                </button>\r\n            </li>\r\n            <!-- /.dropdown -->\r\n        </ul>\r\n        <!-- /.navbar-top-links -->\r\n    </nav>\r\n</header>");
$templateCache.put("components/user/user-account.html","<div id=\"page-wrapper\">\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-user\" aria-hidden=\"true\"></i> Profil de l\'utilisateur</h2>\r\n            <ol class=\"breadcrumb\">\r\n                <li>\r\n                    <a ng-href=\"#/home\">\r\n                        <i class=\"fa fa-dashboard fa-fw\"></i> Tableau de bord\r\n                    </a>\r\n                </li>\r\n                <li class=\"active\">\r\n                    <i class=\"fa fa-user\"></i> Profil de l\'utilisateur\r\n                </li>\r\n            </ol>\r\n            <!-- /.breadcrumb -->\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-6\">\r\n            <div class=\"panel panel-info\">\r\n                <div class=\"panel-body\">\r\n                    <span><i class=\"fa fa-user-circle-o\"></i> {{account.civility}} {{account.firstName}} {{account.lastName}}</span><br/>\r\n                    <span><i class=\"fa fa-phone\" aria-hidden=\"true\"></i> {{account.phone}}</span><br/>\r\n                    <span><i class=\"fa fa-at\" aria-hidden=\"true\"></i> {{account.email}}</span><br/><br/>\r\n                    <span><i class=\"fa fa-graduation-cap\"></i> <strong>Rôles :</strong> {{account.authoritiesAsString}}</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-lg-6 -->\r\n        <div class=\"col-lg-6\">\r\n            <div class=\"panel panel-info\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-lock\" aria-hidden=\"true\"></i> Changement de mot de passe\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <form role=\"form_update\" class=\"form-horizontal\">\r\n\r\n                        <div class=\"form-group\">\r\n                            <label for=\"oldPassword\" class=\"col-sm-4 control-label\">Ancien mot de passe :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"password\" ng-model=\"userCtrl.oldPassword\" class=\"form-control\" id=\"oldPassword\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\" ng-class=\"{\'has-error is-focused\' : userCtrl.passWordNotIdentique}\">\r\n                            <label for=\"newPassword\" class=\"col-sm-4 control-label\">Nouveau mot de passe :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"password\" ng-model=\"userCtrl.newPassword\" class=\"form-control\" id=\"newPassword\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\" ng-class=\"{\'has-error is-focused\' : userCtrl.passWordNotIdentique}\">\r\n                            <label for=\"confirmPassword\" class=\"col-sm-4 control-label\">Confirmer le mot de passe :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"password\" ng-model=\"userCtrl.confirmPassword\" class=\"form-control\" id=\"confirmPassword\" required>\r\n                                <span ng-show=\"userCtrl.passWordNotIdentique\" class=\"help-block\">Les deux mots de passe saisis ne sont pas identiques.</span>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n                <div class=\"panel-footer text-right\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" ng-click=\"userCtrl.resetFormChangePwd()\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-disabled=\"!userCtrl.isFormChangePwdFilled()\" ng-click=\"userCtrl.prepareChangePassword()\">Valider</button>\r\n                </div>\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-lg-6 -->\r\n    </div>\r\n    <!-- /.row -->\r\n    <!-- Modal to Change Password by user -->\r\n    <div modal-show modal-visible=\"userCtrl.openPopinConfirmChangePassword\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Confirmation</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <p>Êtes-vous sûr de vouloir changer de mot de passe ? </p>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"submit\" class=\"btn btn-success\" ng-click=\"userCtrl.changePassword()\">Valider</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/administration/application/admin-application.html","<div id=\"page-wrapper\">\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-cogs\" aria-hidden=\"true\"></i> Paramêtres de l\'application</h2>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-4\">\r\n            <div class=\"panel panel-info\">\r\n                <div class=\"panel-heading\"><i class=\"fa fa-suitcase\" aria-hidden=\"true\"></i> Client</div>\r\n                <form role=\"form_update\" class=\"form-horizontal\">\r\n                    <div class=\"panel-body\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"name\" class=\"col-sm-2 control-label\">Nom :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"text\" ng-model=\"adminAppCtrl.client.name\" class=\"form-control\" id=\"name\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"logo\" class=\"col-sm-2 control-label\">Logo :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"text\" ng-model=\"adminAppCtrl.client.logo\" class=\"form-control\" id=\"logo\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"active\" class=\"col-sm-2 control-label\"></label>\r\n                            <div class=\"col-sm-10\">\r\n                                <img src=\"img/{{adminAppCtrl.client.logo}}\" onerror=\"this.src=\'img/logo.png\'\" id=\"logo\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"active\" class=\"col-sm-2 control-label\">Active :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input id=\"active\" ng-model=\"adminAppCtrl.client.enable\" type=\"checkbox\">\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"panel-footer text-right\">\r\n                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"adminAppCtrl.cancelUpdateClientparameters()\">Annuler</button>\r\n                        <button type=\"button\" class=\"btn btn-success\" ng-disabled=\"!adminAppCtrl.isClientFilled()\"\r\n                            ng-click=\"adminAppCtrl.updateClient()\">Valider</button>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>");
$templateCache.put("components/administration/indexes/admin-indexes.html","<div id=\"page-wrapper\">\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-tags\" aria-hidden=\"true\"></i> Administration des indexs</h2>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <uib-tabset active=\"active\">\r\n        <uib-tab index=\"0\" select=\"adminIndexesCtrl.loadBoardIndex()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-tags\" aria-hidden=\"true\"></i> Indexs simples\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\" ng-controller=\"HelperController as helperController\">\r\n                <div class=\"col-lg-12\"  ng-controller=\"ModalIndexesCtrl as modalIndexesCtrl\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"searchSimpleIdx\" class=\"form-control\" placeholder=\"CHERCHER\" aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"> <button class=\"btn btn-success\" type=\"button\" ng-click=\"modalIndexesCtrl.openUpdate(adminIndexesCtrl.board, line.id, \'add\')\" id=\"basic-addon1\"><i class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i> AJOUTER</button></span>\r\n                    </div>\r\n                    <!-- /.input-group -->\r\n                    <br/>\r\n\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n\r\n                        <tr class=\"warning\">\r\n                            <th ng-repeat=\"column in adminIndexesCtrl.board.boardHead.columns\" ng-style=\"helperController.calculateClass(column.id)\">\r\n                            <span>{{column.value}}</span>\r\n                        </th>\r\n                        </tr>\r\n                        </thead>\r\n\r\n                        <tbody>\r\n                            <tr ng-repeat=\"line in adminIndexesCtrl.board.boardLines | filter : searchSimpleIdx | limitTo : adminIndexesCtrl.itemsPerPage : (adminIndexesCtrl.currentPage-1)*adminIndexesCtrl.itemsPerPage\">\r\n                                <td ng-repeat=\"column in line.columns\" ng-style=\"helperController.calculateClass(column.id)\">{{column.value}}</td>\r\n                                <td class=\"text-center\">\r\n                                    <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\" title=\"Modifier\" ng-click=\"modalIndexesCtrl.openUpdate(adminIndexesCtrl.board, line.id, \'update\')\"></button>\r\n                                    <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\" ng-click=\"modalIndexesCtrl.openDelete(line.id)\"></button>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <!-- /.table -->\r\n\r\n                    <div class=\"main-pagination\" ng-show=\"adminIndexesCtrl.simpleIndexes && adminIndexesCtrl.simpleIndexes.length\">\r\n                        <uib-pagination total-items=\"adminIndexesCtrl.simpleIndexes.length\" ng-model=\"adminIndexesCtrl.currentPage\" max-size=\"adminIndexesCtrl.maxSize\"\r\n                            class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\" previous-text=\"Précédent\"\r\n                            next-text=\"Suivant\" items-per-page=\"adminIndexesCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                    <!-- /.main-pagination -->\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n\r\n\r\n        </uib-tab>\r\n        <uib-tab index=\"1\" select=\"adminIndexesCtrl.loadAllCompositeIndexes()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-inbox\" aria-hidden=\"true\"></i> Indexs composés\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"searchMultIdx\" class=\"form-control\" placeholder=\"CHERCHER\" aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"> <button class=\"btn btn-success\" type=\"button\" ng-click=\"adminIndexesCtrl.openPopinCompositeIdxAdd = true\" id=\"basic-addon1\"><i class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i> AJOUTER</button></span>\r\n                    </div>\r\n                    <!-- /.input-group -->\r\n                    <br/>\r\n\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                            <tr class=\"warning\">\r\n                                <th>Libellé</th>\r\n                                <th>code</th>\r\n                                <th>Niveau</th>\r\n                                <th>type</th>\r\n                                <th class=\"text-center\">Date de création</th>\r\n                                <th class=\"text-center\">Dernière modification</th>\r\n                                <th class=\"text-center\">Action</th>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                            <tr ng-repeat=\"index in adminIndexesCtrl.compositeIndexes | filter : searchMultIdx | limitTo : adminIndexesCtrl.itemsPerPage : (adminIndexesCtrl.currentPage-1)*adminIndexesCtrl.itemsPerPage\">\r\n                                <td>{{index.label}}</td>\r\n                                <td>{{index.code}}</td>\r\n                                <td>{{index.indexType}}</td>\r\n                                <td>{{index.inputType}}</td>\r\n                                <td class=\"text-center\">{{index.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                                <td class=\"text-center\">{{index.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                                <td class=\"text-center\">\r\n                                    <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\" title=\"Modifier\" ng-click=\"adminIndexesCtrl.prepareUpdateCompositeIndex(index)\"></button>\r\n                                    <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\" ng-click=\"adminIndexesCtrl.prepareDeleteCompositeIndex(index)\"></button>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <!-- /.table -->\r\n\r\n                    <div class=\"main-pagination\" ng-show=\"adminIndexesCtrl.compositeIndexes && adminIndexesCtrl.compositeIndexes.length\">\r\n                        <uib-pagination total-items=\"adminIndexesCtrl.compositeIndexes.length\" ng-model=\"adminIndexesCtrl.currentPage\" max-size=\"adminIndexesCtrl.maxSize\"\r\n                            class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\" previous-text=\"Précédent\"\r\n                            next-text=\"Suivant\" items-per-page=\"adminIndexesCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                    <!-- /.main-pagination -->\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n\r\n            <!-- Modal to add new composite index -->\r\n            <div modal-show modal-visible=\"adminIndexesCtrl.openPopinCompositeIdxAdd\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog modal-lg\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"> <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter un nouveau index composé </h4>\r\n                        </div>\r\n                        <form role=\"form_create\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminIndexesCtrl.compositeIndexAdd.label\" class=\"form-control\" id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"code\" class=\"col-sm-2 control-label\">Code :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminIndexesCtrl.compositeIndexAdd.code\" class=\"form-control\" id=\"code\" required>\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"active\" class=\"col-sm-2 control-label\">Liste d\'indexs :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <div class=\"row\">\r\n                                            <div class=\"col-lg-12\">\r\n                                                <div class=\"panel panel-info\">\r\n                                                    <div class=\"panel-heading\">Liste d\'indexs affectés</div>\r\n                                                    <div class=\"panel-body\">\r\n                                                        <ul ui-sortable=\"adminIndexesCtrl.sortableOptions\" class=\"list-group connectedList ul-noStyle\" ng-init=\"adminIndexesCtrl.compositeIndexAdd.childIndexes = []\"\r\n                                                            ng-model=\"adminIndexesCtrl.compositeIndexAdd.childIndexes\">\r\n                                                            <li class=\"list-group-item list-group-item-warning\" ng-repeat=\"index in adminIndexesCtrl.compositeIndexAdd.childIndexes\">{{index.label}}<i class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                                            <li ng-show=\"!adminIndexesCtrl.compositeIndexAdd.childIndexes.length\">&nbsp;</li>\r\n                                                        </ul>\r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                            <!-- /.col-lg-12 -->\r\n                                            <div class=\"col-lg-12\">\r\n                                                <div class=\"panel panel-info\">\r\n                                                    <div class=\"panel-heading\">Liste d\'indexs Existants</div>\r\n                                                    <div class=\"panel-body\">\r\n                                                        <ul ui-sortable=\"adminIndexesCtrl.sortableOptions\" class=\"list-group connectedList ul-noStyle\" ng-model=\"adminIndexesCtrl.simpleIndexes\">\r\n                                                            <li class=\"list-group-item list-group-item-success\" ng-repeat=\"index in adminIndexesCtrl.simpleIndexes\">{{index.label}} <i class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                                            <li ng-show=\"!adminIndexesCtrl.simpleIndexes.length\">&nbsp;</li>\r\n                                                        </ul>\r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                            <!-- /.col-lg-12 -->\r\n                                        </div>\r\n                                        <!-- /.row -->\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <!-- ./panel-body -->\r\n                            <div class=\"panel-footer text-right\">\r\n                                <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" ng-click=\"adminIndexesCtrl.compositeIndexAdd = undefined;\">Annuler</button>\r\n                                <button type=\"button\" class=\"btn btn-success\" ng-disabled=\"!adminIndexesCtrl.isCompositeIndexFilled(adminIndexesCtrl.compositeIndexAdd)\"\r\n                                    ng-click=\"adminIndexesCtrl.createCompsiteIndex()\">valider</button>\r\n                            </div>\r\n                            <!-- ./panel-footer -->\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update composite index -->\r\n            <div modal-show modal-visible=\"adminIndexesCtrl.openPopinCompositeIdxEdit\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"> <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier l\'index composé </h4>\r\n                        </div>\r\n                        <form role=\"form_create\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminIndexesCtrl.compositeIndexEdit.label\" class=\"form-control\" id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"code\" class=\"col-sm-2 control-label\">Code :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminIndexesCtrl.compositeIndexEdit.code\" class=\"form-control\" id=\"code\" required>\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"active\" class=\"col-sm-2 control-label\">Liste d\'indexs :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <div class=\"row\">\r\n                                            <div class=\"col-lg-12\">\r\n                                                <div class=\"panel panel-info\">\r\n                                                    <div class=\"panel-heading\">Liste d\'indexs affectés</div>\r\n                                                    <div class=\"panel-body\">\r\n                                                        <ul ui-sortable=\"adminIndexesCtrl.sortableOptions\" class=\"list-group connectedList ul-noStyle\" ng-init=\"adminIndexesCtrl.compositeIndexEdit.childIndexes = []\"\r\n                                                            ng-model=\"adminIndexesCtrl.compositeIndexEdit.childIndexes\">\r\n                                                            <li class=\"list-group-item list-group-item-warning\" ng-repeat=\"index in adminIndexesCtrl.compositeIndexEdit.childIndexes\">{{index.label}}<i class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                                            <li ng-show=\"!adminIndexesCtrl.compositeIndexEdit.childIndexes.length\">&nbsp;</li>\r\n                                                        </ul>\r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                            <!-- /.col-lg-12 -->\r\n                                            <div class=\"col-lg-12\">\r\n                                                <div class=\"panel panel-info\">\r\n                                                    <div class=\"panel-heading\">Liste d\'indexs Existants</div>\r\n                                                    <div class=\"panel-body\">\r\n                                                        <ul ui-sortable=\"adminIndexesCtrl.sortableOptions\" class=\"list-group connectedList ul-noStyle\" ng-model=\"adminIndexesCtrl.simpleIndexes\">\r\n                                                            <li class=\"list-group-item list-group-item-success\" ng-repeat=\"index in adminIndexesCtrl.simpleIndexes\">{{index.label}} <i class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                                            <li ng-show=\"!adminIndexesCtrl.simpleIndexes.length\">&nbsp;</li>\r\n                                                        </ul>\r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                            <!-- /.col-lg-12 -->\r\n                                        </div>\r\n                                        <!-- /.row -->\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <!-- ./panel-body -->\r\n                            <div class=\"panel-footer text-right\">\r\n                                <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" ng-click=\"adminIndexesCtrl.compositeIndexEdit = undefined;\">Annuler</button>\r\n                                <button type=\"button\" class=\"btn btn-success\" ng-disabled=\"!adminIndexesCtrl.isCompositeIndexFilled(adminIndexesCtrl.compositeIndexEdit)\"\r\n                                    ng-click=\"adminIndexesCtrl.updateCompositeIndex()\">valider</button>\r\n                            </div>\r\n                            <!-- ./panel-footer -->\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to delete an index -->\r\n            <div modal-show modal-visible=\"adminIndexesCtrl.openPopinCompositeIdxConfirm\" class=\"modal fade\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement l\'index : <strong>{{adminIndexesCtrl.compositeIndexEdit.label}}</strong></p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\" ng-click=\"adminIndexesCtrl.confirmDeleteCompositeIndex()\">Valider</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n        <uib-tab index=\"2\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-inbox\" aria-hidden=\"true\"></i> Référentiel\r\n            </uib-tab-heading>\r\n            <br/>\r\n\r\n        </uib-tab>\r\n    </uib-tabset>\r\n</div>\r\n<!-- /#page-wrapper -->\r\n");
$templateCache.put("components/administration/integration-batch/integration-batch.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-cogs\" aria-hidden=\"true\"></i> Batch intégration</h2>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n\r\n    <uib-tabset active=\"active\">\r\n        <uib-tab index=\"0\" select=\"integrationBatchCtrl.loadXPathExpressions()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-code\" aria-hidden=\"true\"></i> Xpath expressions\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-3\">\r\n                    <!-- /.panel -->\r\n                    <div class=\"panel panel-info\">\r\n                        <div class=\"panel-heading\">\r\n                            <i class=\"glyphicon glyphicon-edit\"></i> Lot\r\n                        </div>\r\n                        <!-- /.panel-heading -->\r\n                        <div class=\"panel-body\">\r\n                            <form role=\"form\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"batch\">Lot:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.batch\" class=\"form-control\" id=\"batch\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"batchName\">Nom du Lot:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.batchName\" class=\"form-control\" id=\"batchName\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"batchId\">Id du Lot:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.batchId\" class=\"form-control\" id=\"batchId\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                            </form>\r\n                        </div>\r\n                        <!-- /.panel-body -->\r\n                    </div>\r\n                    <!-- /.panel -->\r\n                </div>\r\n                <!-- /.col-lg-3 -->\r\n\r\n                <div class=\"col-lg-3\">\r\n                    <!-- /.panel -->\r\n                    <div class=\"panel panel-info\">\r\n                        <div class=\"panel-heading\">\r\n                            <i class=\"glyphicon glyphicon-edit\"></i> Enveloppe\r\n                        </div>\r\n                        <!-- /.panel-heading -->\r\n                        <div class=\"panel-body\">\r\n                            <form role=\"form\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"enevelope\">Enveloppe:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.envelope\" class=\"form-control\" id=\"enevelope\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"enevelope\">Url de l\'enveloppe:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.envelopeUrl\" class=\"form-control\" id=\"enevelope\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"enevelope\">Id de l\'enveloppe</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.envelopeId\" class=\"form-control\" id=\"enevelope\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"page\">Indice référentiel de l\'enveloppe:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.refIndexEnv\" class=\"form-control\" id=\"indiceEnvValue\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                            </form>\r\n                        </div>\r\n                        <!-- /.panel-body -->\r\n                    </div>\r\n                    <!-- /.panel -->\r\n                </div>\r\n                <!-- /.col-lg-3 -->\r\n\r\n                <div class=\"col-lg-3\">\r\n                    <!-- /.panel -->\r\n                    <div class=\"panel panel-info\">\r\n                        <div class=\"panel-heading\">\r\n                            <i class=\"glyphicon glyphicon-edit\"></i> Document\r\n                        </div>\r\n                        <!-- /.panel-heading -->\r\n                        <div class=\"panel-body\">\r\n                            <form role=\"form\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"document\">Document:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.document\" class=\"form-control\" id=\"document\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"documentName\">Nom du document:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.documentName\" class=\"form-control\" id=\"documentName\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"documentType\">Type du document:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.documentType\" class=\"form-control\" id=\"documentType\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"pageName\">Indice référentiel du document:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.refIndexDoc\" class=\"form-control\" id=\"indiceDocValue\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                            </form>\r\n                        </div>\r\n                        <!-- /.panel-body -->\r\n                    </div>\r\n                    <!-- /.panel -->\r\n                </div>\r\n                <!-- /.col-lg-3 -->\r\n\r\n                <div class=\"col-lg-3\">\r\n                    <!-- /.panel -->\r\n                    <div class=\"panel panel-info\">\r\n                        <div class=\"panel-heading\">\r\n                            <i class=\"glyphicon glyphicon-edit\"></i> Page\r\n                        </div>\r\n                        <!-- /.panel-heading -->\r\n                        <div class=\"panel-body\">\r\n                            <form role=\"form\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"page\">Page:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.page\" class=\"form-control\" id=\"page\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"pageName\">Nom de page:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.pageName\" class=\"form-control\" id=\"pageName\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"pageType\">Type de page:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.pageType\" class=\"form-control\" id=\"pageType\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"pagePicture\">Image de page:</label>\r\n                                    <input type=\"text\" ng-model=\"integrationBatchCtrl.xpathExpr.pagePicture\" class=\"form-control\" id=\"pagePicture\" placeholder=\"XPath expression\"\r\n                                        required>\r\n                                </div>\r\n                            </form>\r\n                        </div>\r\n                        <!-- /.panel-body -->\r\n                    </div>\r\n                    <!-- /.panel -->\r\n                </div>\r\n                <!-- /.col-lg-3 -->\r\n\r\n            </div>\r\n            <!-- /.row -->\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <button type=\"submit\" class=\"btn btn-success pull-right\" ng-click=\"integrationBatchCtrl.saveXpathExpressions()\">Enregistrer</button>\r\n                </div>\r\n                <!-- /.col-lg-3 -->\r\n            </div>\r\n            <!-- /.row -->\r\n\r\n        </uib-tab>\r\n        <uib-tab index=\"1\" select=\"integrationBatchCtrl.loadRegex()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-map-signs\" aria-hidden=\"true\"></i> Expressions régulières\r\n            </uib-tab-heading>\r\n            <br/>\r\n\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"search\" class=\"form-control\" placeholder=\"CHERCHER\" aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"> <button class=\"btn btn-success\" type=\"button\" ng-disabled=\"!integrationBatchCtrl.referentialQueries.length\" ng-click=\"integrationBatchCtrl.openPopinRegexAdd = true\"id=\"basic-addon1\"><i class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i> AJOUTER</button></span>\r\n                    </div>\r\n                    <br>\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                            <tr class=\"warning\">\r\n                                <th>Libellé</th>\r\n                                <th>Expression</th>\r\n                                <th>Libellé requêtes</th>\r\n                                <th class=\"text-center\">Date de création</th>\r\n                                <th class=\"text-center\">Dernière modification</th>\r\n                                <th class=\"text-center\">Action</th>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                            <tr ng-repeat=\"regex in integrationBatchCtrl.regexList.slice(((integrationBatchCtrl.currentPage-1)*integrationBatchCtrl.itemsPerPage), ((integrationBatchCtrl.currentPage)*integrationBatchCtrl.itemsPerPage)) | filter : search\">\r\n                                <td>{{regex.label}}</td>\r\n                                <td>{{regex.regex}}</td>\r\n                                <td>{{regex.referencialQuery.label}}</td>\r\n                                <td class=\"text-center\">{{regex.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                                <td class=\"text-center\">{{regex.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                                <td class=\"text-center\">\r\n                                    <button title=\"Modifier\" type=\"button\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\" ng-click=\"integrationBatchCtrl.prepareUpdateRegex(regex)\"></button>\r\n                                    <button title=\"Supprimer\" type=\"button\" class=\"btn btn-sm btn-danger fa fa-trash-o\" ng-click=\"integrationBatchCtrl.prepareDeleteRegex(regex)\"></button>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <div class=\"main-pagination\" ng-show=\"integrationBatchCtrl.regexList && integrationBatchCtrl.regexList.length!=0\">\r\n                        <uib-pagination total-items=\"integrationBatchCtrl.regexList.length\" ng-model=\"integrationBatchCtrl.currentPage\" max-size=\"integrationBatchCtrl.maxSize\"\r\n                            class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\" previous-text=\"Précédent\"\r\n                            next-text=\"Suivant\" items-per-page=\"integrationBatchCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\" ng-if=\"integrationBatchCtrl.regexList.length > 0\">\r\n                    <div class=\"panel panel-default\">\r\n                        <div class=\"panel-heading\">\r\n                            <i class=\"fa fa-sort-numeric-asc\" aria-hidden=\"true\"></i> priorité\r\n                        </div>\r\n                        <!-- /.panel-heading -->\r\n                        <div class=\"panel-body\">\r\n                            <div class=\"row\" ui-sortable=\"{\'ui-floating\': true}\" ng-model=\"integrationBatchCtrl.regexListSortable\">\r\n                                <div class=\"col-lg-2 col-md-4\" ng-repeat=\"regex in integrationBatchCtrl.regexListSortable\">\r\n                                    <div class=\"panel panel-primary\">\r\n                                        <div class=\"panel-heading text-center\">{{$index + 1}}</div>\r\n                                        <div class=\"panel-body \">\r\n                                            {{regex.label}}\r\n                                        </div>\r\n                                    </div>\r\n                                    <!-- /.panel -->\r\n                                </div>\r\n                            </div>\r\n                            <!-- /.row -->\r\n                            <button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"integrationBatchCtrl.updateRegexPriority()\">Valider </button>\r\n                        </div>\r\n                        <!-- /.panel-body -->\r\n                    </div>\r\n                    <!-- /.panel -->\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n\r\n            <!-- Modal to add regex -->\r\n            <div modal-show modal-visible=\"integrationBatchCtrl.openPopinRegexAdd\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"> <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Nouvelle expression régulière</h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"integrationBatchCtrl.regexAdd.label\" class=\"form-control\" id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"regex\" class=\"col-sm-2 control-label\">Expression:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"integrationBatchCtrl.regexAdd.regex\" class=\"form-control\" id=\"regex\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"type\" class=\"col-sm-2 control-label\">Requête:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <select id=\"selectTray\" class=\"form-control\" ng-model=\"integrationBatchCtrl.regexAdd.referencialQuery.id\" ng-options=\"query.id as query.label for query in integrationBatchCtrl.referentialQueries\"\r\n                                            required>\r\n                                            <option value=\"\"></option>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"integrationBatchCtrl.regexAdd = undefined\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"!integrationBatchCtrl.isRegexFilled(integrationBatchCtrl.regexAdd)\"\r\n                                    ng-click=\"integrationBatchCtrl.createRegex()\">Valider</button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update regex -->\r\n            <div modal-show modal-visible=\"integrationBatchCtrl.openPopinRegexEdit\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"> <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier l\'expression régulière</h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"integrationBatchCtrl.regexEdit.label\" class=\"form-control\" id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"regex\" class=\"col-sm-2 control-label\">Expression:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"integrationBatchCtrl.regexEdit.regex\" class=\"form-control\" id=\"regex\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"type\" class=\"col-sm-2 control-label\">Requête:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <select id=\"selectTray\" class=\"form-control\" ng-model=\"integrationBatchCtrl.regexEdit.referencialQuery.id\" ng-options=\"query.id as query.label for query in integrationBatchCtrl.referentialQueries\"\r\n                                            required>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"integrationBatchCtrl.regexEdit = undefined\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"!integrationBatchCtrl.isRegexFilled(integrationBatchCtrl.regexEdit)\"\r\n                                    ng-click=\"integrationBatchCtrl.updateRegex()\">Valider</button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to delete regex -->\r\n            <div modal-show modal-visible=\"integrationBatchCtrl.openPopinRegexConfirm\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement l\'expression régulière : <strong>{{integrationBatchCtrl.regexEdit.label}}</strong></p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"integrationBatchCtrl.regexEdit = undefined\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\" ng-click=\"integrationBatchCtrl.confirmDeleteRegex()\">Valider</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n        </uib-tab>\r\n    </uib-tabset>\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/administration/lists/admin-lists.html","<div id=\"page-wrapper\">\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-list-alt\" aria-hidden=\"true\"></i> Administration des Listes</h2>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <uib-tabset active=\"active\">\r\n        <uib-tab index=\"0\" select=\"adminListsCtrl.loadLists()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-list-ul\" aria-hidden=\"true\"></i> Listes déroulantes\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\"\r\n                                                                             aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"searchList\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                               aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"><button class=\"btn btn-success\" type=\"button\"\r\n                                                              ng-click=\"adminListsCtrl.openPopinAdd = true\"\r\n                                                              id=\"basic-addon1\"><i class=\"fa fa-plus-circle\"\r\n                                                                                   aria-hidden=\"true\"></i> AJOUTER</button></span></span>\r\n                    </div>\r\n                    <br>\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                        <tr class=\"warning\">\r\n                            <th>Libellé</th>\r\n                            <th class=\"text-center\">Date de création</th>\r\n                            <th class=\"text-center\">Dernière modification</th>\r\n                            <th class=\"text-center\">Action</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"list in adminListsCtrl.lists | filter : searchList | limitTo : adminListsCtrl.itemsPerPage : (adminListsCtrl.currentPage-1)*adminListsCtrl.itemsPerPage\">\r\n                            <td>{{list.label}}</td>\r\n                            <td class=\"text-center\">{{list.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">{{list.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-warning fa fa-list-ul\"\r\n                                        title=\"Gérer les items\"\r\n                                        ng-click=\"adminListsCtrl.manageListItems(list)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\"\r\n                                        title=\"Modifier\" ng-click=\"adminListsCtrl.prepareUpdateList(list)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\"\r\n                                        ng-click=\"adminListsCtrl.prepareDeleteList(list)\"></button>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n\r\n                    <div class=\"main-pagination\" ng-show=\"adminListsCtrl.lists && adminListsCtrl.lists.length\">\r\n                        <uib-pagination total-items=\"adminListsCtrl.lists.length\" ng-model=\"adminListsCtrl.currentPage\"\r\n                                        max-size=\"adminListsCtrl.maxSize\"\r\n                                        class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                        previous-text=\"Précédent\"\r\n                                        next-text=\"Suivant\" items-per-page=\"adminListsCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n\r\n            <!-- Modal to create a list -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinAdd\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter une liste\r\n                            </h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminListsCtrl.listAdd.label\" class=\"form-control\"\r\n                                               id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\"\r\n                                        ng-click=\"adminListsCtrl.listAdd = undefined;\">Annuler\r\n                                </button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.listAdd.label\"\r\n                                        ng-click=\"adminListsCtrl.createList()\">Ajouter\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update a list -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinEdit\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier la liste\r\n                            </h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminListsCtrl.listEdit.label\" class=\"form-control\"\r\n                                               id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.listEdit.label\"\r\n                                        ng-click=\"adminListsCtrl.updateList()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to delete a list -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinConfirm\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement la list : <strong>{{adminListsCtrl.listEdit.label}}</strong>\r\n                            </p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\" ng-click=\"adminListsCtrl.confirmDeleteList()\">\r\n                                Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal items list -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinConfirmEditListItem\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog modal-lg\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" ng-click=\"itemSearch=undefined\">\r\n                                &times;\r\n                            </button>\r\n                            <h4 class=\"modal-title\"><strong>Gestion des items de la liste :</strong>\r\n                                {{adminListsCtrl.listEdit.label}}</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <div class=\"panel-heading\">\r\n                                <div class=\"input-group\">\r\n                                    <input type=\"text\" ng-model=\"itemSearch\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                                           aria-describedby=\"basic-addon1\">\r\n                                    <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\"\r\n                                                                                         aria-hidden=\"true\"></i></span>\r\n                                </div>\r\n                            </div>\r\n                            <table class=\"table table-bordered table-striped table-hover\">\r\n                                <thead>\r\n                                <tr class=\"warning\">\r\n                                    <th class=\"col-sm-4\">Libellé</th>\r\n                                    <th class=\"col-sm-4\">Code</th>\r\n                                    <th class=\"col-sm-1\">Défaut</th>\r\n                                    <th class=\"col-sm-2 text-center\">Action</th>\r\n                                </tr>\r\n                                </thead>\r\n                                <tbody>\r\n                                <tr ng-repeat=\"item in adminListsCtrl.listEdit.items | filter : itemSearch\"\r\n                                    ng-class=\"{\'has-error is-focused\' : !item.label}\">\r\n                                    <td><input type=\"text\" ng-model=\"item.label\" class=\"form-control\"\r\n                                               ng-disabled=\"!item.isEdit\"\r\n                                               required></td>\r\n                                    <td><input type=\"text\" ng-model=\"item.code\" class=\"form-control\"\r\n                                               ng-disabled=\"!item.isEdit\"\r\n                                               required></td>\r\n                                    <td class=\"text-center\"><input type=\"checkbox\" ng-model=\"item.defaultItem\"\r\n                                                                   ng-disabled=\"!item.isEdit\"\r\n                                                                   ng-click=\"adminListsCtrl.setDefaultListItem($index)\">\r\n                                    </td>\r\n                                    <td class=\"text-center\">\r\n                                        <button class=\"btn btn-warning fa fa-pencil\" type=\"submit\" ng-if=\"!item.isEdit\"\r\n                                                ng-disabled=\"adminListsCtrl.editItemPopinListItem\"\r\n                                                ng-click=\"item.isEdit = true ; adminListsCtrl.editItemPopinListItem = true\"></button>\r\n                                        <button class=\"btn btn-success fa fa-check\" type=\"submit\" ng-if=\"item.isEdit\"\r\n                                                ng-disabled=\"!item.label\"\r\n                                                ng-click=\"item.isEdit = false ; adminListsCtrl.editItemPopinListItem = false\"></button>\r\n                                        <button class=\"btn btn-danger fa fa-trash\" type=\"submit\" ng-if=\"!item.isEdit\"\r\n                                                ng-disabled=\"adminListsCtrl.editItemPopinListItem\"\r\n                                                ng-click=\"adminListsCtrl.deleteItemFromList($index)\"></button>\r\n                                    </td>\r\n                                </tr>\r\n                                </tbody>\r\n                            </table>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <table class=\"table table-bordered table-striped table-hover\">\r\n                                <tfoot>\r\n                                <tr>\r\n                                    <td class=\"col-sm-4\">\r\n                                        <input class=\"form-control\" type=\"text\" ng-model=\"newItem.label\"\r\n                                               placeholder=\"Ajouter un nouveau libellé\">\r\n                                    </td>\r\n                                    <td class=\"col-sm-4\">\r\n                                        <input class=\"form-control\" type=\"text\" ng-model=\"newItem.code\"\r\n                                               placeholder=\"Ajouter un nouveau code\">\r\n                                    </td>\r\n                                    <td class=\"col-sm-1 text-center\">\r\n                                        <input type=\"checkbox\" ng-model=\"newItem.defaultItem\"\r\n                                               ng-init=\"newItem.defaultItem=false\">\r\n                                    </td>\r\n                                    <td class=\"col-sm-2 text-center\">\r\n                                        <button ng-disabled=\"!newItem.label || !newItem.code\"\r\n                                                ng-click=\"adminListsCtrl.addItemToList(newItem)\"\r\n                                                class=\"btn btn-success fa fa-plus\"></button>\r\n                                    </td>\r\n                                </tr>\r\n                                </tfoot>\r\n                            </table>\r\n                            <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\"\r\n                                    ng-click=\"itemSearch=undefined\">Annuler\r\n                            </button>\r\n                            <button type=\"button\" class=\"btn btn-success\"\r\n                                    ng-disabled=\"adminListsCtrl.editItemPopinListItem\"\r\n                                    ng-click=\"adminListsCtrl.validateListItems(); itemSearch=undefined\">Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n        <uib-tab index=\"1\" select=\"adminListsCtrl.loadEnvTypes()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-envelope-o\" aria-hidden=\"true\"></i> Types d\'enveloppe\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\"\r\n                                                                             aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"searchEnvType\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                               aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"><button class=\"btn btn-success\" type=\"button\"\r\n                                                              ng-click=\"adminListsCtrl.openPopinEnvtypeAdd = true\"\r\n                                                              id=\"basic-addon1\"><i class=\"fa fa-plus-circle\"\r\n                                                                                   aria-hidden=\"true\"></i> AJOUTER</button></span></span>\r\n                    </div>\r\n                    <br>\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                        <tr class=\"warning\">\r\n                            <th>Libellé</th>\r\n                            <th>Code</th>\r\n                            <th class=\"text-center\">Date de création</th>\r\n                            <th class=\"text-center\">Dernière modification</th>\r\n                            <th class=\"text-center\">Action</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"envType in adminListsCtrl.envTypes | filter : searchEnvType | limitTo : adminListsCtrl.itemsPerPage : (adminListsCtrl.currentPage-1)*adminListsCtrl.itemsPerPage\">\r\n                            <td>{{envType.label}}</td>\r\n                            <td>{{envType.code}}</td>\r\n                            <td class=\"text-center\">{{envType.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">{{envType.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\"\r\n                                        title=\"Modifier\"\r\n                                        ng-click=\"adminListsCtrl.prepareUpdateEnvType(envType)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\"\r\n                                        ng-click=\"adminListsCtrl.prepareDeleteEnvType(envType)\"></button>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n\r\n                    <div class=\"main-pagination\">\r\n                        <uib-pagination total-items=\"adminListsCtrl.envTypes.length\"\r\n                                        ng-model=\"adminListsCtrl.currentPage\" max-size=\"adminListsCtrl.maxSize\"\r\n                                        class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                        previous-text=\"Précédent\"\r\n                                        next-text=\"Suivant\" items-per-page=\"adminListsCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n            <!-- Modal to delete a envelope type -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinEnvtypeConfirm\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement le type d\'enveloppe : <strong>{{adminListsCtrl.envtypeEdit.label}}</strong>\r\n                            </p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\"\r\n                                    ng-click=\"adminListsCtrl.confirmDeleteEnvType()\">Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update a envelope type -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinEnvtypeEdit\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier le type\r\n                                d\'enveloppe</h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <form role=\"form_create\" class=\"form-horizontal\">\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.envtypeEdit.label\"\r\n                                                   class=\"form-control\" id=\"label\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Code :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.envtypeEdit.code\"\r\n                                                   class=\"form-control\" id=\"code\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Type de document :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <select id=\"type\" ng-model=\"adminListsCtrl.envtypeEdit.docType.id\"\r\n                                                    class=\"form-control\"\r\n                                                    ng-options=\"doctype.id as doctype.label for doctype in adminListsCtrl.doctyes\"\r\n                                                    required></select>\r\n                                        </div>\r\n                                    </div>\r\n                                </form>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.envtypeEdit.label||!adminListsCtrl.envtypeEdit.code\"\r\n                                        ng-click=\"adminListsCtrl.updateEnvType()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to create a envelope type -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinEnvtypeAdd\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter un type\r\n                                d\'enveloppe </h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <form role=\"form_create\" class=\"form-horizontal\">\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.envtypeAdd.label\"\r\n                                                   class=\"form-control\" id=\"label\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Code :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.envtypeAdd.code\"\r\n                                                   class=\"form-control\" id=\"code\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Type de document :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <select id=\"type\" ng-model=\"adminListsCtrl.envtypeAdd.docType.id\"\r\n                                                    class=\"form-control\"\r\n                                                    ng-options=\"doctype.id as doctype.label for doctype in adminListsCtrl.doctyes\"\r\n                                                    required></select>\r\n                                        </div>\r\n                                    </div>\r\n                                </form>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\"\r\n                                        ng-click=\"adminListsCtrl.envtypeAdd =undefined\" data-dismiss=\"modal\">Annuler\r\n                                </button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.envtypeAdd.label||!adminListsCtrl.envtypeAdd.code\"\r\n                                        ng-click=\"adminListsCtrl.createEnvtype()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n        <uib-tab index=\"2\" select=\"adminListsCtrl.loadDocTypes()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-file-o\" aria-hidden=\"true\"></i> Types de document\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\"\r\n                                                                             aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"searchDocType\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                               aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"><button class=\"btn btn-success\" type=\"button\"\r\n                                                              ng-click=\"adminListsCtrl.openPopinDoctypeAdd = true\"\r\n                                                              id=\"basic-addon1\"><i class=\"fa fa-plus-circle\"\r\n                                                                                   aria-hidden=\"true\"></i> AJOUTER</button></span></span>\r\n                    </div>\r\n                    <br>\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                        <tr class=\"warning\">\r\n                            <th>Libellé</th>\r\n                            <th>Code</th>\r\n                            <th class=\"text-center\">Date de création</th>\r\n                            <th class=\"text-center\">Dernière modification</th>\r\n                            <th class=\"text-center\">Action</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"docType in adminListsCtrl.doctyes | filter : searchDocType | limitTo: adminListsCtrl.itemsPerPage : (adminListsCtrl.currentPage-1)*adminListsCtrl.itemsPerPage\">\r\n                            <td>{{docType.label}}</td>\r\n                            <td>{{docType.code}}</td>\r\n                            <td class=\"text-center\">{{docType.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">{{docType.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\"\r\n                                        title=\"Modifier\"\r\n                                        ng-click=\"adminListsCtrl.prepareUpdateDocType(docType)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\"\r\n                                        ng-click=\"adminListsCtrl.prepareDeleteDocType(docType)\"></button>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n\r\n                    <div class=\"main-pagination\">\r\n                        <uib-pagination total-items=\"adminListsCtrl.doctyes.length\"\r\n                                        ng-model=\"adminListsCtrl.currentPage\" max-size=\"adminListsCtrl.maxSize\"\r\n                                        class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                        previous-text=\"Précédent\"\r\n                                        next-text=\"Suivant\" items-per-page=\"adminListsCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n\r\n            <!-- Modal to delete a docType -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinDoctypeConfirm\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement le type de document : <strong>{{adminListsCtrl.doctypeEdit.label}}</strong>\r\n                            </p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\"\r\n                                    ng-click=\"adminListsCtrl.confirmDeleteDocType()\">Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update a docType -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinDoctypeEdit\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier le type de\r\n                                document </h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <form role=\"form_create\" class=\"form-horizontal\">\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.doctypeEdit.label\"\r\n                                                   class=\"form-control\" id=\"label\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Code :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.doctypeEdit.code\"\r\n                                                   class=\"form-control\" id=\"code\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                </form>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.doctypeEdit.label||!adminListsCtrl.doctypeEdit.code\"\r\n                                        ng-click=\"adminListsCtrl.updateDocType()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to create a docType -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinDoctypeAdd\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter un type de\r\n                                document </h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <form role=\"form_create\" class=\"form-horizontal\">\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.doctypeAdd.label\"\r\n                                                   class=\"form-control\" id=\"label\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Code :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.doctypeAdd.code\"\r\n                                                   class=\"form-control\" id=\"code\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                </form>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\"\r\n                                        ng-click=\"adminListsCtrl.doctypeAdd=undefined\">Annuler\r\n                                </button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.doctypeAdd.label||!adminListsCtrl.doctypeAdd.code\"\r\n                                        ng-click=\"adminListsCtrl.createDocType()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n        <uib-tab index=\"3\" select=\"adminListsCtrl.loadRejectTypes()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-envelope-o\" aria-hidden=\"true\"></i> Types de rejet\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\"\r\n                                                                             aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"searchRejectType\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                               aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"><button class=\"btn btn-success\" type=\"button\"\r\n                                                              ng-click=\"adminListsCtrl.openPopinRejectTypeAdd = true\"\r\n                                                              id=\"basic-addon1\"><i class=\"fa fa-plus-circle\"\r\n                                                                                   aria-hidden=\"true\"></i> AJOUTER</button></span></span>\r\n                    </div>\r\n                    <br>\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                        <tr class=\"warning\">\r\n                            <th>Libellé</th>\r\n                            <th>Code</th>\r\n                            <th>Rejet applicable sur</th>\r\n                            <th class=\"text-center\">Date de création</th>\r\n                            <th class=\"text-center\">Dernière modification</th>\r\n                            <th class=\"text-center\">Action</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"rejectType in adminListsCtrl.rejectTypes | filter : searchRejectType | limitTo : adminListsCtrl.itemsPerPage : (adminListsCtrl.currentPage-1)*adminListsCtrl.itemsPerPage\">\r\n                            <td>{{rejectType.label}}</td>\r\n                            <td>{{rejectType.code}}</td>\r\n                            <td>{{rejectType.structuralEntityType.label}}</td>\r\n                            <td class=\"text-center\">{{rejectType.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">{{rejectType.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\"\r\n                                        title=\"Modifier\"\r\n                                        ng-click=\"adminListsCtrl.prepareUpdateRejectType(rejectType)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\"\r\n                                        ng-click=\"adminListsCtrl.prepareDeleteRejectType(rejectType)\"></button>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n\r\n                    <div class=\"main-pagination\">\r\n                        <uib-pagination total-items=\"adminListsCtrl.rejectTypes.length\"\r\n                                        ng-model=\"adminListsCtrl.currentPage\" max-size=\"adminListsCtrl.maxSize\"\r\n                                        class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                        previous-text=\"Précédent\"\r\n                                        next-text=\"Suivant\" items-per-page=\"adminListsCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n            <!-- Modal to delete a reject type -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinRejectTypeConfirm\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement le type de rejet : <strong>{{adminListsCtrl.rejectTypeEdit.label}}</strong>\r\n                            </p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\"\r\n                                    ng-click=\"adminListsCtrl.confirmDeleteRejectType()\">Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to create a reject type -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinRejectTypeAdd\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter un type de\r\n                                rejet </h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <form role=\"form_rejecType_create\" class=\"form-horizontal\">\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.rejectTypeAdd.label\"\r\n                                                   class=\"form-control\" id=\"label\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Code :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.rejectTypeAdd.code\"\r\n                                                   class=\"form-control\" id=\"code\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Rejet applicable sur :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <select ng-model=\"adminListsCtrl.rejectTypeAdd.structuralEntityType\"\r\n                                                    ng-options=\"structuralEntityType as structuralEntityType.label for structuralEntityType in adminListsCtrl.structuralEntityTypes\"\r\n                                                    class=\"form-control\"\r\n                                                    id=\"structuralEntityType\" required></select>\r\n                                        </div>\r\n                                    </div>\r\n                                </form>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\"\r\n                                        ng-click=\"adminListsCtrl.rejectTypeAdd = undefined\" data-dismiss=\"modal\">Annuler\r\n                                </button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.rejectTypeAdd.label||!adminListsCtrl.rejectTypeAdd.code\"\r\n                                        ng-click=\"adminListsCtrl.createRejectType()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update a reject type -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinRejectTypeEdit\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier le type de\r\n                                rejet</h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <form role=\"form_rejecType_update\" class=\"form-horizontal\">\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.rejectTypeEdit.label\"\r\n                                                   class=\"form-control\" id=\"label\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Code :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <input type=\"text\" ng-model=\"adminListsCtrl.rejectTypeEdit.code\"\r\n                                                   class=\"form-control\" id=\"code\" required>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"form-group\">\r\n                                        <label for=\"label\" class=\"col-sm-2 control-label\">Rejet applicable sur :</label>\r\n                                        <div class=\"col-sm-10\">\r\n                                            <select ng-model=\"adminListsCtrl.rejectTypeEdit.structuralEntityType\"\r\n                                                    ng-options=\"structuralEntityType as structuralEntityType.label for structuralEntityType in adminListsCtrl.structuralEntityTypes\"\r\n                                                    class=\"form-control\"\r\n                                                    id=\"structuralEntityType\" required></select>\r\n                                        </div>\r\n                                    </div>\r\n                                </form>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.rejectTypeEdit.label||!adminListsCtrl.rejectTypeEdit.code\"\r\n                                        ng-click=\"adminListsCtrl.updateRejectType()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n        <uib-tab index=\"4\" select=\"adminListsCtrl.loadCategories()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-envelope-o\" aria-hidden=\"true\"></i> Catégories\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\"\r\n                                                                             aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"searchCategory\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                               aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"><button class=\"btn btn-success\" type=\"button\"\r\n                                                              ng-click=\"adminListsCtrl.openPopinCategoryAdd = true\"\r\n                                                              id=\"basic-addon1\"><i class=\"fa fa-plus-circle\"\r\n                                                                                   aria-hidden=\"true\"></i> AJOUTER</button></span></span>\r\n                    </div>\r\n                    <br>\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                        <tr class=\"warning\">\r\n                            <th>Libellé</th>\r\n                            <th>Type</th>\r\n                            <th class=\"text-center\">Date de création</th>\r\n                            <th class=\"text-center\">Dernière modification</th>\r\n                            <th class=\"text-center\">Action</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"category in adminListsCtrl.categories | filter : searchCategory | limitTo : adminListsCtrl.itemsPerPage : (adminListsCtrl.currentPage-1)*adminListsCtrl.itemsPerPage\">\r\n                            <td>{{category.label}}</td>\r\n                            <td>{{category.type}}</td>\r\n                            <td class=\"text-center\">{{category.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">{{category.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\"\r\n                                        title=\"Modifier\"\r\n                                        ng-click=\"adminListsCtrl.prepareUpdateCategory(category)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\"\r\n                                        ng-click=\"adminListsCtrl.prepareDeleteCategory(category)\"></button>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n\r\n                    <div class=\"main-pagination\">\r\n                        <uib-pagination total-items=\"adminListsCtrl.rejectTypes.length\"\r\n                                        ng-model=\"adminListsCtrl.currentPage\" max-size=\"adminListsCtrl.maxSize\"\r\n                                        class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                        previous-text=\"Précédent\"\r\n                                        next-text=\"Suivant\" items-per-page=\"adminListsCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n            <!-- Modal to delete a category -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinCategoryConfirm\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement la categorie : <strong>{{adminListsCtrl.categoryEdit.label}}</strong>\r\n                            </p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\"\r\n                                    ng-click=\"adminListsCtrl.confirmDeleteCategory()\">Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to create a category -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinCategoryAdd\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter une\r\n                                categorie </h4>\r\n                        </div>\r\n                        <form role=\"form_category_create\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminListsCtrl.categoryAdd.label\"\r\n                                               class=\"form-control\" id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"type\" class=\"col-sm-2 control-label\">Type :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <select ng-model=\"adminListsCtrl.categoryAdd.type\"\r\n                                                ng-options=\"type for type in adminListsCtrl.getCategoryTypeValues()\"\r\n                                                class=\"form-control\"\r\n                                                id=\"type\" required></select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"color\" class=\"col-sm-2 control-label\">Couleur :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <select ng-model=\"adminListsCtrl.categoryAdd.color\" class=\"form-control\"\r\n                                                id=\"color\">\r\n                                            <option class=\"text-{{label}}\" value=\"{{label}}\"\r\n                                                    ng-repeat=\"label in adminListsCtrl.getCategoryColorValues()\">\r\n                                                {{label}}\r\n                                            </option>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"icon\" class=\"col-sm-2 control-label\">Icône :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminListsCtrl.categoryAdd.icon\"\r\n                                               class=\"form-control\" id=\"icon\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\" ng-if=\"adminListsCtrl.categoryAdd.type === \'table\'\">\r\n                                    <label for=\"nbColumns\" class=\"col-sm-2 control-label\">Colonne :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"number\" ng-model=\"adminListsCtrl.categoryAdd.nbColumns\"\r\n                                               class=\"form-control\" id=\"nbColumns\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\" ng-if=\"adminListsCtrl.categoryAdd.type === \'table\'\">\r\n                                    <label for=\"nbRows\" class=\"col-sm-2 control-label\">Ligne :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"number\" ng-model=\"adminListsCtrl.categoryAdd.nbRows\"\r\n                                               class=\"form-control\" id=\"nbRows\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"open\" class=\"col-sm-2 control-label\">Ouvert :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"checkbox\" ng-model=\"adminListsCtrl.categoryAdd.open\"\r\n                                               class=\"form-control\" id=\"open\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"enabled\" class=\"col-sm-2 control-label\">Active :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"checkbox\" ng-model=\"adminListsCtrl.categoryAdd.enabled\"\r\n                                               class=\"form-control\" id=\"enabled\">\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\"\r\n                                        ng-click=\"adminListsCtrl.categoryAdd = undefined\" data-dismiss=\"modal\">Annuler\r\n                                </button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.isCategoryFilled(adminListsCtrl.categoryAdd)\"\r\n                                        ng-click=\"adminListsCtrl.createCategory()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update a category -->\r\n            <div modal-show modal-visible=\"adminListsCtrl.openPopinCategoryEdit\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier la\r\n                                categorie</h4>\r\n                        </div>\r\n                        <form role=\"form_category_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminListsCtrl.categoryEdit.label\"\r\n                                               class=\"form-control\" id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"type\" class=\"col-sm-2 control-label\">Type :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <select ng-model=\"adminListsCtrl.categoryEdit.type\"\r\n                                                ng-options=\"type for type in adminListsCtrl.getCategoryTypeValues()\"\r\n                                                class=\"form-control\" id=\"type\" required></select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"color\" class=\"col-sm-2 control-label\">Couleur :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <select ng-model=\"adminListsCtrl.categoryEdit.color\" class=\"form-control\"\r\n                                                id=\"color\">\r\n                                            <option class=\"text-{{label}}\" value=\"{{label}}\"\r\n                                                    ng-repeat=\"label in adminListsCtrl.getCategoryColorValues()\">\r\n                                                {{label}}\r\n                                            </option>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"icon\" class=\"col-sm-2 control-label\">Icône :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"adminListsCtrl.categoryEdit.icon\"\r\n                                               class=\"form-control\" id=\"icon\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\" ng-if=\"adminListsCtrl.categoryEdit.type === \'table\'\">\r\n                                    <label for=\"nbColumns\" class=\"col-sm-2 control-label\">Colonne :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"number\" ng-model=\"adminListsCtrl.categoryEdit.nbColumns\"\r\n                                               class=\"form-control\" id=\"nbColumns\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\" ng-if=\"adminListsCtrl.categoryEdit.type === \'table\'\">\r\n                                    <label for=\"nbRows\" class=\"col-sm-2 control-label\">Ligne :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"number\" ng-model=\"adminListsCtrl.categoryEdit.nbRows\"\r\n                                               class=\"form-control\" id=\"nbRows\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"open\" class=\"col-sm-2 control-label\">Ouvert :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"checkbox\" ng-model=\"adminListsCtrl.categoryEdit.open\"\r\n                                               class=\"form-control\" id=\"open\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"enabled\" class=\"col-sm-2 control-label\">Active :</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"checkbox\" ng-model=\"adminListsCtrl.categoryEdit.enabled\"\r\n                                               class=\"form-control\" id=\"enabled\">\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminListsCtrl.isCategoryFilled(adminListsCtrl.categoryEdit)\"\r\n                                        ng-click=\"adminListsCtrl.updateCategory()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n    </uib-tabset>\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/administration/referencial/admin-referencial.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-cogs\" aria-hidden=\"true\"></i> Référentiel</h2>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n\r\n    <uib-tabset active=\"active\">\r\n    	<uib-tab index=\"0\" select=\"referencialCtrl.loadRefQueries()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-mixcloud\" aria-hidden=\"true\"></i> Requêtes référentiel\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"search\" class=\"form-control\" placeholder=\"CHERCHER\" aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"> <button class=\"btn btn-success\" type=\"button\" ng-click=\"referencialCtrl.openPopinAdd = true\"id=\"basic-addon1\"><i class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i> AJOUTER</button></span>\r\n                    </div>\r\n                    <br>\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                            <tr class=\"warning\">\r\n                                <th>Id</th>\r\n                                <th>Libellé</th>\r\n                                <th>Index</th>\r\n                                <th>Type</th>\r\n                                <th>Type de réferentiel</th>\r\n                                <th class=\"text-center\">Date de création</th>\r\n                                <th class=\"text-center\">Dernière modification</th>\r\n                                <th class=\"text-center\">Action</th>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                            <tr class=\"clickable-row\" ng-repeat=\"refQuery in referencialCtrl.referentialQueries.slice(((referencialCtrl.currentPage-1)*referencialCtrl.itemsPerPage), ((referencialCtrl.currentPage)*referencialCtrl.itemsPerPage)) | filter : search\">\r\n                                <td>{{refQuery.id}}</td>\r\n                                <td>{{refQuery.label}}</td>\r\n                                <td>{{refQuery.index}}</td>\r\n                                <td>{{refQuery.type}}</td>\r\n                                <td>{{refQuery.referencialType.type}}</td>\r\n                                <td class=\"text-center\">{{refQuery.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                                <td class=\"text-center\">{{refQuery.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                                <td class=\"text-center\">\r\n                                    <button title=\"Modifier\" type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\" ng-click=\"referencialCtrl.prepareUpdateRefQuery(refQuery)\"></button>\r\n                                    <button title=\"Supprimer\" type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" ng-click=\"referencialCtrl.prepareDeleteRefQuery(refQuery)\"></button>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <div class=\"main-pagination\" ng-show=\"referencialCtrl.referentialQueries && referencialCtrl.referentialQueries.length!=0\">\r\n                        <uib-pagination total-items=\"referencialCtrl.referentialQueries.length\" ng-model=\"referencialCtrl.currentPage\"\r\n                            max-size=\"referencialCtrl.maxSize\" class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\"\r\n                            last-text=\"Dernier\" previous-text=\"Précédent\" next-text=\"Suivant\" items-per-page=\"referencialCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n\r\n            <!-- Modal to update a referential -->\r\n            <div modal-show modal-visible=\"referencialCtrl.openPopinAdd\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"> <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter une requête</h4>\r\n                        </div>\r\n                        <form role=\"form_create\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"referencialCtrl.referencialQueryAdd.label\" class=\"form-control\" id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"index\" class=\"col-sm-2 control-label\">index:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"referencialCtrl.referencialQueryAdd.index\" class=\"form-control\" id=\"index\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"type\" class=\"col-sm-2 control-label\">Type:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"referencialCtrl.referencialQueryAdd.type\" class=\"form-control\" id=\"type\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"type\" class=\"col-sm-2 control-label\">Type de référentiel:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <select id=\"selectReferentialType\" class=\"form-control\" ng-model=\"referencialCtrl.referencialQueryAdd.referencialType\"\r\n                                        	ng-options=\"query as query.label for query in referencialCtrl.referencialTypeQueries\"\r\n                                            required>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"referencialCtrl.referencialQueryAdd = undefined\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"!referencialCtrl.isRefQueryFilled(referencialCtrl.referencialQueryAdd)\"\r\n                                    ng-click=\"referencialCtrl.createReferencialQuery()\">Valider</button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update a referential -->\r\n            <div modal-show modal-visible=\"referencialCtrl.openPopinEdit\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"> <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier la requête</h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"referencialCtrl.referencialQueryEdit.label\" class=\"form-control\" id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"index\" class=\"col-sm-2 control-label\">index:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"referencialCtrl.referencialQueryEdit.index\" class=\"form-control\" id=\"index\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"type\" class=\"col-sm-2 control-label\">Type:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <input type=\"text\" ng-model=\"referencialCtrl.referencialQueryEdit.type\" class=\"form-control\" id=\"type\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"type\" class=\"col-sm-2 control-label\">Type de référentiel:</label>\r\n                                    <div class=\"col-sm-10\">\r\n                                        <select id=\"selectReferentialType\" class=\"form-control\" ng-model=\"referencialCtrl.referencialQueryEdit.referencialType.id\"\r\n                                        	ng-options=\"query.id as query.label for query in referencialCtrl.referencialTypeQueries\"\r\n                                            required>\r\n                                        </select>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"referencialCtrl.referencialQueryEdit = undefined\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"!referencialCtrl.isRefQueryFilled(referencialCtrl.referencialQueryEdit)\"\r\n                                    ng-click=\"referencialCtrl.updateRefQuery()\">Valider</button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to delete referential -->\r\n            <div modal-show modal-visible=\"referencialCtrl.openPopinConfirm\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement la requête : <strong>{{referencialCtrl.referencialQueryEdit.label}}</strong></p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"referencialCtrl.referencialQueryEdit = undefined\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\" ng-click=\"referencialCtrl.confirmDeleteRefQuery()\">Valider</button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n    </uib-tabset>\r\n</div>");
$templateCache.put("components/administration/tray/admin-trays.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-cubes\" aria-hidden=\"true\"></i> Corbeilles de traitements</h2>\r\n            <ol class=\"breadcrumb\">\r\n                <li>\r\n                    <i class=\"fa fa-wrench fa-fw\"></i> Administration\r\n                </li>\r\n                <li class=\"active\">\r\n                    <i class=\"fa fa-cogs\"></i> Gestion des Corbeilles\r\n                </li>\r\n            </ol>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <div class=\"input-group\">\r\n                <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></span>\r\n                <input type=\"text\" ng-model=\"search\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                       aria-describedby=\"basic-addon1\">\r\n                <span class=\"input-group-btn\"> <button class=\"btn btn-success\" type=\"button\"\r\n                                                       ng-click=\"adminTrayCtrl.openPopinAdd = true\" id=\"basic-addon1\"><i\r\n                        class=\"fa fa-plus-circle\" aria-hidden=\"true\"></i> AJOUTER</button></span>\r\n            </div>\r\n            <br>\r\n            <table class=\"table table-bordered table-striped table-hover\">\r\n                <thead>\r\n                <tr class=\"warning\">\r\n                    <th>Libellé</th>\r\n                    <th>Type</th>\r\n                    <th> Sous type</th>\r\n                    <th>Statut</th>\r\n                    <th>Date de création</th>\r\n                    <th>Dernière modification</th>\r\n                    <th class=\"text-center\">Action</th>\r\n                </tr>\r\n                </thead>\r\n                <tbody>\r\n                <tr ng-repeat=\"tray in adminTrayCtrl.trays | filter : search | limitTo : adminTrayCtrl.itemsPerPage : (adminTrayCtrl.currentPage-1)*adminTrayCtrl.itemsPerPage\">\r\n                    <td>{{tray.label}}</td>\r\n                    <td>{{tray.type.label}}</td>\r\n                    <td>{{tray.structuralEntityType.label}}</td>\r\n                    <td>{{tray.enabled ? \'Active\' : \'Désactive\'}}</td>\r\n                    <td>{{tray.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                    <td>{{tray.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                    <td class=\"text-center\">\r\n                        <button type=\"button\" title=\"Modifier\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\"\r\n                                ng-click=\"adminTrayCtrl.prepareUpdateTray(tray)\"></button>\r\n                        <button type=\"button\" title=\"Supprimer\" class=\"btn btn-sm btn-danger fa fa-trash-o\"\r\n                                ng-click=\"adminTrayCtrl.prepareDeleteTray(tray)\"></button>\r\n                        <button type=\"button\" title=\"Gérer les types d\'envelope/document\"\r\n                                class=\"btn btn-sm btn-info fa fa-tags\"\r\n                                ng-click=\"adminTrayCtrl.manageTrayDocType(tray)\"></button>\r\n                        <button title=\"Gérer les indexes\" type=\"button\" class=\"btn btn-sm btn-primary fa fa-link\"\r\n                                ng-disabled=\"tray.type.code!==\'IDX\'\"\r\n                                ng-click=\"adminTrayCtrl.openTrayIndexesAffectation(tray)\"></button>\r\n                        <button title=\"Gérer les autorisations\" type=\"button\" class=\"btn btn-sm btn-warning fa fa-users\"\r\n                                ng-click=\"adminTrayCtrl.openTrayRolesAffectation(tray)\"></button>\r\n                        <button title=\"Gérer les rejets\" type=\"button\"\r\n                                class=\"btn btn-sm btn-danger fa fa-share-square-o\"\r\n                                ng-click=\"adminTrayCtrl.openTrayRejectsAffectation(tray)\"></button>\r\n                    </td>\r\n                </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n            <div class=\"main-pagination\" ng-show=\"adminTrayCtrl.trays && adminTrayCtrl.trays.length!=0\">\r\n                <uib-pagination total-items=\"adminTrayCtrl.trays.length\" ng-model=\"adminTrayCtrl.currentPage\"\r\n                                max-size=\"adminTrayCtrl.maxSize\"\r\n                                class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                previous-text=\"Précédent\" next-text=\"Suivant\"\r\n                                items-per-page=\"adminTrayCtrl.itemsPerPage\">\r\n                </uib-pagination>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <!-- Modal to add a tray -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinAdd\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter une corbeille</h4>\r\n                </div>\r\n                <form role=\"form_create_tray\" class=\"form-horizontal\">\r\n                    <div class=\"modal-body\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"text\" ng-model=\"adminTrayCtrl.trayAdd.label\" class=\"form-control\"\r\n                                       id=\"label\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"color\" class=\"col-sm-2 control-label\">Couleur :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select class=\"form-control\" id=\"color\" ng-model=\"adminTrayCtrl.trayAdd.color\" required>\r\n                                    <option class=\"text-{{label}}\" value=\"{{label}}\"\r\n                                            ng-repeat=\" label in [\'default\',\'primary\', \'success\',\'info\', \'warning\',\'danger\']\">\r\n                                        {{label}}\r\n                                    </option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"color\" class=\"col-sm-2 control-label\">Icône :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"text\" ng-model=\"adminTrayCtrl.trayAdd.icon\" class=\"form-control\" id=\"label\"\r\n                                       required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"type\" class=\"col-sm-2 control-label\">Type :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select id=\"type\" ng-model=\"adminTrayCtrl.trayAdd.type.id\" class=\"form-control\"\r\n                                        ng-options=\"trayType.id as trayType.label for trayType in adminTrayCtrl.trayTypes\"\r\n                                        required></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"type\" class=\"col-sm-2 control-label\">Niveau :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select id=\"type\" ng-model=\"adminTrayCtrl.trayAdd.structuralEntityType.id\"\r\n                                        class=\"form-control\"\r\n                                        ng-options=\"traySubType.id as traySubType.label for traySubType in adminTrayCtrl.structuralEntityTypes\"\r\n                                        required></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"searchType\" class=\"col-sm-2 control-label\">Recherche :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select ng-model=\"adminTrayCtrl.trayAdd.envSearch.id\" class=\"form-control\"\r\n                                        ng-options=\"envSearch.id as envSearch.label for envSearch in adminTrayCtrl.searchCriterion\"\r\n                                        required></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"accordionCloseOthers\" class=\"col-sm-2 control-label\">Accordéon :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select class=\"form-control\" ng-model=\"adminTrayCtrl.trayAdd.accordionCloseOthers\"\r\n                                        required>\r\n                                    <option value=\"true\" ng-selected=\"true\">Fermer les autres accordéon</option>\r\n                                    <option value=\"false\">Laisser ouvert les autres accordéons</option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"comment\" class=\"col-sm-2 control-label\">Commentaire&nbsp;:</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <textarea ng-model=\"adminTrayCtrl.trayAdd.comment\" class=\"form-control\"\r\n                                          id=\"comment\"></textarea>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"print\" class=\"col-sm-2 control-label\">Imprimer&nbsp;pdf :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input ng-model=\"adminTrayCtrl.trayAdd.canPrint\" type=\"checkbox\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"active\" class=\"col-sm-2 control-label\">Active :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input ng-model=\"adminTrayCtrl.trayAdd.enabled\" type=\"checkbox\">\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"modal-footer\">\r\n                        <button type=\"button\" class=\"btn btn-danger\" ng-click=\"adminTrayCtrl.trayAdd = undefined\"\r\n                                data-dismiss=\"modal\">Annuler\r\n                        </button>\r\n                        <button type=\"button\" class=\"btn btn-success\"\r\n                                ng-disabled=\"!adminTrayCtrl.isTrayFilled(adminTrayCtrl.trayAdd)\"\r\n                                ng-click=\"adminTrayCtrl.createTray()\">Ajouter\r\n                        </button>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal to update a tray -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinEdit\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier la corbeille</h4>\r\n                </div>\r\n                <form role=\"form_update_tray\" class=\"form-horizontal\">\r\n                    <div class=\"modal-body\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"text\" ng-model=\"adminTrayCtrl.trayEdit.label\" class=\"form-control\"\r\n                                       id=\"label\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"color\" class=\"col-sm-2 control-label\">Couleur :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select class=\"form-control\" id=\"color\" ng-model=\"adminTrayCtrl.trayEdit.color\"\r\n                                        required>\r\n                                    <option class=\"text-{{label}}\" value=\"{{label}}\"\r\n                                            ng-repeat=\" label in [\'default\',\'primary\', \'success\',\'info\', \'warning\',\'danger\']\">\r\n                                        {{label}}\r\n                                    </option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"color\" class=\"col-sm-2 control-label\">Icône :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"text\" ng-model=\"adminTrayCtrl.trayEdit.icon\" class=\"form-control\"\r\n                                       id=\"label\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"type\" class=\"col-sm-2 control-label\">Type :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select id=\"type\" ng-model=\"adminTrayCtrl.trayEdit.type.id\" class=\"form-control\"\r\n                                        ng-options=\"trayType.id as trayType.label for trayType in adminTrayCtrl.trayTypes\"\r\n                                        required></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"type\" class=\"col-sm-2 control-label\">Niveau :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select id=\"type\" ng-model=\"adminTrayCtrl.trayEdit.structuralEntityType.id\"\r\n                                        class=\"form-control\"\r\n                                        ng-options=\"traySubType.id as traySubType.label for traySubType in adminTrayCtrl.structuralEntityTypes\"\r\n                                        required></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"searchType\" class=\"col-sm-2 control-label\">Recherche :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select ng-model=\"adminTrayCtrl.trayEdit.envSearch.id\" class=\"form-control\"\r\n                                        ng-options=\"envSearch.id as envSearch.label for envSearch in adminTrayCtrl.searchCriterion\"\r\n                                        required></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"accordionCloseOthers\" class=\"col-sm-2 control-label\">Accordéon :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select class=\"form-control\" ng-model=\"adminTrayCtrl.trayEdit.accordionCloseOthers\"\r\n                                        required>\r\n                                    <option ng-selected=\"adminTrayCtrl.trayEdit.accordionCloseOthers === true\"\r\n                                            value=\"true\">Fermer les autres accordéon\r\n                                    </option>\r\n                                    <option ng-selected=\"adminTrayCtrl.trayEdit.accordionCloseOthers === false\"\r\n                                            value=\"false\">Laisser ouvert les autres accordéons\r\n                                    </option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"comment\" class=\"col-sm-2 control-label\">Commentaire&nbsp;:</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <textarea ng-model=\"adminTrayCtrl.trayEdit.comment\" class=\"form-control\"\r\n                                          id=\"comment\"></textarea>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"print\" class=\"col-sm-2 control-label\">Imprimer&nbsp;pdf :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input ng-model=\"adminTrayCtrl.trayEdit.canPrint\" type=\"checkbox\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"active\" class=\"col-sm-2 control-label\">Active :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input ng-model=\"adminTrayCtrl.trayEdit.enabled\" type=\"checkbox\">\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"modal-footer\">\r\n                        <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                        <button type=\"submit\" class=\"btn btn-success\"\r\n                                ng-disabled=\"!adminTrayCtrl.isTrayFilled(adminTrayCtrl.trayEdit)\"\r\n                                ng-click=\"adminTrayCtrl.updateTray()\">Valider\r\n                        </button>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal to delete a tray -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinConfirm\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Confirmation</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <p>Êtes-vous sûr de vouloir supprimer définitivement la corbeille : <strong>{{adminTrayCtrl.trayEdit.label}}</strong>\r\n                    </p>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"submit\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.confirmDeleteTray()\">Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal role affectation -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinDocTypesAffectation\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog modal-lg\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Affectation des types de document pour la corbeille :\r\n                        {{adminTrayCtrl.trayDocTypesAffectation.tray.label}}</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-6\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Types de document existant</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayDocTypesAffectation.unaffectedDocTypes\">\r\n                                        <li class=\"list-group-item list-group-item-warning\"\r\n                                            ng-repeat=\"docType in adminTrayCtrl.trayDocTypesAffectation.unaffectedDocTypes\">\r\n                                            {{docType.label}} ({{docType.code}}) <i\r\n                                                class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                        <li ng-show=\"adminTrayCtrl.trayDocTypesAffectation.unaffectedDocTypes.length==0\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                        <div class=\"col-lg-6\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Types de document sur la corbeille</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayDocTypesAffectation.affectedDocTypes\">\r\n                                        <li class=\"list-group-item list-group-item-success\"\r\n                                            ng-repeat=\"docType in adminTrayCtrl.trayDocTypesAffectation.affectedDocTypes\">\r\n                                            {{docType.label}} ({{docType.code}}) <i\r\n                                                class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                        <li ng-show=\"adminTrayCtrl.trayDocTypesAffectation.affectedDocTypes.length==0\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                    </div>\r\n                    <!-- /.row -->\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.validateTrayDocTypes()\">\r\n                        Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal envelope type affectation -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinEnvTypesAffectation\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog modal-lg\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Affectation des types d\'envelope pour la corbeille :\r\n                        {{adminTrayCtrl.trayEnvTypesAffectation.tray.label}}</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-6\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Types d\'envelope existant</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayEnvTypesAffectation.unaffectedEnvTypes\">\r\n                                        <li class=\"list-group-item list-group-item-warning\"\r\n                                            ng-repeat=\"docType in adminTrayCtrl.trayEnvTypesAffectation.unaffectedEnvTypes\">\r\n                                            {{docType.label}} ({{docType.code}}) <i\r\n                                                class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                        <li ng-show=\"!adminTrayCtrl.trayEnvTypesAffectation.unaffectedEnvTypes.length\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                        <div class=\"col-lg-6\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Types d\'envelope sur la corbeille</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayEnvTypesAffectation.affectedEnvTypes\">\r\n                                        <li class=\"list-group-item list-group-item-success\"\r\n                                            ng-repeat=\"docType in adminTrayCtrl.trayEnvTypesAffectation.affectedEnvTypes\">\r\n                                            {{docType.label}} ({{docType.code}}) <i\r\n                                                class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                        <li ng-show=\"!adminTrayCtrl.trayEnvTypesAffectation.affectedEnvTypes.length\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                    </div>\r\n                    <!-- /.row -->\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.validateTrayEnvTypes()\">\r\n                        Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal role affectation -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinRoleAffectation\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> Affectation des\r\n                        rôles sur la corbeille : {{adminTrayCtrl.trayRolesAffectation.tray.label}}\r\n                    </h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-6\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Liste de rôles Existants</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayRolesAffectation.unaffectedRoles\">\r\n                                        <li class=\"list-group-item list-group-item-warning\"\r\n                                            ng-repeat=\"role in adminTrayCtrl.trayRolesAffectation.unaffectedRoles\">\r\n                                            {{role.label}}<i class=\"fa fa-hand-paper-o pull-right\"\r\n                                                             aria-hidden=\"true\"></i></li>\r\n                                        <li ng-show=\"adminTrayCtrl.trayRolesAffectation.unaffectedRoles.length==0\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                        <div class=\"col-lg-6\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Liste de rôles sur la corbeille</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayRolesAffectation.affectedRoles\">\r\n                                        <li class=\"list-group-item list-group-item-success\"\r\n                                            ng-repeat=\"role in adminTrayCtrl.trayRolesAffectation.affectedRoles\">\r\n                                            {{role.label}} <i class=\"fa fa-hand-paper-o pull-right\"\r\n                                                              aria-hidden=\"true\"></i></li>\r\n                                        <li ng-show=\"adminTrayCtrl.trayRolesAffectation.affectedRoles.length==0\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-5 -->\r\n                    </div>\r\n                    <!-- /.row -->\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.validateTrayRoles()\">Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal indexes affectation -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinIndexAffectation\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog modal-lg\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Affectation des indexes pour la corbeille :\r\n                        {{adminTrayCtrl.trayIndexesAffectation.tray.label}}</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-6\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Liste d\'indexs Existants</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayIndexesAffectation.unaffectedIndexes\">\r\n                                        <li class=\"list-group-item list-group-item-warning\"\r\n                                            ng-repeat=\"index in adminTrayCtrl.trayIndexesAffectation.unaffectedIndexes\">\r\n                                            {{index.label}}<i class=\"fa fa-hand-paper-o pull-right\"\r\n                                                              aria-hidden=\"true\"></i></li>\r\n                                        <li ng-show=\"adminTrayCtrl.trayIndexesAffectation.unaffectedIndexes.length==0\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                        <div class=\"col-lg-6\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Liste d\'indexs sur corbeille</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayIndexesAffectation.affectedIndexes\">\r\n                                        <li class=\"list-group-item list-group-item-success\"\r\n                                            ng-repeat=\"index in adminTrayCtrl.trayIndexesAffectation.affectedIndexes\"\r\n                                            ng-click=\"adminTrayCtrl.openAffectedTrayIndexeEdition(index)\">\r\n                                            {{index.label}}<i class=\"fa fa-hand-paper-o pull-right\"\r\n                                                              aria-hidden=\"true\"></i>\r\n                                        </li>\r\n                                        <li ng-show=\"adminTrayCtrl.trayIndexesAffectation.affectedIndexes.length==0\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                    </div>\r\n                    <!-- /.row -->\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.validateTrayIndexes()\">\r\n                        Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal trayRejects affectation -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinRejectAffectation\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog modal-lg\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Affectation des rejets pour la corbeille :\r\n                        {{adminTrayCtrl.trayRejectsAffectation.tray.label}}</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-4\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Liste des rejets Existants</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayRejectsAffectation.unaffectedRejects\">\r\n                                        <li class=\"list-group-item list-group-item-warning\"\r\n                                            ng-repeat=\"rejectType in adminTrayCtrl.trayRejectsAffectation.unaffectedRejects\">\r\n                                            {{rejectType.label}} ({{rejectType.structuralEntityType.label}})<i\r\n                                                class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                                        <li ng-show=\"!adminTrayCtrl.trayRejectsAffectation.unaffectedRejects.length\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                        <div class=\"col-lg-8\">\r\n                            <div class=\"panel panel-primary\">\r\n                                <div class=\"panel-heading\">Liste des rejets sur corbeille</div>\r\n                                <div class=\"panel-body\">\r\n                                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\"\r\n                                        class=\"list-group connectedList ul-noStyle\"\r\n                                        ng-model=\"adminTrayCtrl.trayRejectsAffectation.affectedRejects\">\r\n                                        <li class=\"list-group-item list-group-item-success\"\r\n                                            ng-repeat=\"rejectType in adminTrayCtrl.trayRejectsAffectation.affectedRejects\">\r\n                                            <i class=\"fa fa-hand-paper-o pull-left\" aria-hidden=\"true\"></i>\r\n                                            {{rejectType.label}} ({{rejectType.structuralEntityType.label}})\r\n                                            <div class=\"form-group pull-right\">\r\n                                                <label for=\"desitinationList\">Destination :</label>\r\n                                                <select id=\"desitinationList\" class=\"form-controle\"\r\n                                                        ng-model=\"rejectType.trayDestinationId\" se\r\n                                                        ng-options=\"tray.id as tray.label for tray in adminTrayCtrl.trays\"></select>\r\n                                            </div>\r\n                                        </li>\r\n                                        <li ng-show=\"!adminTrayCtrl.trayRejectsAffectation.affectedRejects.length\">\r\n                                            &nbsp;\r\n                                        </li>\r\n                                    </ul>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.col-lg-6 -->\r\n                    </div>\r\n                    <!-- /.row -->\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.validateTrayRejects()\">\r\n                        Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"navbar navbar-default navbar-fixed-bottom\">\r\n        <div class=\"col-sm-offset-4 col-sm-4 text-center\">\r\n            <a class=\"btn btn-info fa fa-cube\" title=\"Corbeille par defaut\"\r\n               ng-click=\"adminTrayCtrl.openPopinDefaultTray = true\"></a>\r\n            <a class=\"btn btn-info fa fa-bars\" title=\"Ordre des corbeilles\"\r\n               ng-click=\"adminTrayCtrl.openTraysPriorityPoPin()\"></a>\r\n            <a class=\"btn btn-info fa fa-usb\" title=\"Workflow des corbeilles\"\r\n               ng-click=\"adminTrayCtrl.openPopinTraysWorkflow = true\"></a>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal to set default tray -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinDefaultTray\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Corbeille par défault</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n\r\n                    <ul class=\"list-group\">\r\n                        <li ng-class=\"{\'list-group-item list-group-item-success\':tray.isDefault, \'list-group-item\':!tray.isDefault}\"\r\n                            ng-click=\"adminTrayCtrl.changeDefaultTray(tray.id)\"\r\n                            ng-repeat=\"tray in adminTrayCtrl.trays | orderBy:\'label\'\">\r\n                            <h4 class=\"list-group-item-heading\">{{tray.label}}<i ng-if=\"tray.isDefault\"\r\n                                                                                 class=\"fa fa-check pull-right\"\r\n                                                                                 aria-hidden=\"true\"></i></h4>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.validateDefaultTray()\">\r\n                        Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal to set trays priority -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinTraysPriority\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Ordre des corbeilles</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <ul ui-sortable=\"adminTrayCtrl.sortableOptions\" class=\"list-group connectedList ul-noStyle\"\r\n                        ng-model=\"adminTrayCtrl.traysInOrder\">\r\n                        <li ng-class=\"tray.enabled ? \'list-group-item list-group-item-info\':\'list-group-item list-group-item-warning\'\"\r\n                            ng-repeat=\"tray in adminTrayCtrl.traysInOrder\">{{tray.label}}<i\r\n                                class=\"fa fa-hand-paper-o pull-right\" aria-hidden=\"true\"></i></li>\r\n                    </ul>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.validateTraysPriority()\">\r\n                        Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal to set trays workflow -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openPopinTraysWorkflow\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Workflow des corbeille</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    working on\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\">Valider</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal to set tray indexe -->\r\n    <div modal-show modal-visible=\"adminTrayCtrl.openAffectedTrayIndexeEdit\" class=\"modal fade\" data-keyboard=\"false\"\r\n         data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Edition de l\'index {{adminTrayCtrl.trayIndexEdit.label}} sur cet\r\n                        corbeille</h4>\r\n                </div>\r\n                <form role=\"form_create\" class=\"form-horizontal\">\r\n                    <div class=\"modal-body\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"enable\" class=\"col-sm-2 control-label\">Activé :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"checkbox\" ng-model=\"adminTrayCtrl.trayIndexEdit.enable\"\r\n                                       class=\"form-control\" id=\"enable\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"required\" class=\"col-sm-2 control-label\">Obligatoire :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"checkbox\" ng-model=\"adminTrayCtrl.trayIndexEdit.required\"\r\n                                       class=\"form-control\" id=\"required\" required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"required\" class=\"col-sm-2 control-label\">Règle de corbeille :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <input type=\"text\" ng-model=\"adminTrayCtrl.trayIndexEdit.trayIndexRegex\"\r\n                                       class=\"form-control\" id=\"trayIndexRegex\" placeholder=\"Exemple: ^[a-zA-Z]*$\"\r\n                                       required>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"alert alert-danger\" role=\"alert\"\r\n                             ng-show=\"!adminTrayCtrl.checkRegexValidity(adminTrayCtrl.trayIndexEdit.trayIndexRegex)\">\r\n                            <p> Règle Invalide </p>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"required\" class=\"col-sm-2 control-label\">Catégorie :</label>\r\n                            <div class=\"col-sm-10\">\r\n                                <select class=\"form-control\" ng-model=\"adminTrayCtrl.trayIndexEdit.idCategory\">\r\n                                    <option ng-repeat=\"category in adminTrayCtrl.categories\"\r\n                                            ng-selected=\"(category.id == adminTrayCtrl.trayIndexEdit.idCategory)\"\r\n                                            value=\"{{category.id}}\">\r\n                                        {{category.label}}\r\n                                    </option>\r\n                                </select>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!-- ./panel-body -->\r\n                    <div class=\"panel-footer text-right\">\r\n                        <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\"\r\n                                ng-click=\"adminTrayCtrl.trayIndexEdit = undefined;\">Annuler\r\n                        </button>\r\n                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminTrayCtrl.editTrayIndex()\"\r\n                                ng-disabled=\"!adminTrayCtrl.checkRegexValidity(adminTrayCtrl.trayIndexEdit.trayIndexRegex)\">\r\n                            valider\r\n                        </button>\r\n                    </div>\r\n                    <!-- ./panel-footer -->\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- /#page-wrapper -->\r\n");
$templateCache.put("components/administration/users-roles/admin-users.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> Gestion des utilisateurs / rôles</h2>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <uib-tabset active=\"active\">\r\n        <uib-tab index=\"0\" select=\"adminUsersCtrl.loadAllUsers()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-users\" aria-hidden=\"true\"></i> Utilisateurs\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\" ng-show=\"adminUsersCtrl.users.length\">\r\n                    <div class=\"input-group\">\r\n                        <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\"\r\n                                                                             aria-hidden=\"true\"></i></span>\r\n                        <input type=\"text\" ng-model=\"searchUser\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                               aria-describedby=\"basic-addon1\">\r\n                        <span class=\"input-group-btn\"> <button class=\"btn btn-success\" type=\"button\"\r\n                                                               ng-click=\"adminUsersCtrl.openPopinAdd = true\"\r\n                                                               id=\"basic-addon1\"><i class=\"fa fa-plus-circle\"\r\n                                                                                    aria-hidden=\"true\"></i> AJOUTER</button></span>\r\n                    </div>\r\n                    <!-- /.input-group -->\r\n                    <br/>\r\n                    <table class=\"table table-bordered table-striped table-hover\">\r\n                        <thead>\r\n                        <tr class=\"warning\">\r\n                            <th>Civilité</th>\r\n                            <th>Nom</th>\r\n                            <th>Prénom</th>\r\n                            <th>Login</th>\r\n                            <th>Statut</th>\r\n                            <th>Téléphone</th>\r\n                            <th>Email</th>\r\n                            <th class=\"text-center\">Date de création</th>\r\n                            <th class=\"text-center\">Dernière modification</th>\r\n                            <th class=\"text-center\">Action</th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"user in adminUsersCtrl.users | filter : searchUser | limitTo : adminUsersCtrl.itemsPerPage : (adminUsersCtrl.currentPage-1)*adminUsersCtrl.itemsPerPage\">\r\n                            <td>{{user.honorific}}</td>\r\n                            <td>{{user.lastName}}</td>\r\n                            <td>{{user.firstName}}</td>\r\n                            <td>{{user.login}}</td>\r\n                            <td>{{user.enabled}}</td>\r\n                            <td>{{user.phone}}</td>\r\n                            <td>{{user.email}}</td>\r\n                            <td class=\"text-center\">{{user.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">{{user.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                            <td class=\"text-center\">\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\"\r\n                                        title=\"Modifier\" ng-click=\"adminUsersCtrl.prepareUpdateUser(user)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\"\r\n                                        ng-click=\"adminUsersCtrl.prepareDeleteUser(user)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-warning fa fa-key\"\r\n                                        title=\"Réinitiliser le mot de passe\"\r\n                                        ng-click=\"adminUsersCtrl.prepareGenerateNewPassword(user)\"></button>\r\n                                <button type=\"submit\" class=\"btn btn-sm btn-primary fa fa-link\" title=\"Gérer les rôles\"\r\n                                        ng-click=\"adminUsersCtrl.openUserRolesAffectation(user)\"></button>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <!-- /.table -->\r\n                    <div class=\"main-pagination\" ng-show=\"adminUsersCtrl.users && adminUsersCtrl.users.length\">\r\n                        <uib-pagination total-items=\"adminUsersCtrl.users.length\" ng-model=\"adminUsersCtrl.currentPage\"\r\n                                        max-size=\"adminUsersCtrl.maxSize\"\r\n                                        class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                        previous-text=\"Précédent\"\r\n                                        next-text=\"Suivant\" items-per-page=\"adminUsersCtrl.itemsPerPage\">\r\n                        </uib-pagination>\r\n                    </div>\r\n                    <!-- /.main-pagination -->\r\n                </div>\r\n                <!-- /.col-lg-12 -->\r\n            </div>\r\n            <!-- /.row -->\r\n\r\n            <!-- Modal to update an user -->\r\n            <div modal-show modal-visible=\"adminUsersCtrl.openPopinAdd\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter un\r\n                                utilisateur</h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"civility\" class=\"col-sm-3 control-label\">Civilité :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <select ng-model=\"adminUsersCtrl.userAdd.honorific\"\r\n                                                ng-options=\"label for label in [\'M\',\'Mme\',\'Mlle\']\" class=\"form-control\"\r\n                                                id=\"civility\" required></select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"lastName\" class=\"col-sm-3 control-label\">Nom :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userAdd.lastName\"\r\n                                               class=\"form-control\" id=\"lastName\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"firstName\" class=\"col-sm-3 control-label\">Prénom :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userAdd.firstName\"\r\n                                               class=\"form-control\" id=\"firstName\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"phoneNumber\" class=\"col-sm-3 control-label\">Téléphone :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userAdd.phone\" class=\"form-control\"\r\n                                               id=\"phoneNumber\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"email\" class=\"col-sm-3 control-label\">E-mail :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userAdd.email\" class=\"form-control\"\r\n                                               id=\"email\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"login\" class=\"col-sm-3 control-label\">Login :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userAdd.login\" class=\"form-control\"\r\n                                               id=\"login\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"active\" class=\"col-sm-3 control-label\">Active :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input id=\"active\" ng-model=\"adminUsersCtrl.userAdd.enabled\" type=\"checkbox\">\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminUsersCtrl.isUserFilled(adminUsersCtrl.userAdd)\"\r\n                                        ng-click=\"adminUsersCtrl.createUser()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update an user -->\r\n            <div modal-show modal-visible=\"adminUsersCtrl.openPopinEdit\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier utilisateur\r\n                            </h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"civility\" class=\"col-sm-3 control-label\">Civilité :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <select ng-model=\"adminUsersCtrl.userEdit.honorific\"\r\n                                                ng-options=\"label for label in [\'M\',\'Mme\',\'Mlle\']\" class=\"form-control\"\r\n                                                id=\"civility\" required></select>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"lastName\" class=\"col-sm-3 control-label\">Nom :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userEdit.lastName\"\r\n                                               class=\"form-control\" id=\"lastName\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"firstName\" class=\"col-sm-3 control-label\">Prénom :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userEdit.firstName\"\r\n                                               class=\"form-control\" id=\"firstName\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"phoneNumber\" class=\"col-sm-3 control-label\">Téléphone :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userEdit.phone\" class=\"form-control\"\r\n                                               id=\"phoneNumber\">\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"email\" class=\"col-sm-3 control-label\">E-mail :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userEdit.email\" class=\"form-control\"\r\n                                               id=\"email\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"login\" class=\"col-sm-3 control-label\">Login :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.userEdit.login\" class=\"form-control\"\r\n                                               id=\"login\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"active\" class=\"col-sm-3 control-label\">Active :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input id=\"active\" ng-model=\"adminUsersCtrl.userEdit.enabled\" type=\"checkbox\">\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminUsersCtrl.isUserFilled(adminUsersCtrl.userEdit)\"\r\n                                        ng-click=\"adminUsersCtrl.updateUser()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to delete an user -->\r\n            <div modal-show modal-visible=\"adminUsersCtrl.openPopinConfirm\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer définitivement l\'utilisateur : <strong>{{adminUsersCtrl.userEdit.civility}}\r\n                                {{adminUsersCtrl.userEdit.firstName}} {{adminUsersCtrl.userEdit.lastName}}</strong></p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\" ng-click=\"adminUsersCtrl.confirmDeleteUser()\">\r\n                                Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal role affectation -->\r\n            <div modal-show modal-visible=\"adminUsersCtrl.openPopinRoleAffectation\" class=\"modal fade\"\r\n                 data-keyboard=\"false\" data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> Affectation\r\n                                des rôles pour {{adminUsersCtrl.userRolesAffectation.user.civility}}.\r\n                                {{adminUsersCtrl.userRolesAffectation.user.lastName}}\r\n                                {{adminUsersCtrl.userRolesAffectation.user.firstName}}</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col-lg-6\">\r\n                                    <div class=\"panel panel-primary\">\r\n                                        <div class=\"panel-heading\">Liste de rôles Existants</div>\r\n                                        <div class=\"panel-body\">\r\n                                            <ul ui-sortable=\"adminUsersCtrl.sortableOptions\"\r\n                                                class=\"list-group connectedList ul-noStyle\"\r\n                                                ng-model=\"adminUsersCtrl.userRolesAffectation.unaffectedRoles\">\r\n                                                <li class=\"list-group-item list-group-item-warning\"\r\n                                                    ng-repeat=\"role in adminUsersCtrl.userRolesAffectation.unaffectedRoles\">\r\n                                                    {{role.label}}<i class=\"fa fa-hand-paper-o pull-right\"\r\n                                                                     aria-hidden=\"true\"></i></li>\r\n                                                <li ng-show=\"adminUsersCtrl.userRolesAffectation.unaffectedRoles.length==0\">\r\n                                                    &nbsp;\r\n                                                </li>\r\n                                            </ul>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                                <!-- /.col-lg-6 -->\r\n                                <div class=\"col-lg-6\">\r\n                                    <div class=\"panel panel-primary\">\r\n                                        <div class=\"panel-heading\">Liste de rôles de l\'utilisateur</div>\r\n                                        <div class=\"panel-body\">\r\n                                            <ul ui-sortable=\"adminUsersCtrl.sortableOptions\"\r\n                                                class=\"list-group connectedList ul-noStyle\"\r\n                                                ng-model=\"adminUsersCtrl.userRolesAffectation.affectedRoles\">\r\n                                                <li class=\"list-group-item list-group-item-success\"\r\n                                                    ng-repeat=\"role in adminUsersCtrl.userRolesAffectation.affectedRoles\">\r\n                                                    {{role.label}} <i class=\"fa fa-hand-paper-o pull-right\"\r\n                                                                      aria-hidden=\"true\"></i></li>\r\n                                                <li ng-show=\"adminUsersCtrl.userRolesAffectation.affectedRoles.length==0\">\r\n                                                    &nbsp;\r\n                                                </li>\r\n                                            </ul>\r\n                                        </div>\r\n                                    </div>\r\n                                    <!--/.col-lg-6-->\r\n                                </div>\r\n                                <!-- /.col-lg-6 -->\r\n                            </div>\r\n                            <!-- /.row -->\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"button\" class=\"btn btn-success\" ng-click=\"adminUsersCtrl.validateUserRoles()\">\r\n                                Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to Generate an user -->\r\n            <div modal-show modal-visible=\"adminUsersCtrl.openPopinConfirmGeneratePassword\" class=\"modal fade\"\r\n                 data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir réinitialiser le mot de passe de l\'utilisateur : <strong>{{adminUsersCtrl.userEdit.civility}}\r\n                                {{adminUsersCtrl.userEdit.firstName}} {{adminUsersCtrl.userEdit.lastName}}</strong></p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                            <button type=\"submit\" class=\"btn btn-success\"\r\n                                    ng-click=\"adminUsersCtrl.confirmGenerateNewPassword()\">Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n        <uib-tab index=\"1\" select=\"adminUsersCtrl.loadAllRoles()\">\r\n            <uib-tab-heading>\r\n                <i class=\"fa fa-suitcase\" aria-hidden=\"true\"></i> Rôle\r\n            </uib-tab-heading>\r\n            <br/>\r\n            <div class=\"input-group\">\r\n                <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></span>\r\n                <input type=\"text\" ng-model=\"searchRole\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                       aria-describedby=\"basic-addon1\">\r\n                <span class=\"input-group-btn\"><button class=\"btn btn-success\" type=\"button\"\r\n                                                      ng-click=\"adminUsersCtrl.openPopinRoleAdd = true\"\r\n                                                      id=\"basic-addon1\"><i class=\"fa fa-plus-circle\"\r\n                                                                           aria-hidden=\"true\"></i> AJOUTER</button></span>\r\n            </div>\r\n            <!-- /.input-group -->\r\n            <br/>\r\n            <table class=\"table table-bordered table-striped table-hover\">\r\n                <thead>\r\n                <tr class=\"warning\">\r\n                    <th>Label</th>\r\n                    <th>Code</th>\r\n                    <th class=\"text-center\">Date de création</th>\r\n                    <th class=\"text-center\">Dernière modification</th>\r\n                    <th class=\"text-center\">Action</th>\r\n                </tr>\r\n                </thead>\r\n                <tbody>\r\n                <tr ng-repeat=\"role in adminUsersCtrl.roles | filter : searchRole | limitTo : adminUsersCtrl.itemsPerPage : (adminUsersCtrl.currentPage-1)*adminUsersCtrl.itemsPerPage\">\r\n                    <td>{{role.label}}</td>\r\n                    <td>{{role.code}}</td>\r\n                    <td class=\"text-center\">{{role.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                    <td class=\"text-center\">{{role.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                    <td class=\"text-center\">\r\n                        <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\" title=\"Modifier\"\r\n                                ng-click=\"adminUsersCtrl.prepareUpdateRole(role)\"></button>\r\n                        <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\"\r\n                                ng-click=\"adminUsersCtrl.prepareDeleteRole(role)\"></button>\r\n                    </td>\r\n                </tr>\r\n                </tbody>\r\n            </table>\r\n            <!-- /.table -->\r\n            <div class=\"main-pagination\" ng-show=\"adminUsersCtrl.roles && adminUsersCtrl.roles.length\">\r\n                <uib-pagination total-items=\"adminUsersCtrl.roles.length\" ng-model=\"adminUsersCtrl.currentPage\"\r\n                                max-size=\"adminUsersCtrl.maxSize\"\r\n                                class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                previous-text=\"Précédent\" next-text=\"Suivant\"\r\n                                items-per-page=\"adminUsersCtrl.itemsPerPage\">\r\n                </uib-pagination>\r\n            </div>\r\n            <!-- /.main-pagination -->\r\n\r\n            <!-- Modal to create a role -->\r\n            <div modal-show modal-visible=\"adminUsersCtrl.openPopinRoleAdd\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Ajouter un rôle</h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-3 control-label\">Libellé :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.roleAdd.label\" class=\"form-control\"\r\n                                               id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"code\" class=\"col-sm-3 control-label\">Code :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.roleAdd.code\" class=\"form-control\"\r\n                                               id=\"code\" required>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminUsersCtrl.isRoleFilled(adminUsersCtrl.roleAdd)\"\r\n                                        ng-click=\"adminUsersCtrl.createRole()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to update a role -->\r\n            <div modal-show modal-visible=\"adminUsersCtrl.openPopinRoleEdit\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier un rôle\r\n                            </h4>\r\n                        </div>\r\n                        <form role=\"form_update\" class=\"form-horizontal\">\r\n                            <div class=\"modal-body\">\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"label\" class=\"col-sm-3 control-label\">Libellé :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.roleEdit.label\" class=\"form-control\"\r\n                                               id=\"label\" required>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group\">\r\n                                    <label for=\"code\" class=\"col-sm-3 control-label\">Code :</label>\r\n                                    <div class=\"col-sm-9\">\r\n                                        <input type=\"text\" ng-model=\"adminUsersCtrl.roleEdit.code\" class=\"form-control\"\r\n                                               id=\"code\" required>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"modal-footer\">\r\n                                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                                <button type=\"submit\" class=\"btn btn-success\"\r\n                                        ng-disabled=\"!adminUsersCtrl.isRoleFilled(adminUsersCtrl.roleEdit)\"\r\n                                        ng-click=\"adminUsersCtrl.updateRole()\">Valider\r\n                                </button>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Modal to delete a role -->\r\n            <div modal-show modal-visible=\"adminUsersCtrl.openPopinRoleConfirm\" class=\"modal fade\" data-keyboard=\"false\"\r\n                 data-backdrop=\"static\">\r\n                <div class=\"modal-dialog\">\r\n                    <!-- Modal content-->\r\n                    <div class=\"modal-content\">\r\n                        <div class=\"modal-header\">\r\n                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                            <h4 class=\"modal-title\">Confirmation</h4>\r\n                        </div>\r\n                        <div class=\"modal-body\">\r\n                            <p>Êtes-vous sûr de vouloir supprimer ce rôle :\r\n                                <strong>{{adminUsersCtrl.roleEdit.label}}</strong></p>\r\n                        </div>\r\n                        <div class=\"modal-footer\">\r\n                            <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"adminUsersCtrl.roleEdit=undefined\"\r\n                                    data-dismiss=\"modal\">Annuler\r\n                            </button>\r\n                            <button type=\"submit\" class=\"btn btn-success\" ng-click=\"adminUsersCtrl.confirmDeleteRole()\">\r\n                                Valider\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </uib-tab>\r\n    </uib-tabset>\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/control-image/reject/base-template.html","<div id=\"page-wrapper\">\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-12\">\r\n                <ol class=\"breadcrumb breadcrumb-custom\">\r\n                    <li>\r\n                        <i class=\"fa fa-cubes \"></i><a href=\"#/home\"> Corbeilles de traitements</a>\r\n                    </li>\r\n                    <li class=\"active\">\r\n                        <i class=\"fa fa-cube\"></i> Rejets - Contrôle Image\r\n                    </li>\r\n                </ol>\r\n            </div>\r\n            <!-- /.col-lg-12 -->\r\n        </div>\r\n        <!-- /.row -->\r\n    \r\n        <div class=\"row\">\r\n    \r\n            <div class=\"col-lg-8\" ng-show=\"!rejectBaseCtrl.batchs\">\r\n                <div class=\"panel panel-danger\">\r\n                    <div class=\"panel-body\">\r\n                        <span>Pas de batch dans la corbeille</span>\r\n                    </div>\r\n                    <!-- /.panel-body -->\r\n                </div>\r\n                <!-- /.panel -->\r\n            </div>\r\n            <!-- /.col-lg-8 -->\r\n    \r\n            <div class=\"col-lg-8\" ng-show=\"rejectBaseCtrl.batchs\">\r\n                <table class=\"table table-bordered table-striped table-hover\">\r\n                    <thead>\r\n                        <tr class=\"warning\">\r\n                            <th>\r\n                                <a ng-click=\"rejectBaseCtrl.search.sortType = \'idEnvelope\'; rejectBaseCtrl.search.sortReverse = !rejectBaseCtrl.search.sortReverse ; rejectBaseCtrl.loadBatchs()\">\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'idLot\' && !rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'idLot\' && rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                    Lot\r\n                                </a>\r\n                            </th>\r\n                            <th>\r\n                                <a ng-click=\"rejectBaseCtrl.search.sortType = \'batch.batNumber\'; rejectBaseCtrl.search.sortReverse = !rejectBaseCtrl.search.sortReverse; rejectBaseCtrl.loadBatchs()\">\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'canal\' && !rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'canal\' && rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                    Canal\r\n                                </a>\r\n                            </th>\r\n                            <th>\r\n                                <a ng-click=\"rejectBaseCtrl.search.sortType = \'envComment\'; rejectBaseCtrl.search.sortReverse = !rejectBaseCtrl.search.sortReverse; rejectBaseCtrl.loadBatchs()\">\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'job\' && !rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'job\' && rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                    Job\r\n                                </a>\r\n                            </th>\r\n                            <th>\r\n                                <a ng-click=\"rejectBaseCtrl.search.sortType = \'createDate\'; rejectBaseCtrl.search.sortReverse = !rejectBaseCtrl.search.sortReverse; rejectBaseCtrl.loadBatchs()\">\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'nbPlis\' && !rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'nbPlis\' && rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                    Nombre de plis\r\n                                </a>\r\n                            </th>\r\n                            <th>\r\n                                <a ng-click=\"rejectBaseCtrl.search.sortType = \'motif\'; rejectBaseCtrl.search.sortReverse = !rejectBaseCtrl.search.sortReverse; rejectBaseCtrl.loadBatchs()\">\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'motif\' && !rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'motif\' && rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                    Motif\r\n                                </a>\r\n                            </th>\r\n                            <th>\r\n                                <a ng-click=\"rejectBaseCtrl.search.sortType = \'createDate\'; rejectBaseCtrl.search.sortReverse = !rejectBaseCtrl.search.sortReverse; rejectBaseCtrl.loadBatchs()\">\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'integrationDate\' && !rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                    <span ng-show=\"rejectBaseCtrl.search.sortType == \'integrationDate\' && rejectBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                    Date d\'intégration\r\n                                </a>\r\n                            </th>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <tr ng-repeat=\"batch in rejectBaseCtrl.batchs\">\r\n                            <td ng-click=\"rejectBaseCtrl.open(batch.id)\">{{batch.batchName}}</span></td>\r\n                            <td ng-click=\"rejectBaseCtrl.open(batch.id)\">{{}}</td>\r\n                            <td ng-click=\"rejectBaseCtrl.open(batch.id)\">{{}}</td>\r\n                            <td ng-click=\"rejectBaseCtrl.open(batch.id)\">{{batch.pliNumber}}</td>\r\n                            <td ng-click=\"rejectBaseCtrl.open(batch.id)\">{{batch.principalMotifReject}}</td>\r\n                            <td ng-click=\"rejectBaseCtrl.open(batch.id)\">{{batch.integrationDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n                <div class=\"main-pagination\" ng-show=\"rejectBaseCtrl.numberBatch\">\r\n                    <uib-pagination total-items=\"rejectBaseCtrl.numberBatch\" ng-model=\"rejectBaseCtrl.search.currentPage\" max-size=\"25\"\r\n                        class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\" previous-text=\"Précédent\" next-text=\"Suivant\"\r\n                        items-per-page=\"rejectBaseCtrl.search.itemsPerPage\" ng-click=\"rejectBaseCtrl.loadBatchs()\">\r\n                    </uib-pagination>\r\n                </div>\r\n            </div>  \r\n            <!-- /.col-lg-8 -->\r\n    \r\n            <div class=\"col-lg-4\">\r\n                <div class=\"panel panel-danger\">\r\n                    <div class=\"panel-heading\">\r\n                        <i class=\"fa fa-info-circle\"></i> Informations\r\n                    </div>\r\n                    <!-- /.panel-heading -->\r\n                    <div class=\"panel-body\">\r\n                        <span>Rejets - Contrôle image</span>\r\n                    </div>\r\n                    <!-- /.panel-body -->\r\n                </div>\r\n                <!-- /.panel -->\r\n    \r\n                <div class=\"panel panel-success\">\r\n                    <div class=\"panel-heading\">\r\n                        <i class=\"fa fa fa-search\"></i> Recherche\r\n                    </div>\r\n                    <!-- /.panel-heading -->\r\n                    <form name=\"form\" class=\"form-horizontal\">\r\n                        <div class=\"panel-body\">\r\n                            <div class=\"form-group\">\r\n                                <label for=\"batchId\" class=\"col-sm-4 control-label\">Lot :</label>\r\n                                <div class=\"col-sm-8\">\r\n                                    <input type=\"text\" ng-model=\"rejectBaseCtrl.search.batchId\" class=\"form-control\" id=\"batchId\" placeholder=\"chercher lot\">\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"form-group\">\r\n                                <label for=\"startDate\" class=\"col-sm-4 control-label\">Date de début :</label>\r\n                                <div class=\"col-sm-8\">\r\n                                    <input type=\"date\" ng-model=\"rejectBaseCtrl.search.startDate\" class=\"form-control\" id=\"startDate\">\r\n                                </div>\r\n                            </div>\r\n    \r\n                            <div class=\"form-group\">\r\n                                <label for=\"endDate\" class=\"col-sm-4 control-label\">Date de fin :</label>\r\n                                <div class=\"col-sm-8\">\r\n                                    <input type=\"date\" ng-model=\"rejectBaseCtrl.search.endDate\" class=\"form-control\" id=\"endDate\">\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"form-group\">\r\n                                <label for=\"items\" class=\"col-sm-4 control-label\">Afficher :</label>\r\n                                <div class=\"col-sm-8\">\r\n                                    <select type=\"text\" ng-model=\"rejectBaseCtrl.search.itemsPerPage\" id=\"itemPage\" class=\"form-control\">\r\n                                        <option value=\"\" disabled selected>Affichage par page</option>\r\n                                        <option value=\"10\">10</option>\r\n                                        <option value=\"20\">20</option>\r\n                                        <option value=\"50\">50</option>\r\n                                        <option value=\"100\">100</option>\r\n                                     </select>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"alert alert-danger\" ng-show=\"!rejectBaseCtrl.search || rejectBaseCtrl.search.startDate > rejectBaseCtrl.search.endDate\">\r\n                                <strong>Attention !</strong> La date de fin ne peut pas être inférieure à la date de début.\r\n                            </div>\r\n                        </div>\r\n                        <!-- /.panel-body -->\r\n                        <div class=\"panel-footer text-right\">\r\n                            <button id=\"initDate\" type=\"button\" class=\"btn btn-danger\" ng-click=\"rejectBaseCtrl.initSearch()\">Réinitialiser</button>\r\n                            <button id=\"searchDate\" type=\"button\" class=\"btn btn-success\" \r\n                                ng-disabled=\"!rejectBaseCtrl.search || rejectBaseCtrl.search.startDate > rejectBaseCtrl.search.endDate\"\r\n                                ng-click=\"rejectBaseCtrl.search && rejectBaseCtrl.loadBatchs()\">Rechercher</button>\r\n    \r\n                        </div>\r\n                        <!-- /.panel-footer -->\r\n                    </form>\r\n                </div>\r\n                <!-- /.panel -->\r\n            </div>\r\n            <!-- /.col-lg-4 -->\r\n    \r\n        </div>\r\n        <!-- /.row -->\r\n    </div>\r\n    <!-- /#page-wrapper -->");
$templateCache.put("components/control-image/reject/detail-template.html","<script type=\"text/ng-template\" id=\"nodes_renderer.html\">\r\n    <div ui-tree-handle class=\"tree-node tree-node-content tree-handle\">\r\n        <i class=\"fa fa-inbox\" data-ng-show=\"node.elementType===0\" title=\"Lot\"></i>\r\n        <i class=\"fa fa-envelope-o\" data-ng-show=\"node.elementType===1\" title=\"Pli\"></i>\r\n        <i class=\"fa fa-file-o\" data-ng-show=\"node.elementType===2\" title=\"Document\"></i>\r\n        <i class=\"fa fa-file-image-o\" data-ng-show=\"node.elementType===3\" title=\"Page\"></i>\r\n        <span ng-class=\"{\'text-danger\':node.deleted}\">{{node.label}}</span>\r\n    </div>\r\n    <ol ui-tree-nodes=\"\" ng-model=\"node.nodes\" ng-class=\"{hidden: collapsed}\">\r\n        <li ng-repeat=\"node in node.nodes\" ng-if=\"!node.deleted && !node.hidden\" ui-tree-node ng-include=\"\'nodes_renderer.html\'\">\r\n        </li>\r\n    </ol>\r\n</script>\r\n<div id=\"page-wrapper\" class=\"mousetrap\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <!--<h2 class=\"page-header\"><i class=\"fa fa-envelope-o\"></i> Enveloppe : {{envelopeDetailCtrl.envelopeObject.label}}</h2>-->\r\n            <ol class=\"breadcrumb breadcrumb-custom\">\r\n                <li>\r\n                    <i class=\"fa fa-cubes \"></i>Corbeilles de traitements\r\n                </li>\r\n                <li><a href=\"#/control-image/reject/{{rejectDetailCtrl.trayId}}\">Rejets - Contrôle image</a></li>\r\n                <li class=\"active\">\r\n                    <i class=\"fa fa-envelope-o\"></i> {{rejectDetailCtrl.batchId}}\r\n                </li>\r\n            </ol>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n    <div class=\"row\">\r\n    \r\n        <div class=\"col-lg-6 col-md-6 padding-right-10\">\r\n            <div class=\"col-lg-12 row\">\r\n                <div class=\"text-center\">\r\n                    <p>\r\n                        <button class=\"btn btn-info\" ng-click=\"rejectDetailCtrl.reset()\"><i class=\"fa fa-file-o\"></i></button>\r\n                        <button class=\"btn btn-danger\" ng-click=\"rejectDetailCtrl.rotate(\'left\')\"><i class=\"fa fa-rotate-left\"></i></button>\r\n                        <button class=\"btn btn-danger\" ng-click=\"rejectDetailCtrl.rotate(\'right\')\"><i class=\"fa fa-rotate-right\"></i></button>\r\n                        <button class=\"btn btn-success\" ng-click=\"rejectDetailCtrl.zoom(-1)\"><i class=\"fa fa-search-minus\"></i></button>\r\n                        <button class=\"btn btn-success\" ng-click=\"rejectDetailCtrl.zoom(1)\"><i class=\"fa fa-search-plus\"></i></button>\r\n                        <button class=\"btn btn-warning\" ng-click=\"rejectDetailCtrl.first()\"><i class=\"fa fa-step-backward\"></i></button>\r\n                        <button class=\"btn btn-info\" ng-click=\"rejectDetailCtrl.prev()\"><i class=\"fa fa-fast-backward\"></i></button>\r\n                        <button class=\"btn btn-info\" ng-click=\"rejectDetailCtrl.next()\"><i class=\"fa fa-fast-forward\"></i></button>\r\n                        <button class=\"btn btn-warning\" ng-click=\"rejectDetailCtrl.last()\"><i class=\"fa fa-step-forward\"></i></button>\r\n                        <button class=\"btn btn-danger\" ng-click=\"rejectDetailCtrl.remove()\"><i class=\"fa fa-trash\"></i></button>\r\n                    </p>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"panel panel-viewer\">\r\n                        <canvas-viewer src=\"fileInput\" overlays=\"overlaysCanvasViewer\" options=\"optionsCanvasViewer\"></canvas-viewer>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-lg-7 -->\r\n\r\n        <div class=\"col-lg-6 col-md-6\">\r\n            <div class=\"row\">\r\n                <div>\r\n                    <div class=\"panel panel-controls panel-warning\">\r\n                        <div class=\"panel-heading\">Arborescence lot</div>\r\n                        <div class=\"panel-body\" style=\"height: 500px;overflow-y : scroll;\">\r\n                            <div ui-tree=\"treeOptions\" id=\"tree-root\">\r\n                                <ol ui-tree-nodes ng-model=\"treeData\">\r\n                                    <li ng-repeat=\"node in treeData\" ui-tree-node ng-include=\"\'nodes_renderer.html\'\"></li>\r\n                                </ol>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-6 col-md-6\">\r\n                    <div>\r\n                        <div class=\"panel panel-info\">\r\n                            <div class=\"panel-heading\">Actions lot</div>\r\n                            <div class=\"panel-body\">\r\n                                <button class=\"btn btn-default\" ng-click=\"rejectDetailCtrl.printBatch()\">Imprimer</button>\r\n                                <button class=\"btn btn-default\" ng-click=\"rejectDetailCtrl.openPopPinRejectBatch()\">Rejeter</button>\r\n                                <button class=\"btn btn-default\" ng-click=\"rejectDetailCtrl.deleteBatch()\">Supprimer</button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-lg-6 col-md-6\">\r\n                    <div class=\"panel panel-controls panel-warning\">\r\n                        <div class=\"panel-heading\">Informations</div>\r\n                        <div class=\"panel-body\">\r\n                            <ul class=\"list-group\">\r\n                                <li class=\"\">Lot : {{batchTree.name}}</li>\r\n                                <li class=\"\">Nombre de plis : {{batchTree.envelopes.length}}</li>\r\n                                <li class=\"\">Canal : n/a</li>\r\n                                <li class=\"\">Job : n/a</li>\r\n                                <li class=\"\">Date d\'intégration : {{batchTree.date |date:\'dd/MM/yyyy\'}}</li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n                <!-- /.panel-body -->\r\n        </div>\r\n            <!-- /.panel -->\r\n    </div>\r\n    \r\n        <!-- /.col-lg-5 -->\r\n</div>\r\n    <!-- /.row -->\r\n\r\n    <!-- Modal to reject lot -->\r\n    <div modal-show modal-visible=\"openPopPinRejectLot\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <h4 class=\"modal-title\"><i class=\"fa fa-trash-o\"></i> Rejeter le lot:</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <form role=\"form\" class=\"form-horizontal\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"select_reject\" class=\"col-sm-3 control-label\">Type de rejet:</label>\r\n                            <div class=\"col-sm-9\">\r\n                                <select id=\"select_reject\" class=\"form-control mousetrap\" ng-model=\"rejectId\" ng-options=\"rejectType.id as rejectType.label for rejectType in rejectTypesByBatch | orderBy:\'label\'\"></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"comment\" class=\"col-sm-3 control-label\">Commentaire :</label>\r\n                            <div class=\"col-sm-9\">\r\n                                <textarea ng-model=\"comment\" class=\"form-control\" id=\"comment\" placeholder=\"Pourquoi rejetez-vous ce lot ?\" maxlength=\"250\"></textarea>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button id=\"rejectTypeSubmit\" type=\"submit\" class=\"btn btn-success\" ng-click=\"rejectId && rejectDetailCtrl.rejectBatch(rejectId, comment)\"\r\n                        ng-disabled=\"!rejectId\">Rejeter</button>\r\n                    <button id=\"rejectTypeCancel\" type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/control-image/treatment/base-template.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <ol class=\"breadcrumb breadcrumb-custom\">\r\n                <li>\r\n                    <i class=\"fa fa-cubes \"></i><a href=\"#/home\"> Corbeilles de traitements</a>\r\n                </li>\r\n                <li class=\"active\">\r\n                    <i class=\"fa fa-cube\"></i> Contrôle Image\r\n                </li>\r\n            </ol>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n\r\n        <div class=\"col-lg-8\" ng-show=\"!treatmentBaseCtrl.batchs\">\r\n            <div class=\"panel panel-danger\">\r\n                <div class=\"panel-body\">\r\n                    <span>Pas de batch dans la corbeille</span>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-lg-8 -->\r\n\r\n        <div class=\"col-lg-8\" ng-show=\"treatmentBaseCtrl.batchs\">\r\n            <table class=\"table table-bordered table-striped table-hover\">\r\n                <thead>\r\n                    <tr class=\"warning\">\r\n                        <th>\r\n                            <a ng-click=\"treatmentBaseCtrl.search.sortType = \'idEnvelope\'; treatmentBaseCtrl.search.sortReverse = !treatmentBaseCtrl.search.sortReverse ; treatmentBaseCtrl.loadBatchs()\">\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'idLot\' && !treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'idLot\' && treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                Lot\r\n                            </a>\r\n                        </th>\r\n                        <th>\r\n                            <a ng-click=\"treatmentBaseCtrl.search.sortType = \'batch.batNumber\'; treatmentBaseCtrl.search.sortReverse = !treatmentBaseCtrl.search.sortReverse; treatmentBaseCtrl.loadBatchs()\">\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'canal\' && !treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'canal\' && treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                Canal\r\n                            </a>\r\n                        </th>\r\n                        <th>\r\n                            <a ng-click=\"treatmentBaseCtrl.search.sortType = \'envComment\'; treatmentBaseCtrl.search.sortReverse = !treatmentBaseCtrl.search.sortReverse; treatmentBaseCtrl.loadBatchs()\">\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'job\' && !treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'job\' && treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                Job\r\n                            </a>\r\n                        </th>\r\n                        <th>\r\n                            <a ng-click=\"treatmentBaseCtrl.search.sortType = \'createDate\'; treatmentBaseCtrl.search.sortReverse = !treatmentBaseCtrl.search.sortReverse; treatmentBaseCtrl.loadBatchs()\">\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'nbPlis\' && !treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'nbPlis\' && treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                Nombre de plis\r\n                            </a>\r\n                        </th>\r\n                        <th>\r\n                            <a ng-click=\"treatmentBaseCtrl.search.sortType = \'createDate\'; treatmentBaseCtrl.search.sortReverse = !treatmentBaseCtrl.search.sortReverse; treatmentBaseCtrl.loadBatchs()\">\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'integrationDate\' && !treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"treatmentBaseCtrl.search.sortType == \'integrationDate\' && treatmentBaseCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>\r\n                                Date d\'intégration\r\n                            </a>\r\n                        </th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr ng-repeat=\"batch in treatmentBaseCtrl.batchs\">\r\n                        <td ng-click=\"treatmentBaseCtrl.open(batch.id)\">{{batch.batchName}}</span></td>\r\n                        <td ng-click=\"treatmentBaseCtrl.open(batch.id)\">{{}}</td>\r\n                        <td ng-click=\"treatmentBaseCtrl.open(batch.id)\">{{}}</td>\r\n                        <td ng-click=\"treatmentBaseCtrl.open(batch.id)\">{{batch.pliNumber}}</td>\r\n                        <td ng-click=\"treatmentBaseCtrl.open(batch.id)\">{{batch.integrationDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n            <div class=\"main-pagination\" ng-show=\"treatmentBaseCtrl.numberBatch\">\r\n                <uib-pagination total-items=\"treatmentBaseCtrl.numberBatch\" ng-model=\"treatmentBaseCtrl.search.currentPage\" max-size=\"25\"\r\n                    class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\" previous-text=\"Précédent\" next-text=\"Suivant\"\r\n                    items-per-page=\"treatmentBaseCtrl.search.itemsPerPage\" ng-click=\"treatmentBaseCtrl.loadBatchs()\">\r\n                </uib-pagination>\r\n            </div>\r\n        </div>  \r\n        <!-- /.col-lg-8 -->\r\n\r\n        <div class=\"col-lg-4\">\r\n            <div class=\"panel panel-danger\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-info-circle\"></i> Informations\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <span>Corbeille de contrôle image</span>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n\r\n            <div class=\"panel panel-success\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa fa-search\"></i> Recherche\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <form name=\"form\" class=\"form-horizontal\">\r\n                    <div class=\"panel-body\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"batchId\" class=\"col-sm-4 control-label\">Lot :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"text\" ng-model=\"treatmentBaseCtrl.search.batchId\" class=\"form-control\" id=\"batchId\" placeholder=\"chercher lot\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"startDate\" class=\"col-sm-4 control-label\">Date de début :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"date\" ng-model=\"treatmentBaseCtrl.search.startDate\" class=\"form-control\" id=\"startDate\">\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"form-group\">\r\n                            <label for=\"endDate\" class=\"col-sm-4 control-label\">Date de fin :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"date\" ng-model=\"treatmentBaseCtrl.search.endDate\" class=\"form-control\" id=\"endDate\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"items\" class=\"col-sm-4 control-label\">Afficher :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <select type=\"text\" ng-model=\"treatmentBaseCtrl.search.itemsPerPage\" id=\"itemPage\" class=\"form-control\">\r\n                                    <option value=\"\" disabled selected>Affichage par page</option>\r\n                                    <option value=\"10\">10</option>\r\n                                    <option value=\"20\">20</option>\r\n                                    <option value=\"50\">50</option>\r\n                                    <option value=\"100\">100</option>\r\n                                 </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"alert alert-danger\" ng-show=\"!treatmentBaseCtrl.search || treatmentBaseCtrl.search.startDate > treatmentBaseCtrl.search.endDate\">\r\n                            <strong>Attention !</strong> La date de fin ne peut pas être inférieure à la date de début.\r\n                        </div>\r\n                    </div>\r\n                    <!-- /.panel-body -->\r\n                    <div class=\"panel-footer text-right\">\r\n                        <button id=\"initDate\" type=\"button\" class=\"btn btn-danger\" ng-click=\"treatmentBaseCtrl.initSearch()\">Réinitialiser</button>\r\n                        <button id=\"searchDate\" type=\"button\" class=\"btn btn-success\" \r\n                            ng-disabled=\"!treatmentBaseCtrl.search || treatmentBaseCtrl.search.startDate > treatmentBaseCtrl.search.endDate\"\r\n                            ng-click=\"treatmentBaseCtrl.search && treatmentBaseCtrl.loadBatchs()\">Rechercher</button>\r\n\r\n                    </div>\r\n                    <!-- /.panel-footer -->\r\n                </form>\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-lg-4 -->\r\n\r\n    </div>\r\n    <!-- /.row -->\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/control-image/treatment/detail-template.html","<script type=\"text/ng-template\" id=\"nodes_renderer.html\">\r\n    <div ui-tree-handle class=\"tree-node tree-node-content tree-handle\">\r\n        <i class=\"fa fa-inbox\" data-ng-show=\"node.elementType===0\" title=\"Lot\"></i>\r\n        <i class=\"fa fa-envelope-o\" data-ng-show=\"node.elementType===1\" title=\"Pli\"></i>\r\n        <i class=\"fa fa-file-o\" data-ng-show=\"node.elementType===2\" title=\"Document\"></i>\r\n        <i class=\"fa fa-file-image-o\" data-ng-show=\"node.elementType===3\" title=\"Page\"></i>\r\n        <span ng-class=\"{\'text-danger\':node.deleted}\">{{node.label}}</span>\r\n\r\n        <span class=\"pull-right\" ng-if=\"node.elementType===0\">\r\n            <span class=\"glyphicon glyphicon-floppy-saved cursor-hand text-success\"  \r\n                ng-if=\"treatmentDetailCtrl.isValidBatch(node)\"\r\n                data-nodrag=\"\" ng-click=\"treatmentDetailCtrl.validateBatch(node)\" title=\"Valider lot\"></span>\r\n            <span class=\"glyphicon glyphicon-floppy-remove cursor-hand text-danger\"  style=\"margin-left:2em;\"\r\n                ng-if=\"treatmentDetailCtrl.isValidBatch(node)\"\r\n                data-nodrag=\"\" ng-click=\"treatmentDetailCtrl.openPopPinRejectBatch(node)\" title=\"Rejeter lot\"></span>\r\n                \r\n            <span class=\"glyphicon glyphicon-plus cursor-hand text-info\" style=\"margin-left:2em;\"\r\n                data-nodrag=\"\" ng-click=\"$emit(\'control-image-add-envelope\',node)\" title=\"Ajouter pli\"></span>\r\n        </span>\r\n\r\n        <span class=\"pull-right\" ng-if=\"node.elementType===1\">\r\n            <span class=\"glyphicon glyphicon-floppy-saved cursor-hand text-success\"\r\n                ng-if=\"treatmentDetailCtrl.isValidEnvelope(node)\"\r\n                data-nodrag=\"\" ng-click=\"treatmentDetailCtrl.validateEnvelope(node)\" title=\"Valider pli\"></span>\r\n            <span class=\"glyphicon glyphicon-floppy-remove cursor-hand text-danger\"  style=\"margin-left:2em;\"\r\n                ng-if=\"treatmentDetailCtrl.isValidEnvelope(node)\"\r\n                data-nodrag=\"\" ng-click=\"treatmentDetailCtrl.openPopPinRejectPli(node)\" title=\"Rejeter pli\"></span>\r\n\r\n            <span class=\"glyphicon glyphicon-trash cursor-hand text-warning\"   style=\"margin-left:2em;\"\r\n                data-nodrag=\"\" ng-click=\"$emit(\'control-image-remove-envelope\',node)\" ng-if=\"treatmentDetailCtrl.isValidToDeleteEnvelope(node)\" title=\"Supprimer pli\"></span>\r\n            <span class=\"glyphicon glyphicon-plus cursor-hand text-info\"  style=\"margin-left:2em;\"\r\n                data-nodrag=\"\" ng-click=\"$emit(\'control-image-add-document\',node)\" title=\"Ajouter document\"></span>\r\n        </span>\r\n\r\n        <span class=\"pull-right\" ng-if=\"node.elementType===2\">\r\n            <span class=\"glyphicon glyphicon-trash cursor-hand text-warning\" \r\n                data-nodrag=\"\" ng-click=\"$emit(\'control-image-remove-document\',node)\" ng-if=\"treatmentDetailCtrl.isValidToDeleteDocument(node)\" title=\"Supprimer document\"></span>\r\n        </span>\r\n\r\n        <span class=\"pull-right\" ng-if=\"node.elementType===3\">\r\n            <span class=\"glyphicon glyphicon-trash cursor-hand text-warning\" \r\n                data-nodrag=\"\" ng-click=\"$emit(\'control-image-remove-page\',node)\" title=\"Supprimer page\"></span>\r\n            <span class=\"glyphicon glyphicon-eye-open btn-xs cursor-hand\" style=\"margin-left:2em;\"\r\n                data-nodrag=\"\" ng-click=\"$emit(\'control-image-view-picture\',node)\" title=\"Voir page\"></span>\r\n        </span>\r\n\r\n    </div>\r\n    <ol ui-tree-nodes=\"\" ng-model=\"node.nodes\" ng-class=\"{hidden: collapsed}\">\r\n        <li ng-repeat=\"node in node.nodes\" ng-if=\"!node.deleted && !node.hidden\" ui-tree-node ng-include=\"\'nodes_renderer.html\'\">\r\n        </li>\r\n    </ol>\r\n</script>\r\n<div id=\"page-wrapper\" class=\"mousetrap\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <!--<h2 class=\"page-header\"><i class=\"fa fa-envelope-o\"></i> Enveloppe : {{envelopeDetailCtrl.envelopeObject.label}}</h2>-->\r\n            <ol class=\"breadcrumb breadcrumb-custom\">\r\n                <li>\r\n                    <i class=\"fa fa-cubes \"></i>Corbeilles de traitements\r\n                </li>\r\n                <li><a href=\"#/control-image/treatment/{{treatmentDetailCtrl.trayId}}\">Contrôle image</a></li>\r\n                <li class=\"active\">\r\n                    <i class=\"fa fa-envelope-o\"></i> {{treatmentDetailCtrl.batchId}}\r\n                </li>\r\n            </ol>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n    <div class=\"row\">\r\n    \r\n        <div class=\"col-lg-6 col-md-6 padding-right-10\">\r\n            <div class=\"col-lg-12 row\">\r\n                <div class=\"text-center\">\r\n                    <p>\r\n                        <button class=\"btn btn-info\" ng-click=\"treatmentDetailCtrl.reset()\"><i class=\"fa fa-file-o\"></i></button>\r\n                        <button class=\"btn btn-danger\" ng-click=\"treatmentDetailCtrl.rotate(\'left\')\"><i class=\"fa fa-rotate-left\"></i></button>\r\n                        <button class=\"btn btn-danger\" ng-click=\"treatmentDetailCtrl.rotate(\'right\')\"><i class=\"fa fa-rotate-right\"></i></button>\r\n                        <button class=\"btn btn-success\" ng-click=\"treatmentDetailCtrl.zoom(-1)\"><i class=\"fa fa-search-minus\"></i></button>\r\n                        <button class=\"btn btn-success\" ng-click=\"treatmentDetailCtrl.zoom(1)\"><i class=\"fa fa-search-plus\"></i></button>\r\n                        <button class=\"btn btn-warning\" ng-click=\"treatmentDetailCtrl.first()\"><i class=\"fa fa-step-backward\"></i></button>\r\n                        <button class=\"btn btn-info\" ng-click=\"treatmentDetailCtrl.prev()\"><i class=\"fa fa-fast-backward\"></i></button>\r\n                        <button class=\"btn btn-info\" ng-click=\"treatmentDetailCtrl.next()\"><i class=\"fa fa-fast-forward\"></i></button>\r\n                        <button class=\"btn btn-warning\" ng-click=\"treatmentDetailCtrl.last()\"><i class=\"fa fa-step-forward\"></i></button>\r\n                        <button class=\"btn btn-danger\" ng-click=\"treatmentDetailCtrl.remove()\"><i class=\"fa fa-trash\"></i></button>\r\n                    </p>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-12\">\r\n                    <div class=\"panel panel-viewer\">\r\n                        <canvas-viewer src=\"fileInput\" overlays=\"overlaysCanvasViewer\" options=\"optionsCanvasViewer\"></canvas-viewer>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-lg-7 -->\r\n\r\n        <div class=\"col-lg-6 col-md-6\">\r\n            <div class=\"row\">\r\n                <div>\r\n                    <div class=\"panel panel-controls panel-warning\">\r\n                        <div class=\"panel-heading\">Arborescence lot</div>\r\n                        <div class=\"panel-body\" style=\"height: 500px;overflow-y : scroll;\">\r\n                            <div ui-tree=\"treeOptions\" id=\"tree-root\">\r\n                                <ol ui-tree-nodes ng-model=\"treeData\">\r\n                                    <li ng-repeat=\"node in treeData\" ui-tree-node ng-include=\"\'nodes_renderer.html\'\"></li>\r\n                                </ol>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div>\r\n                    <div class=\"panel panel-controls panel-warning\">\r\n                        <div class=\"panel-heading\">Informations</div>\r\n                        <div class=\"panel-body\">\r\n                            <ul class=\"list-group\">\r\n                                <li class=\"\">Lot : {{batchTree.name}}</li>\r\n                                <li class=\"\">Nombre de plis : {{batchTree.envelopes.length}}</li>\r\n                                <li class=\"\">Canal : n/a</li>\r\n                                <li class=\"\">Job : n/a</li>\r\n                                <li class=\"\">Date d\'intégration : {{batchTree.date |date:\'dd/MM/yyyy\'}}</li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n                <!-- /.panel-body -->\r\n        </div>\r\n            <!-- /.panel -->\r\n    </div>\r\n    \r\n        <!-- /.col-lg-5 -->\r\n</div>\r\n    <!-- /.row -->\r\n\r\n    <!-- Modal to reject lot -->\r\n    <div modal-show modal-visible=\"openPopPinRejectLot\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <h4 class=\"modal-title\"><i class=\"fa fa-trash-o\"></i> Rejeter le lot:</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <form role=\"form\" class=\"form-horizontal\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"select_reject\" class=\"col-sm-3 control-label\">Type de rejet:</label>\r\n                            <div class=\"col-sm-9\">\r\n                                <select id=\"select_reject\" class=\"form-control mousetrap\" ng-model=\"rejectId\" ng-options=\"rejectType.id as rejectType.label for rejectType in rejectTypesByBatch | orderBy:\'label\'\"></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"comment\" class=\"col-sm-3 control-label\">Commentaire :</label>\r\n                            <div class=\"col-sm-9\">\r\n                                <textarea ng-model=\"comment\" class=\"form-control\" id=\"comment\" placeholder=\"Pourquoi rejetez-vous ce lot ?\" maxlength=\"250\"></textarea>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button id=\"rejectTypeSubmit\" type=\"submit\" class=\"btn btn-success\" ng-click=\"rejectId && treatmentDetailCtrl.rejectBatch(rejectId, comment)\"\r\n                        ng-disabled=\"!rejectId\">Rejeter</button>\r\n                    <button id=\"rejectTypeCancel\" type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!-- Modal to reject pli -->\r\n    <div modal-show modal-visible=\"openPopPinRejectPli\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n            <div class=\"modal-dialog\">\r\n                <div class=\"modal-content\">\r\n                    <div class=\"modal-header\">\r\n                        <h4 class=\"modal-title\"><i class=\"fa fa-trash-o\"></i> Rejeter le pli:</h4>\r\n                    </div>\r\n                    <div class=\"modal-body\">\r\n                        <form role=\"form\" class=\"form-horizontal\">\r\n                            <div class=\"form-group\">\r\n                                <label for=\"select_reject\" class=\"col-sm-3 control-label\">Type de rejet:</label>\r\n                                <div class=\"col-sm-9\">\r\n                                    <select id=\"select_reject\" class=\"form-control mousetrap\" ng-model=\"rejectId\" ng-options=\"rejectType.id as rejectType.label for rejectType in rejectTypesByEnvelope | orderBy:\'label\'\"></select>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"form-group\">\r\n                                <label for=\"comment\" class=\"col-sm-3 control-label\">Commentaire :</label>\r\n                                <div class=\"col-sm-9\">\r\n                                    <textarea ng-model=\"comment\" class=\"form-control\" id=\"comment\" placeholder=\"Pourquoi rejetez-vous ce pli ?\" maxlength=\"250\"></textarea>\r\n                                </div>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                    <div class=\"modal-footer\">\r\n                        <button id=\"rejectTypeSubmit\" type=\"submit\" class=\"btn btn-success\" ng-click=\"rejectId && treatmentDetailCtrl.rejectEnvelope(rejectId, comment)\"\r\n                            ng-disabled=\"!rejectId\">Rejeter</button>\r\n                        <button id=\"rejectTypeCancel\" type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- Modal to timeout -->\r\n        <div modal-show modal-visible=\"openPopPinTimeOut\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n            <div class=\"modal-dialog\">\r\n                <div class=\"modal-content\">\r\n                    <div class=\"modal-header\">\r\n                        <h4 class=\"modal-title\">Phase d\'inactivité detectée</h4>\r\n                    </div>\r\n                    <div class=\"modal-body\">\r\n                        <form role=\"form\" class=\"form-horizontal\">\r\n                            <div class=\"form-group\">\r\n                                <div class=\"col-sm-9\">\r\n                                    Cela fait plus de {{treatmentDetailCtrl.CST_NUMBER_OF_MINUTE_BEFORE_POPUP_TIMEOUT}} minutes que nous n\'avons pas detecté une activité sur cette corbeille.<br>\r\n                                    Merci de valider cette fenetre sinon le lot sera debloqué.\r\n                                </div>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                    <div class=\"modal-footer\">\r\n                        <button type=\"button\" class=\"btn btn-success\" ng-click=\"treatmentDetailCtrl.resetTimeout()\">Valider</button>\r\n                        <button type=\"button\" class=\"btn btn-danger\"  ng-click=\"treatmentDetailCtrl.returnTray()\">Retour corbeille</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>        \r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/supervision/batch/batch.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h1 class=\"page-header\"><i class=\"fa fa fa-history fa-fw \"></i> Historique des lots\r\n                <span class=\"pull-right\">\r\n                    <input type=\"number\" ng-model=\"batNumber\" class=\"form-control mousetrap\" placeholder=\"Chercher un lot\">\r\n                </span>\r\n                <button id=\"searchBatch\" class=\"hide\" type=\"button\" ng-click=\"historicBatchCtrl.loadBatchHistorics(batNumber)\"></button>\r\n            </h1>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <table class=\"table table-bordered table-striped table-hover\" ng-if=\"historicBatchCtrl.historics.length\">\r\n                <thead>\r\n                    <tr class=\"warning\">\r\n                        <th class=\"text-center\">Id</th>\r\n                        <th class=\"text-center\">Numéro</th>\r\n                        <th class=\"text-center\">Nom</th>\r\n                        <th class=\"text-center\">Date d\'integration</th>\r\n                        <th class=\"text-center\">Nombre de plis</th>\r\n                        <th class=\"text-center\">Nombre de plis en cours</th>\r\n                        <th class=\"text-center\">Nombre de plis traités</th>\r\n                        <th class=\"text-center\">Nombre de plis supprimés</th>\r\n                        <th class=\"text-center\">Action</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr ng-repeat=\"batch in historicBatchCtrl.historics | limitTo : historicBatchCtrl.itemsPerPage : (historicBatchCtrl.currentPage-1)*historicBatchCtrl.itemsPerPage\">\r\n                        <td class=\"text-center\" ng-click=\"historicBatchCtrl.openEnvelopes(batch.id)\">{{batch.id}}</td>\r\n                        <td class=\"text-center\" ng-click=\"historicBatchCtrl.openEnvelopes(batch.id)\">{{batch.batNumber}}</td>\r\n                        <td class=\"text-center\" ng-click=\"historicBatchCtrl.openEnvelopes(batch.id)\">{{batch.name}}</td>\r\n                        <td class=\"text-center\" ng-click=\"historicBatchCtrl.openEnvelopes(batch.id)\">{{batch.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                        <td class=\"text-center\" ng-click=\"historicBatchCtrl.openEnvelopes(batch.id)\">{{batch.nbPendingEnv + batch.nbTreatedEnv + batch.nbDeletedEnv}}</td>\r\n                        <td class=\"text-center\" ng-click=\"historicBatchCtrl.openEnvelopes(batch.id)\"><span ng-class=\"batch.nbPendingEnv ? \'badge badge-success\':\'badge badge-warning\'\">{{batch.nbPendingEnv}}</span></td>\r\n                        <td class=\"text-center\" ng-click=\"historicBatchCtrl.openEnvelopes(batch.id)\">{{batch.nbTreatedEnv}}</td>\r\n                        <td class=\"text-center\" ng-click=\"historicBatchCtrl.openEnvelopes(batch.id)\">{{batch.nbDeletedEnv}}</td>\r\n                        <td class=\"text-center\"><button title=\"Supprimer le lot\" type=\"button\" class=\"btn btn-sm btn-danger fa fa-trash\" ng-click=\"historicBatchCtrl.prepareBatchDeletion(batch)\"></button></td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n            <div class=\"main-pagination\" ng-show=\"historicBatchCtrl.historics && historicBatchCtrl.historics.length\">\r\n                <uib-pagination total-items=\"historicBatchCtrl.historics.length\" ng-model=\"historicBatchCtrl.currentPage\" max-size=\"historicBatchCtrl.maxSize\"\r\n                    class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\" previous-text=\"Précédent\" next-text=\"Suivant\"\r\n                    items-per-page=\"historicBatchCtrl.itemsPerPage\">\r\n                </uib-pagination>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-md-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <!-- Modal to delete a batch -->\r\n    <div modal-show modal-visible=\"historicBatchCtrl.openPopinConfirm\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <!-- Modal content-->\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Confirmation</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <p>Êtes-vous sûr de vouloir supprimer les plis non traités du lot : <strong>{{historicBatchCtrl.historic.id}}</strong></p>\r\n                    <form role=\"form\" class=\"form-horizontal\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"comment\" class=\"col-sm-3 control-label\">Commentaire :</label>\r\n                            <div class=\"col-sm-9\">\r\n                                <textarea ng-model=\"historicBatchCtrl.comment\" class=\"form-control\" id=\"comment\" placeholder=\"Pourquoi supprimez-vous ce lot ?\"\r\n                                    maxlength=\"250\"></textarea>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"historicBatchCtrl.cancelBatchDeletion()\">Annuler</button>\r\n                    <button type=\"submit\" class=\"btn btn-success\" ng-click=\"historicBatchCtrl.deleteBatch()\">Valider</button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/supervision/envelope/envelope.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h1 class=\"page-header\"><i class=\"fa fa fa-history fa-fw \"></i> Liste des enveloppes par lot</h1>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <div class=\"panel panel-success\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-info-circle\"></i> Informations\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <span><b>Id Lot : </b>{{envelopeCtrl.envelopes[0].batch.id}}</span><br>\r\n                    <span><b>Lot :</b> {{envelopeCtrl.envelopes[0].batch.label}}</span>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-md-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n            <table class=\"table table-bordered table-striped table-hover\" ng-if=\"envelopeCtrl.envelopes.length\">\r\n                <thead>\r\n                    <tr class=\"warning\">\r\n                        <th class=\"text-center\">Numéro d\'enveloppe</th>\r\n                        <th class=\"text-center\">Commentaire</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr ng-repeat=\"env in envelopeCtrl.envelopes | limitTo : envelopeCtrl.itemsPerPage : (envelopeCtrl.currentPage-1)*envelopeCtrl.itemsPerPage\">\r\n                        <td ng-click=\"envelopeCtrl.openEnvelopeHistoric(env.id)\" class=\"text-center\"><span class=\"fa fa-envelope-o text-primary\">{{env.label}}</span></td>\r\n                        <td class=\"text-center\">{{env.comment}}</td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n            <div class=\"main-pagination\" ng-show=\"envelopeCtrl.envelopes && envelopeCtrl.envelopes.length\">\r\n                <uib-pagination total-items=\"envelopeCtrl.envelopes.length\" ng-model=\"envelopeCtrl.currentPage\" max-size=\"envelopeCtrl.maxSize\"\r\n                    class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\" previous-text=\"Précédent\" next-text=\"Suivant\"\r\n                    items-per-page=\"envelopeCtrl.itemsPerPage\">\r\n                </uib-pagination>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-md-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/supervision/historic/historic.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h1 class=\"page-header\"><i class=\"fa fa fa-history fa-fw \"></i> Historique des plis\r\n                <span class=\"pull-right\">\r\n                    <input type=\"number\" ng-model=\"idEnvelope\" class=\"form-control mousetrap\" placeholder=\"Chercher un pli\">\r\n                </span>\r\n                <button id=\"searchEnvelope\" class=\"hide\" type=\"button\" ng-click=\"historicCtrl.loadEnvelopeHistorics(idEnvelope)\"></button>\r\n            </h1>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-md-6\">\r\n            <div class=\"panel panel-info\" ng-if=\"historicCtrl.envelopeHistorics.length\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-clock-o fa-fw\"></i> Historique des actions\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body fixed-panel \">\r\n                    <ul class=\"timeline\">\r\n                        <li ng-class=\"{\'timeline-inverted\':$index%2!=0}\" ng-repeat=\"envelopeHistoric in historicCtrl.envelopeHistorics\">\r\n                            <div ng-class=\"historicCtrl.getTimelineBadgeCssClass(envelopeHistoric.id)\"><i ng-class=\"historicCtrl.getTimelineBadgeIconCss(envelopeHistoric.id)\"></i>\r\n                            </div>\r\n                            <div class=\"timeline-panel\">\r\n                                <div class=\"timeline-heading\">\r\n                                    <h4 class=\"timeline-title\">{{envelopeHistoric.label}}</h4>\r\n                                    <p>\r\n                                        <small class=\"text-muted\"><i class=\"fa fa-user\"></i> {{envelopeHistoric.user}}</small><br/>\r\n                                        <small class=\"text-muted\"><i class=\"fa fa-clock-o\"></i> {{envelopeHistoric.date|date:\' EEEE, d MMMM y à HH:mm:ss\'}}</small>\r\n                                    </p>\r\n                                </div>\r\n                                <div class=\"timeline-body\">\r\n                                    <p>\r\n                                        <span class=\"badge badge-default\">{{envelopeHistoric.originTray}}</span> <b><i class=\"fa fa-long-arrow-right\"></i></b> \r\n                                        <span class=\"badge badge-default\">{{envelopeHistoric.destinationTray}}</span>\r\n                                    </p>\r\n                                </div>\r\n                            </div>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-md-6 -->\r\n\r\n        <div class=\"col-md-3\" ng-if=\"false\">\r\n            <div class=\"panel panel-info\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-clock-o fa-fw\"></i> Détail de l\'enveloppe\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-md-3 -->\r\n        <div class=\"col-md-3\" ng-if=\"false\">\r\n            <div class=\"panel panel-info\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-clock-o fa-fw\"></i> Explorer l\'enveloppe\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-md-3 -->\r\n        <div class=\"col-md-6 pull-right\" ng-if=\"false\">\r\n            <div class=\"panel panel-info\" ng-if=\"historicCtrl.envelopeHistorics.length\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-clock-o fa-fw\"></i> les indexs de l\'enveloppe\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n\r\n\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-md-6 -->\r\n    </div>\r\n    <!-- /.row -->\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/tray-treatment/tray-detail/tray-detail.html","<div id=\"page-wrapper\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <!--<h2 class=\"page-header\"><i class=\"fa fa-cube\" aria-hidden=\"true\"></i> Corbeille : {{trayDetailCtrl.tray.label}}</h2>-->\r\n            <ol class=\"breadcrumb breadcrumb-custom\">\r\n                <li>\r\n                    <i class=\"fa fa-cubes \"></i><a href=\"#/home\"> Corbeilles de traitements</a>\r\n                </li>\r\n                <li class=\"active\">\r\n                    <i class=\"fa fa-cube\"></i> {{trayDetailCtrl.tray.label}}\r\n                </li>\r\n            </ol>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n\r\n        <div class=\"col-lg-8\" ng-show=\"!trayDetailCtrl.envelopesSearch || !trayDetailCtrl.envelopesSearch.total\">\r\n            <div class=\"panel panel-danger\">\r\n                <div class=\"panel-body\">\r\n                    <span>Pas d\'enveloppe dans cette corbeille / Aucune enveloppe ne correspond aux critères de recherche</span>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-lg-8 -->\r\n\r\n        <div class=\"col-lg-8\" ng-show=\"trayDetailCtrl.envelopesSearch && trayDetailCtrl.envelopesSearch.total\">\r\n            <table class=\"table table-bordered table-striped table-hover\">\r\n                <thead>\r\n                    <tr class=\"warning\">\r\n                        <th>\r\n                            <a ng-click=\"trayDetailCtrl.search.sortType = \'idEnvelope\'; trayDetailCtrl.search.sortReverse = !trayDetailCtrl.search.sortReverse ; trayDetailCtrl.loadEnvelopesByCriteria()\">\r\n                                <span ng-show=\"trayDetailCtrl.search.sortType == \'idEnvelope\' && !trayDetailCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"trayDetailCtrl.search.sortType == \'idEnvelope\' && trayDetailCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>                                Enveloppe\r\n                            </a>\r\n                        </th>\r\n                        <th>\r\n                            <a ng-click=\"trayDetailCtrl.search.sortType = \'batch.batNumber\'; trayDetailCtrl.search.sortReverse = !trayDetailCtrl.search.sortReverse; trayDetailCtrl.loadEnvelopesByCriteria()\">\r\n                                <span ng-show=\"trayDetailCtrl.search.sortType == \'batch.batNumber\' && !trayDetailCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"trayDetailCtrl.search.sortType == \'batch.batNumber\' && trayDetailCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>                                Lot\r\n                            </a>\r\n                        </th>\r\n                        <th ng-if=\"trayDetailCtrl.tray.type.code === \'RJT\'\">\r\n                            <a ng-click=\"trayDetailCtrl.search.sortType = \'envComment\'; trayDetailCtrl.search.sortReverse = !trayDetailCtrl.search.sortReverse; trayDetailCtrl.loadEnvelopesByCriteria()\">\r\n                                <span ng-show=\"trayDetailCtrl.search.sortType == \'envComment\' && !trayDetailCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"trayDetailCtrl.search.sortType == \'envComment\' && trayDetailCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>                                Type de rejet\r\n                            </a>\r\n                        </th>\r\n                        <th>\r\n                            <a ng-click=\"trayDetailCtrl.search.sortType = \'createDate\'; trayDetailCtrl.search.sortReverse = !trayDetailCtrl.search.sortReverse; trayDetailCtrl.loadEnvelopesByCriteria()\">\r\n                                <span ng-show=\"trayDetailCtrl.search.sortType == \'createDate\' && !trayDetailCtrl.search.sortReverse\" class=\"fa fa-caret-down\"></span>\r\n                                <span ng-show=\"trayDetailCtrl.search.sortType == \'createDate\' && trayDetailCtrl.search.sortReverse\" class=\"fa fa-caret-up\"></span>                                Date d\'intégration\r\n                            </a>\r\n                        </th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr ng-repeat=\"envelope in trayDetailCtrl.envelopesSearch.envelopes\">\r\n                        <td ng-click=\"trayDetailCtrl.openEnvelope(envelope.id)\"><span class=\"fa fa-envelope-o text-primary\"> {{envelope.id}}</span></td>\r\n                        <td ng-click=\"trayDetailCtrl.openEnvelope(envelope.id)\">{{envelope.batchId}}</td>\r\n                        <td ng-if=\"trayDetailCtrl.tray.type.code === \'RJT\'\" ng-click=\"trayDetailCtrl.openEnvelope(envelope.id)\">{{envelope.comment}}</td>\r\n                        <td ng-click=\"trayDetailCtrl.openEnvelope(envelope.id)\">{{envelope.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n            <div class=\"main-pagination\" ng-show=\"trayDetailCtrl.envelopesSearch.total\">\r\n                <uib-pagination total-items=\"trayDetailCtrl.envelopesSearch.total\" ng-model=\"trayDetailCtrl.search.currentPage\" max-size=\"25\"\r\n                    class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\" previous-text=\"Précédent\" next-text=\"Suivant\"\r\n                    items-per-page=\"trayDetailCtrl.search.itemsPerPage\" ng-click=\"trayDetailCtrl.loadEnvelopesByCriteria()\">\r\n                </uib-pagination>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-lg-8 -->\r\n\r\n        <div class=\"col-lg-4\">\r\n            <div class=\"panel panel-danger\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-info-circle\"></i> Informations\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <span>{{trayDetailCtrl.tray.comment}}</span>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n\r\n            <div class=\"panel panel-success\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa fa-search\"></i> Recherche\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <form name=\"form\" class=\"form-horizontal\">\r\n                    <div class=\"panel-body\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"envelopeId\" class=\"col-sm-4 control-label\">Enveloppe :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"text\" ng-model=\"trayDetailCtrl.search.envelopeId\" class=\"form-control\" id=\"envelopeId\" placeholder=\"chercher enveloppe\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"batchId\" class=\"col-sm-4 control-label\">Lot :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"text\" ng-model=\"trayDetailCtrl.search.batchId\" class=\"form-control\" id=\"batchId\" placeholder=\"chercher lot\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"startDate\" class=\"col-sm-4 control-label\">Date de début :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"date\" ng-model=\"trayDetailCtrl.search.startDate\" class=\"form-control\" id=\"startDate\">\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"form-group\">\r\n                            <label for=\"endDate\" class=\"col-sm-4 control-label\">Date de fin :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <input type=\"date\" ng-model=\"trayDetailCtrl.search.endDate\" class=\"form-control\" id=\"endDate\">\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"items\" class=\"col-sm-4 control-label\">Afficher :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <select type=\"text\" ng-model=\"trayDetailCtrl.search.itemsPerPage\" id=\"itemPage\" class=\"form-control\">\r\n                                    <option value=\"\" disabled selected>Affichage par page</option>\r\n                                    <option value=\"10\">10</option>\r\n                                    <option value=\"20\">20</option>\r\n                                    <option value=\"50\">50</option>\r\n                                    <option value=\"100\">100</option>\r\n                                 </select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"alert alert-danger\" ng-show=\"!trayDetailCtrl.search || trayDetailCtrl.search.startDate > trayDetailCtrl.search.endDate\">\r\n                            <strong>Attention !</strong> La date de fin ne peut pas être inférieure à la date de début.\r\n                        </div>\r\n                    </div>\r\n                    <!-- /.panel-body -->\r\n                    <div class=\"panel-footer text-right\">\r\n                        <button id=\"initDate\" type=\"button\" class=\"btn btn-danger\" ng-click=\"trayDetailCtrl.initSearch()\">Réinitialiser</button>\r\n                        <button id=\"searchDate\" type=\"button\" class=\"btn btn-success\" ng-disabled=\"!trayDetailCtrl.search || trayDetailCtrl.search.startDate > trayDetailCtrl.search.endDate\"\r\n                            ng-click=\"trayDetailCtrl.search && trayDetailCtrl.loadEnvelopesByCriteria()\">Rechercher</button>\r\n\r\n                    </div>\r\n                    <!-- /.panel-footer -->\r\n                </form>\r\n            </div>\r\n            <!-- /.panel -->\r\n        </div>\r\n        <!-- /.col-lg-4 -->\r\n\r\n    </div>\r\n    <!-- /.row -->\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/tray-treatment/envelope-detail/envelope-detail.html","<div id=\"page-wrapper\" class=\"mousetrap\">\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <!--<h2 class=\"page-header\"><i class=\"fa fa-envelope-o\"></i> Enveloppe : {{envelopeDetailCtrl.envelopeObject.label}}</h2>-->\r\n            <ol class=\"breadcrumb breadcrumb-custom\">\r\n                <li>\r\n                    <i class=\"fa fa-cubes \"></i> Corbeilles de traitements\r\n                </li>\r\n                <li>\r\n                    <i class=\"fa fa-cube\"></i> <a href=\"#/tray-detail/{{envelopeDetailCtrl.currentTray.id}}\">{{envelopeDetailCtrl.currentTray.label}}</a>\r\n                </li>\r\n                <li class=\"active\">\r\n                    <i class=\"fa fa-envelope-o\"></i> {{treedata.label}}\r\n                </li>\r\n            </ol>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-7 padding-right-10\">\r\n            <div class=\"panel panel-viewer\">\r\n                <canvas-viewer ng-if=\"fileInput\" src=\"fileInput\" overlays=\"overlays\" options=\"options\"></canvas-viewer>\r\n            </div>\r\n            <!-- /.panel -->\r\n\r\n            <div class=\"col-lg-1\" ng-repeat=\"page in envelopeDetailCtrl.pagesPictures\">\r\n                <a ng-click=\"envelopeDetailCtrl.changePictureView(page.label)\"\r\n                   ng-class=\"page.selected == \'selected\' ? \'thumbnail active\' : \'thumbnail\'\"><img title=\"{{page.label}}\"\r\n                                                                                                  ng-src=\"http://svlvdcom01/data/{{page.imagePath}}\"\r\n                                                                                                  onerror=\"this.src=\'img/default.png\'\"\r\n                                                                                                  class=\"img-responsive\"/></a>\r\n            </div>\r\n            <!-- /.col-lg-1-->\r\n        </div>\r\n        <!-- /.col-lg-7 -->\r\n\r\n        <div class=\"col-lg-5 padding-left-10\">\r\n            <div class=\"panel panel-controls\">\r\n                <div class=\"panel-body\">\r\n                    <table>\r\n                        <tr>\r\n                            <div data-angular-treeview=\"true\" data-tree-id=\"tree\" data-tree-model=\"treedataArray\"\r\n                                 data-node-id=\"id\" data-node-label=\"label\"\r\n                                 data-node-children=\"children\"></div>\r\n                            </td>\r\n                            <td class=\"col-sm-5\">\r\n                                <ul class=\"list-group\">\r\n                                    <li class=\"list-group-item\" ng-if=\"envelopeDetailCtrl.envelopeObject.comment\">\r\n                                        <h4 ng-if=\"envelopeDetailCtrl.currentTray.type.code===\'RJT\'\"\r\n                                            class=\"list-group-item-heading\">Type de rejet :</h4>\r\n                                        <h4 ng-if=\"envelopeDetailCtrl.currentTray.type.code!==\'RJT\'\"\r\n                                            class=\"list-group-item-heading\">Commentaire :</h4>\r\n                                        <p class=\"list-group-item-text\">\r\n                                            {{envelopeDetailCtrl.envelopeObject.comment}}</p>\r\n                                    </li>\r\n                                    <li class=\"list-group-item\">\r\n                                        <h4 class=\"list-group-item-heading\">Numéro de lot :\r\n                                            {{envelopeDetailCtrl.envelopeObject.batch.label}}</h4>\r\n                                    </li>\r\n                                    <li class=\"list-group-item\">\r\n                                        <h4 class=\"list-group-item-heading\">Opérateur :\r\n                                            {{envelopeDetailCtrl.envelopeObject.lastUser}}</h4>\r\n                                    </li>\r\n                                </ul>\r\n                            </td>\r\n                            <td class=\"col-sm-4 text-center\">\r\n                                <ul>\r\n                                    <li>\r\n                                        <button id=\"quitEnvelope\" type=\"button\" class=\"btn btn-danger\"\r\n                                                ng-click=\"envelopeDetailCtrl.quitEnvelope(\'\')\">Quitter la tâche\r\n                                        </button>\r\n                                    </li>\r\n                                    <li ng-show=\"envelopeDetailCtrl.rejectTypes.length\">\r\n                                        <button type=\"button\" class=\"btn btn-warning\"\r\n                                                ng-click=\"openPopPinReject = true\">Rejeter la tâche\r\n                                        </button>\r\n                                    </li>\r\n                                    <li ng-show=\"!tree.currentNode.elementType\">\r\n                                        <button id=\"saveImageBtn\" type=\"button\" class=\"btn btn-info\"\r\n                                                ng-click=\"!tree.currentNode.elementType && envelopeDetailCtrl.saveRedressImage()\">\r\n                                            Correction d\'image\r\n                                        </button>\r\n                                    </li>\r\n                                    <li ng-show=\"envelopeDetailCtrl.currentTray.type.code===\'IDX\'\">\r\n                                        <button id=\"indexSubmit\" type=\"button\" class=\"btn btn-success\"\r\n                                                ng-click=\"envelopeDetailCtrl.currentTray.type.code===\'IDX\' && envelopeDetailCtrl.canIndex() && envelopeDetailCtrl.index()\"\r\n                                                ng-disabled=\"!envelopeDetailCtrl.canIndex()\">Indexer\r\n                                        </button>\r\n                                    </li>\r\n                                    <li ng-show=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\">\r\n                                        <button type=\"button\" class=\"btn btn-success\"\r\n                                                ng-click=\"envelopeDetailCtrl.validateControleQuality()\"\r\n                                                ng-disabled=\"envelopeDetailCtrl.isControleQualityValidated  === undefined || !envelopeDetailCtrl.canIndex()\">\r\n                                            Valider la tâche\r\n                                        </button>\r\n                                    </li>\r\n                                    <li ng-show=\"envelopeDetailCtrl.currentTray.type.code===\'RJT\'\">\r\n                                        <button type=\"button\" class=\"btn btn-warning\" ng-click=\"openPopSendBack = true\">\r\n                                            Renvoyer la tâche\r\n                                        </button>\r\n                                    </li>\r\n                                    <li ng-show=\"envelopeDetailCtrl.currentTray.type.code===\'CLF\'\">\r\n                                        <button id=\"classifySubmit\" type=\"submit\" class=\"btn btn-success\"\r\n                                                ng-click=\"envelopeDetailCtrl.canClassify() && envelopeDetailCtrl.classify()\"\r\n                                                ng-disabled=\"!envelopeDetailCtrl.canClassify()\">Classifier\r\n                                        </button>\r\n                                    </li>\r\n                                    <li ng-if=\"envelopeDetailCtrl.currentTray.canPrint\">\r\n                                        <button type=\"button\" class=\"btn btn-info\"\r\n                                                ng-click=\"envelopeDetailCtrl.exportEnvelopePdf(envelopeDetailCtrl.envelopeObject.id)\">\r\n                                            Imprimer PDF\r\n                                        </button>\r\n                                    </li>\r\n                                    <li ng-show=\"envelopeDetailCtrl.currentTray.type.code===\'RJT\'\">\r\n                                        <button type=\"button\" class=\"btn btn-success\"\r\n                                                ng-click=\"envelopeDetailCtrl.flagExportEnvelope(envelopeDetailCtrl.envelopeObject.id)\">\r\n                                            Valider\r\n                                        </button>\r\n                                    </li>\r\n                                </ul>\r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n\r\n            <!--====================        START - Indexation accordion for Envelope / Documents         ==================================-->\r\n            <uib-accordion close-others=\"currentTray.accordionCloseOthers\">\r\n                <div uib-accordion-group class=\"panel-{{category.color}}\" is-open=\"category.open\"\r\n                     is-disabled=\"!category.enabled\"\r\n                     ng-repeat=\"category in envelopeDetailCtrl.getCategoriesForIndexationPanel()\">\r\n                    <uib-accordion-heading>\r\n                        <div>\r\n                            <i class=\"fa {{category.icon}}\"></i> {{category.label}} :<i class=\"pull-right\"\r\n                                                                                        ng-class=\"{\'fa fa-chevron-down\': category.open, \'fa fa-chevron-right\': !category.open}\"></i>\r\n                        </div>\r\n                    </uib-accordion-heading>\r\n\r\n                    <table class=\"table_grid table-striped\" ng-if=\"category.type === \'table\'\">\r\n                        <tr ng-repeat=\"t in [].constructor(category.nbRows) track by $index\">\r\n                            <td class=\"text-center\" ng-repeat=\"n in [].constructor(category.nbColumns) track by $index\"\r\n                                ng-init=\"index = envelopeDetailCtrl.getIndexByPosition(category, $index, $parent.$index)\">\r\n                                <input ng-if=\"index\" title=\"{{index.label}}\" class=\"mousetrap\" name=\"id_{{index.id}}\"\r\n                                       id=\"id_{{index.id}}\" ng-model=\"index.value[0]\"\r\n                                       placeholder=\"{{index.label}}\" type=\"{{index.inputType}}\"\r\n                                       ng-readonly=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\"\r\n                                />\r\n                                <!--<input title=\"{{$parent.$index+\'\'+$index}}\" class=\"transparent-input\" ng-if=\"!index\" type=\"checkbox\" ng-disabled=\"true\" />-->\r\n                            </td>\r\n                        </tr>\r\n                    </table>\r\n\r\n                    <form name=\"form_envelope_indexes\" role=\"form_envelope_indexes\" class=\"form-horizontal\"\r\n                          ng-if=\"category.type !== \'table\'\">\r\n                        <div class=\"form-group\" ng-repeat=\"index in category.indexes track by index.id\"\r\n                             ng-if=\"!index.childIndexes.length\">\r\n                            <label for=\"id_{{index.id}}\" class=\"col-sm-4 control-label pull-left\">{{index.label}}\r\n                                {{index.required ? \'*\' : \'\'}} :</label>\r\n\r\n                            <div class=\"col-sm-8\"\r\n                                 ng-class=\"{\'has-error\': form_envelope_indexes.id_{{index.id}}.$error.maxlength}\"\r\n                                 ng-if=\"!index.refSearch\">\r\n                                <input ng-if=\"index.items.length===0 && index.inputType !== \'tel\'\"\r\n                                       name=\"id_{{index.id}}\" id=\"id_{{index.id}}\" class=\"form-control mousetrap\"\r\n                                       ng-maxlength=\"index.maxLength\" ng-model=\"index.value[0]\"\r\n                                       placeholder=\"{{index.label}}\" type=\"{{index.inputType}}\"\r\n                                       ng-readonly=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\"\r\n                                       ng-pattern=\"{{((index.trayIndexRegex == null)||(index.trayIndexRegex == \'\')) ? index.indexRegex : index.trayIndexRegex}}\">\r\n\r\n                                <input phone-input ng-if=\"index.items.length===0 && index.inputType === \'tel\'\"\r\n                                       id=\"id_{{index.id}}\" class=\"form-control mousetrap\"\r\n                                       ng-maxlength=\"index.maxLength\" ng-model=\"index.value[0]\"\r\n                                       placeholder=\"{{index.label}}\" type=\"{{index.inputType}}\"\r\n                                       ng-readonly=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\">\r\n\r\n                                <ui-select ng-if=\"index.items.length\"\r\n                                           ng-init=\"index.value[0]=envelopeDetailCtrl.getSelectedOrDefaultItem(index)\"\r\n                                           ng-model=\"index.value[0]\"\r\n                                           theme=\"bootstrap\" reset-search-input=\"false\" append-to-body=\"true\"\r\n                                           ng-disabled=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\">\r\n                                    <ui-select-match placeholder=\"{{index.label}}\">{{$select.selected.label}}\r\n                                    </ui-select-match>\r\n                                    <ui-select-choices\r\n                                            repeat=\"item.code as item in index.items | filter : $select.search\">\r\n                                        {{item.label}}\r\n                                    </ui-select-choices>\r\n                                </ui-select>\r\n                                <span ng-show=\"form_envelope_indexes.id_{{index.id}}.$error.maxlength\"\r\n                                      class=\"help-block\">La longueur maximale est :{{index.maxLength}}</span>\r\n                                <!--<span ng-show=\"form_envelope_indexes.id_{{index.id}}.$error.pattern\" class=\"help-block\">Non correspondance des champs avec le type de données attendu</span>-->\r\n                                <div class=\"alert alert-danger\" role=\"alert\"\r\n                                     ng-show=\"form_envelope_indexes.id_{{index.id}}.$error.pattern\">Non correspondance\r\n                                    avec le type de données attendu\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"col-sm-8\"\r\n                                 ng-class=\"{\'has-error\': form_envelope_indexes.id_{{index.id}}.$error.maxlength}\"\r\n                                 ng-if=\"index.refSearch\">\r\n                                <div class=\"input-group\">\r\n                                    <input ng-if=\"index.items.length===0 && index.inputType !== \'tel\'\"\r\n                                           name=\"id_{{index.id}}\" id=\"id_{{index.id}}\" class=\"form-control mousetrap\"\r\n                                           ng-maxlength=\"index.maxLength\" ng-model=\"index.value[0]\"\r\n                                           placeholder=\"{{index.label}}\"\r\n                                           type=\"{{index.inputType}}\"\r\n                                           ng-readonly=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\">\r\n\r\n                                    <input phone-input ng-if=\"index.items.length===0 && index.inputType === \'tel\'\"\r\n                                           id=\"id_{{index.id}}\" class=\"form-control mousetrap\"\r\n                                           ng-maxlength=\"index.maxLength\" ng-model=\"index.value[0]\"\r\n                                           placeholder=\"{{index.label}}\"\r\n                                           type=\"{{index.inputType}}\"\r\n                                           ng-readonly=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\">\r\n\r\n                                    <ui-select ng-if=\"index.items.length\"\r\n                                               ng-init=\"index.value[0]=envelopeDetailCtrl.getSelectedOrDefaultItem(index)\"\r\n                                               ng-model=\"index.value[0]\"\r\n                                               theme=\"bootstrap\" reset-search-input=\"false\" append-to-body=\"true\">\r\n                                        <ui-select-match placeholder=\"{{index.label}}\">{{$select.selected.label}}\r\n                                        </ui-select-match>\r\n                                        <ui-select-choices\r\n                                                repeat=\"item.code as item in index.items | filter : $select.search\">\r\n                                            {{item.label}}\r\n                                        </ui-select-choices>\r\n                                    </ui-select>\r\n                                    <span ng-show=\"form_envelope_indexes.id_{{index.id}}.$error.maxlength\"\r\n                                          class=\"help-block\">La longueur maximale est :{{index.maxLength}}</span>\r\n\r\n                                    <span class=\"input-group-btn\"> <button class=\"btn btn-success\" id=\"callRefBtn\"\r\n                                                                           type=\"button\"\r\n                                                                           ng-click=\"envelopeDetailCtrl.callReferential(index)\"\r\n                                                                           ng-disabled=\"!index.value[0]\"><i\r\n                                            class=\"fa fa-search\" aria-hidden=\"true\"></i></button></span>\r\n                                </div>\r\n                            </div>\r\n\r\n                        </div>\r\n                    </form>\r\n\r\n                    <table class=\"table table-bordered table-condensed text-center table-indexation\"\r\n                           ng-repeat=\"index in category.indexes track by index.id\"\r\n                           ng-if=\"index.childIndexes.length\">\r\n                        <thead>\r\n                        <tr class=\"info\">\r\n                            <th ng-repeat=\"indexd in index.childIndexes\">{{indexd.label}}</th>\r\n                            <th class=\"text-center\"\r\n                                ng-if=\"envelopeDetailCtrl.currentTray.type.code===\'IDX\'\">Action\r\n                            </th>\r\n                        </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                        <tr ng-repeat=\"item in index.childIndexes[0].value track by $index\">\r\n                            <td ng-repeat=\"childIndex in index.childIndexes\">\r\n                                <input id=\"id_{{$parent.$index}}{{$index}}\" class=\"form-control mousetrap\"\r\n                                       ng-model=\"childIndex.value[$parent.$index]\"\r\n                                       placeholder=\"{{childIndex.label}} - {{$parent.$index + 1}}\"\r\n                                       type=\"{{childIndex.inputType}}\"\r\n                                       ng-readonly=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\">\r\n                            </td>\r\n                            <td>\r\n                                <button class=\"btn btn-sm btn-danger fa fa-minus-circle\" title=\"Supprimer la ligne\"\r\n                                        ng-if=\"envelopeDetailCtrl.currentTray.type.code===\'IDX\'\"\r\n                                        ng-click=\"envelopeDetailCtrl.dropLine(index, $parent.$index)\"></button>\r\n                                <button class=\"btn btn-sm btn-warning fa fa-files-o\" title=\"Dupliquer la ligne\"\r\n                                        ng-if=\"envelopeDetailCtrl.currentTray.type.code===\'IDX\'\"\r\n                                        ng-click=\"envelopeDetailCtrl.duplicateLine(index, $parent.$index)\"></button>\r\n                            </td>\r\n                        </tr>\r\n                        <tr>\r\n                            <td colspan=\"{{index.childIndexes.length}}\"></td>\r\n                            <td class=\"text-center\">\r\n                                <button class=\"btn btn-sm btn-success fa fa-plus-circle\"\r\n                                        ng-if=\"envelopeDetailCtrl.currentTray.type.code===\'IDX\'\"\r\n                                        ng-click=\"envelopeDetailCtrl.addNewLine(index)\"></button>\r\n                            </td>\r\n                        </tr>\r\n                        </tbody>\r\n                    </table>\r\n                </div>\r\n            </uib-accordion>\r\n\r\n            <div class=\"btn-group\" data-toggle=\"buttons\"\r\n                 ng-if=\"envelopeDetailCtrl.currentTray.type.code===\'QLT\'\">\r\n                <label>\r\n                    Validez-vous les données saisies ?\r\n                    <button type=\"button\" ng-click=\"envelopeDetailCtrl.isControleQualityValidated  = true\"\r\n                            ng-class=\"{\'btn btn-success\':envelopeDetailCtrl.isControleQualityValidated , \'btn btn-default\':!envelopeDetailCtrl.isControleQualityValidated }\">\r\n                        OUI\r\n                    </button>\r\n                    <button type=\"button\" ng-click=\"envelopeDetailCtrl.isControleQualityValidated  = false\"\r\n                            ng-class=\"{\'btn btn-default\':envelopeDetailCtrl.isControleQualityValidated ===true || envelopeDetailCtrl.isControleQualityValidated ===undefined, \'btn btn-danger\':envelopeDetailCtrl.isControleQualityValidated ===false}\">\r\n                        NON\r\n                    </button>\r\n                </label>\r\n            </div>\r\n            <!--====================        END - Indexation accordion for Envelope / Documents         ==================================-->\r\n\r\n\r\n            <!--===========================     CLASSIFICATION TRAY : classify by document (START)     ===========================-->\r\n            <div class=\"panel panel-info\"\r\n                 ng-if=\"tree.currentNode.structuralEntityType.code===\'DOC\' && envelopeDetailCtrl.currentTray.type.code===\'CLF\' && envelopeDetailCtrl.currentTray.structuralEntityType.code===\'DOC\'\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-pencil-square-o\"></i> Classifier le document\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <form role=\"form_classification\" class=\"form-horizontal\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"id_typology\" class=\"col-sm-4 control-label pull-left\">Choisir un type *\r\n                                :</label>\r\n                            <div class=\"col-sm-7\">\r\n                                <ui-select id=\"id_typology\" ng-model=\"tree.currentNode.documentType.id\"\r\n                                           ng-disabled=\"tree.currentNode.documentType.label\" theme=\"bootstrap\"\r\n                                           reset-search-input=\"false\"\r\n                                           append-to-body=\"true\">\r\n                                    <ui-select-match placeholder=\"Choisir un type\">{{$select.selected.label}}\r\n                                    </ui-select-match>\r\n                                    <ui-select-choices\r\n                                            repeat=\"docType.id as docType in envelopeDetailCtrl.docTypes | filter : $select.search\">\r\n                                        {{docType.code + \' - \' + docType.label}}\r\n                                    </ui-select-choices>\r\n                                </ui-select>\r\n                            </div>\r\n                            <i id=\"dropDocTypeBtn\" ng-if=\"tree.currentNode.documentType.label\"\r\n                               ng-click=\"tree.currentNode.documentType=undefined\"\r\n                               class=\"col-sm-1 fa fa-times icon-left-input\"></i>\r\n                            <i id=\"validateDocTypeBtn\"\r\n                               ng-if=\"tree.currentNode.documentType.id && !tree.currentNode.documentType.label\"\r\n                               ng-click=\"envelopeDetailCtrl.refreshDocTypeLabel(tree.currentNode.documentType)\"\r\n                               class=\"col-sm-1 fa fa-check icon-left-input\"></i>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n            <!--===========================     CLASSIFICATION TRAY : classify by document (END)     ===========================-->\r\n\r\n            <!--===========================     CLASSIFICATION TRAY : classify by envelope (START)     ===========================-->\r\n            <div class=\"panel panel-info\"\r\n                 ng-if=\"envelopeDetailCtrl.currentTray.type.code===\'CLF\' && envelopeDetailCtrl.currentTray.structuralEntityType.code===\'ENV\'\">\r\n                <div class=\"panel-heading\">\r\n                    <i class=\"fa fa-pencil-square-o\"></i> Classifier l\'enveloppe\r\n                </div>\r\n                <!-- /.panel-heading -->\r\n                <div class=\"panel-body\">\r\n                    <form role=\"form_classification\" class=\"form-horizontal\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"id_typology\" class=\"col-sm-4 control-label pull-left\">Choisir un type de pli *\r\n                                :</label>\r\n                            <div class=\"col-sm-7\">\r\n                                <ui-select id=\"id_typology\" ng-model=\"envelopeDetailCtrl.envType\" theme=\"bootstrap\"\r\n                                           reset-search-input=\"false\" append-to-body=\"true\">\r\n                                    <ui-select-match placeholder=\"Choisir un type\">{{$select.selected.label}}\r\n                                    </ui-select-match>\r\n                                    <ui-select-choices\r\n                                            repeat=\"envType in envelopeDetailCtrl.envTypes | filter : $select.search\">\r\n                                        {{envType.label}}\r\n                                    </ui-select-choices>\r\n                                </ui-select>\r\n                            </div>\r\n                            <!-- remove because not managed in new mdd => ng-click=\"envelopeDetailCtrl.informEnvDocsTypes()\"-->\r\n                            <i id=\"validateEnvTypeBtn\" ng-if=\"envelopeDetailCtrl.envType\"\r\n                               class=\"col-sm-1 fa fa-check icon-left-input\"></i>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n                <!-- /.panel-body -->\r\n            </div>\r\n            <!-- /.panel -->\r\n            <!--===========================     CLASSIFICATION TRAY : classify by envelope (END)     ===========================-->\r\n\r\n        </div>\r\n        <!-- /.col-lg-5 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <!-- Modal to reject envelope -->\r\n    <div modal-show modal-visible=\"openPopPinReject\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <h4 class=\"modal-title\"><i class=\"fa fa-trash-o\"></i> Rejeter la tâche:</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <form role=\"form\" class=\"form-horizontal\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"select_reject\" class=\"col-sm-3 control-label\">Type de rejet:</label>\r\n                            <div class=\"col-sm-9\">\r\n                                <select id=\"select_reject\" class=\"form-control mousetrap\" ng-model=\"rejectId\"\r\n                                        ng-options=\"rejectType.id as rejectType.label for rejectType in envelopeDetailCtrl.rejectTypes | orderBy:\'label\'\"></select>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <label for=\"comment\" class=\"col-sm-3 control-label\">Commentaire :</label>\r\n                            <div class=\"col-sm-9\">\r\n                                <textarea ng-model=\"comment\" class=\"form-control\" id=\"comment\"\r\n                                          placeholder=\"Pourquoi rejetez-vous cette tâche ?\" maxlength=\"250\"></textarea>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button id=\"rejectTypeSubmit\" type=\"submit\" class=\"btn btn-success\"\r\n                            ng-click=\"rejectId && envelopeDetailCtrl.rejectEnvelope(rejectId, comment)\"\r\n                            ng-disabled=\"!rejectId\">Rejeter\r\n                    </button>\r\n                    <button id=\"rejectTypeCancel\" type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Modal to quit envelope -->\r\n    <div modal-show modal-visible=\"openPopSendBack\" class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <h4 class=\"modal-title\"><i class=\"fa fa-paper-plane-o\"></i> Renvoyer la tâche :</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <form role=\"form\" class=\"form-horizontal\">\r\n                        <div class=\"form-group\">\r\n                            <label for=\"select_tray\" class=\"col-sm-4 control-label\">Choisir une corbeille :</label>\r\n                            <div class=\"col-sm-8\">\r\n                                <select id=\"select_tray\" class=\"form-control mousetrap\"\r\n                                        ng-options=\"tray as tray.label for tray in envelopeDetailCtrl.currentTray.predecessors | orderBy:\'label\'\"\r\n                                        ng-model=\"tray\"></select>\r\n                            </div>\r\n                        </div>\r\n                    </form>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button id=\"sendBackSubmit\" type=\"submit\" ng-disabled=\"!tray\" class=\"btn btn-success\"\r\n                            ng-click=\"tray&&envelopeDetailCtrl.changeEnvelopeTray(tray)\">Renvoyer\r\n                    </button>\r\n                    <button id=\"sendBackCancel\" type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- /#page-wrapper -->\r\n");
$templateCache.put("components/administration/entity-type/add/entity-type-add.html","<div id=\"page-wrapper\">\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-list-alt\" aria-hidden=\"true\"></i> Ajout d\'un type d\'entité :\r\n                {{entityTypeAddCtrl.routeParams.entityTypeParams}}</h2>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n\r\n            <form role=\"form_create\" class=\"form-horizontal\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"label\" class=\"col-sm-2 control-label\">Code :</label>\r\n                    <div class=\"col-sm-10\">\r\n                        <input type=\"text\" ng-model=\"entityTypeAddCtrl.entityTypeModel.code\"\r\n                               class=\"form-control\" id=\"code\" required>\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                    <div class=\"col-sm-10\">\r\n                        <input type=\"text\" ng-model=\"entityTypeAddCtrl.entityTypeModel.label\"\r\n                               class=\"form-control\" id=\"label\" required>\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"label\" class=\"col-sm-2 control-label\">Activé :</label>\r\n                    <div class=\"col-sm-10\">\r\n                        <input type=\"checkbox\" ng-model=\"entityTypeAddCtrl.entityTypeModel.enabled\"\r\n                               class=\"form-control\" id=\"enabled\">\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <button type=\"submit\" class=\"btn btn-success\"\r\n                            ng-disabled=\"!entityTypeAddCtrl.isFilled()\"\r\n                            ng-click=\"entityTypeAddCtrl.addEntityType()\">Valider\r\n                    </button>\r\n                    <a href=\"#/admin/entity-type/{{entityTypeAddCtrl.routeParams.entityTypeParams}}\"\r\n                       class=\"btn btn-danger\">Annuler</a>\r\n                </div>\r\n            </form>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/administration/entity-type/list/entity-type-list.html","<div id=\"page-wrapper\">\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-list-alt\" aria-hidden=\"true\"></i> Administration des types des\r\n                entités : {{entityTypeListCtrl.routeParams.entityTypeParams}}\r\n            </h2>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <div class=\"input-group\">\r\n                <span class=\"input-group-addon\" id=\"basic-addon1\"><i class=\"fa fa-search\" aria-hidden=\"true\"></i></span>\r\n                <input type=\"text\" ng-model=\"searchentityType\" class=\"form-control\" placeholder=\"CHERCHER\"\r\n                       aria-describedby=\"basic-addon1\">\r\n                <span class=\"input-group-btn\">\r\n                    <a href=\"#/admin/entity-type/{{entityTypeListCtrl.routeParams.entityTypeParams}}/add\"\r\n                       class=\"btn btn-success\"><i\r\n                            class=\"fa fa-plus-circle\"\r\n                            aria-hidden=\"true\"></i> AJOUTER</a>\r\n                </span>\r\n            </div>\r\n            <br>\r\n            <table class=\"table table-bordered table-striped table-hover\">\r\n                <thead>\r\n                <tr class=\"warning\">\r\n                    <th>Libellé</th>\r\n                    <th>Code</th>\r\n                    <th class=\"text-center\">Date de création</th>\r\n                    <th class=\"text-center\">Dernière modification</th>\r\n                    <th class=\"text-center\">Action</th>\r\n                </tr>\r\n                </thead>\r\n                <tbody>\r\n                <tr ng-repeat=\"entityType in entityTypeListCtrl.entityTypes | filter : searchentityType | limitTo : entityTypeListCtrl.itemsPerPage : (entityTypeListCtrl.currentPage-1)*entityTypeListCtrl.itemsPerPage\">\r\n                    <td>{{entityType.label}}</td>\r\n                    <td>{{entityType.code}}</td>\r\n                    <td class=\"text-center\">{{entityType.createDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                    <td class=\"text-center\">{{entityType.updateDate | date:\'dd-MM-yyyy HH:mm:ss\'}}</td>\r\n                    <td class=\"text-center\">\r\n                        <button type=\"submit\" class=\"btn btn-sm btn-success fa fa-pencil-square-o\"\r\n                                title=\"Modifier\"\r\n                                ng-click=\"entityTypeListCtrl.prepareUpdateEntityType(entityType)\"></button>\r\n                        <button type=\"submit\" class=\"btn btn-sm btn-danger fa fa-trash-o\" title=\"Supprimer\"\r\n                                ng-click=\"entityTypeListCtrl.prepareDeleteEntityType(entityType)\"></button>\r\n                    </td>\r\n                </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n            <div class=\"main-pagination\">\r\n                <uib-pagination total-items=\"entityTypeListCtrl.entityTypes.length\"\r\n                                ng-model=\"entityTypeListCtrl.currentPage\" max-size=\"entityTypeListCtrl.maxSize\"\r\n                                class=\"pagination-sm\" rotate=\"false\" first-text=\"Premier\" last-text=\"Dernier\"\r\n                                previous-text=\"Précédent\"\r\n                                next-text=\"Suivant\" items-per-page=\"entityTypeListCtrl.itemsPerPage\">\r\n                </uib-pagination>\r\n            </div>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <!-- Modal to delete a envelope type -->\r\n    <div modal-show modal-visible=\"entityTypeListCtrl.openPopinConfirm\" class=\"modal fade\"\r\n         data-keyboard=\"false\" data-backdrop=\"static\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\">Confirmation</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <p>Êtes-vous sûr de vouloir supprimer définitivement le type d\'entité : <strong>{{entityTypeListCtrl.currentModel.label}}</strong>\r\n                    </p>\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\">Annuler</button>\r\n                    <button type=\"submit\" class=\"btn btn-success\" ng-click=\"entityTypeListCtrl.deleteEntityType()\">\r\n                        Valider\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/administration/entity-type/update/entity-type-update.html","<div id=\"page-wrapper\">\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n            <h2 class=\"page-header\"><i class=\"fa fa-list-alt\" aria-hidden=\"true\"></i> Ajout d\'un type d\'entité :\r\n                {{entityTypeUpdateCtrl.routeParams.entityTypeParams}}</h2>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n\r\n    <div class=\"row\">\r\n        <div class=\"col-lg-12\">\r\n\r\n            <form role=\"form_create\" class=\"form-horizontal\">\r\n                <div class=\"form-group\">\r\n                    <label for=\"label\" class=\"col-sm-2 control-label\">Code :</label>\r\n                    <div class=\"col-sm-10\">\r\n                        <input type=\"text\" ng-model=\"entityTypeUpdateCtrl.entityTypeModel.code\"\r\n                               class=\"form-control\" id=\"code\" required>\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                    <div class=\"col-sm-10\">\r\n                        <input type=\"text\" ng-model=\"entityTypeUpdateCtrl.entityTypeModel.label\"\r\n                               class=\"form-control\" id=\"label\" required>\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <label for=\"label\" class=\"col-sm-2 control-label\">Activé :</label>\r\n                    <div class=\"col-sm-10\">\r\n                        <input type=\"checkbox\" ng-model=\"entityTypeUpdateCtrl.entityTypeModel.enabled\"\r\n                               class=\"form-control\" id=\"enabled\">\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group\">\r\n                    <button type=\"submit\" class=\"btn btn-success\"\r\n                            ng-disabled=\"!entityTypeUpdateCtrl.isFilled()\"\r\n                            ng-click=\"entityTypeUpdateCtrl.updateEntityType()\">Valider\r\n                    </button>\r\n                    <a href=\"#/admin/entity-type/{{entityTypeUpdateCtrl.routeParams.entityTypeParams}}\"\r\n                       class=\"btn btn-danger\">Annuler</a>\r\n                </div>\r\n            </form>\r\n        </div>\r\n        <!-- /.col-lg-12 -->\r\n    </div>\r\n    <!-- /.row -->\r\n</div>\r\n<!-- /#page-wrapper -->");
$templateCache.put("components/administration/indexes/delete-index-modal/admin-delete-indexes-modal.html","<!-- Modal to delete an index -->\r\n        <!-- Modal content-->\r\n        <div class=\"modal-content\">\r\n            <div class=\"modal-header\">\r\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                <h4 class=\"modal-title\">Confirmation</h4>\r\n            </div>\r\n            <div class=\"modal-body\">\r\n                <p>Êtes-vous sûr de vouloir supprimer définitivement l\'index : <strong>{{modalDeleteIndexesCtrl.simpleIndex.label}}</strong></p>\r\n            </div>\r\n            <div class=\"modal-footer\">\r\n                <button type=\"submit\" class=\"btn btn-danger\" data-dismiss=\"modal\" ng-click=\"modalDeleteIndexesCtrl.cancel()\">Annuler</button>\r\n                <button type=\"submit\" class=\"btn btn-success\" ng-click=\"modalDeleteIndexesCtrl.ok()\">Valider</button>\r\n            </div>\r\n        </div>\r\n");
$templateCache.put("components/administration/indexes/upadd-admin-index-modal/upadd-admin-indexes-modal.html","<!-- Modal to update an index -->\r\n        <div class=\"modal-content\" ng-controller=\"AdminIndexesController as adminIndexesController\">\r\n            <div class=\"modal-header\">\r\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" ng-click=\"modalUpAddIndexesCtrl.cancel()\">&times;</button>\r\n                <h4 class=\"modal-title\"> <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i> Modifier l\'index </h4>\r\n            </div>\r\n            <form role=\"form_create\" class=\"form-horizontal\">\r\n                <div class=\"modal-body\">\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"label\" class=\"col-sm-2 control-label\">Libellé :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"text\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.label\" class=\"form-control\" id=\"label\" required>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"code\" class=\"col-sm-2 control-label\">Code :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"text\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.code\" class=\"form-control\" id=\"code\" required>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"type\" class=\"col-sm-2 control-label\">type :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <select ng-options=\"type.id as type.label for type in modalUpAddIndexesCtrl.indexTypes\"\r\n                                    ng-model=\"modalUpAddIndexesCtrl.simpleIndex.indexType.id\"\r\n                                    class=\"form-control\" id=\"type\"\r\n                                    ng-change=\"modalUpAddIndexesCtrl.updateIndexType(modalUpAddIndexesCtrl.simpleIndex)\"\r\n                                    required></select>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\" ng-if=\"modalUpAddIndexesCtrl.simpleIndex.indexType.code ===\'list\'\">\r\n                        <label for=\"dropdown\" class=\"col-sm-2 control-label\">Liste de valeurs :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <select ng-options=\"dropdown.id as dropdown.label for dropdown in modalUpAddIndexesCtrl.dropdowns\"\r\n                                    ng-model=\"modalUpAddIndexesCtrl.simpleIndex.dropdown.id\"\r\n                                    class=\"form-control\" id=\"dropdown\"\r\n                                    ng-change=\"modalUpAddIndexesCtrl.updateIndexDropdown(modalUpAddIndexesCtrl.simpleIndex)\"\r\n                                    required></select>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"reference\" class=\"col-sm-2 control-label\">Référentiel code :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"text\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.reference\" class=\"form-control\" id=\"reference\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"xpath\" class=\"col-sm-2 control-label\">Xpath :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"text\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.xpath\" class=\"form-control\" id=\"xpath\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"displayOrder\" class=\"col-sm-2 control-label\">Ordre d\'affichage :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"number\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.displayOrder\" class=\"form-control\" id=\"displayOrder\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"maxLength\" class=\"col-sm-2 control-label\">Longueur maximale :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"number\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.maxLength\" class=\"form-control\" id=\"maxLength\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"minLength\" class=\"col-sm-2 control-label\">Longeur minimale :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"number\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.minLength\" class=\"form-control\" id=\"minLength\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"prefix\" class=\"col-sm-2 control-label\">Prefix :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"text\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.prefix\" class=\"form-control\" id=\"prefix\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"form-group\">\r\n                        <label for=\"Regex\" class=\"col-sm-2 control-label\">Règle :</label>\r\n                        <div class=\"col-sm-10\">\r\n                            <input type=\"text\" ng-model=\"modalUpAddIndexesCtrl.simpleIndex.regex\" class=\"form-control\" id=\"regex\" placeholder=\"Exemple: ^[a-zA-Z]*$\">\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"alert alert-danger\" role=\"alert\" ng-show=\"!modalUpAddIndexesCtrl.checkRegexValidity(modalUpAddIndexesCtrl.simpleIndex.regex)\">\r\n                        <p> Règle\r\n                            Invalide </p>\r\n                    </div>\r\n\r\n                </div>\r\n                <!-- ./panel-body -->\r\n                <div class=\"panel-footer text-right\">\r\n                    <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" ng-click=\"modalUpAddIndexesCtrl.cancel()\">Annuler</button>\r\n                    <button type=\"button\" class=\"btn btn-success\" ng-disabled=\"!modalUpAddIndexesCtrl.isIndexFilled(modalUpAddIndexesCtrl.simpleIndex)\" ng-click=\"modalUpAddIndexesCtrl.ok()\">valider</button>\r\n                </div>\r\n                <!-- ./panel-footer -->\r\n            </form>\r\n        </div>");}]);