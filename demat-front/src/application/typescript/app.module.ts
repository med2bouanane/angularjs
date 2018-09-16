module arvato.demat {
    "use strict";
    //inject module
    export var app: ng.IModule = angular.module('my-demat-portail', ['ngResource', 'ngRoute', 'ui.bootstrap', 'CanvasViewer', 'http-auth-interceptor', 'angularSpinner', 'ui.uploader', 'ui.sortable', 'chart.js', 'cfp.hotkeys', 'ui.select','ui.tree']);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);

    app.config(function (hotkeysProvider) {
        hotkeysProvider.template = '<div ng-show="helpVisible" class="cfp-hotkeys-container fade ng-scope in" ng-class="{in: helpVisible}"><div class="cfp-hotkeys"><h4 class="cfp-hotkeys-title ng-binding">Les raccourcis clavier:</h4><table><tbody><tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }" class="ng-scope"><td class="cfp-hotkeys-keys"><span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key ng-scope ng-binding">{{key}}</span></td><td class="cfp-hotkeys-text ng-binding">{{hotkey.description}}</td></tr></tbody></table><div class="cfp-hotkeys-close" ng-click="helpVisible = false">×</div></div></div>'
    });

    app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
        usSpinnerConfigProvider.setTheme('bigBlue', { color: 'blue', radius: 20 });
        usSpinnerConfigProvider.setTheme('smallRed', { color: 'red', radius: 6 });
    }]);

    app.run(function ($rootScope, $location, $http, AuthSharedService, Session, USER_ROLES, $q, $timeout) {

        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (next.originalPath === "/login" && $rootScope.authenticated) {
                event.preventDefault();
            } else if (next.access && next.access.loginRequired && !$rootScope.authenticated) {
                event.preventDefault();
                $rootScope.$broadcast("event:auth-loginRequired", {});
            } else if (next.access && !AuthSharedService.isAuthorized(next.access.authorizedRoles)) {
                event.preventDefault();
                $rootScope.$broadcast("event:auth-forbidden", {});
            }
        });

        $rootScope.$on('$routeChangeSuccess', function (scope, next, current) {
            $rootScope.$evalAsync(function () {
                // $.material.init();
            });
        });

        // Call when the the client is confirmed
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

        // Call when the 401 response is returned by the server
        $rootScope.$on('event:auth-loginRequired', function (event, data) {
            if ($rootScope.loadingAccount && data.status !== 401) {
                $rootScope.requestedUrl = $location.path()
                $location.path('/loading');
            } else {
                Session.invalidate();
                $rootScope.authenticated = false;
                $rootScope.loadingAccount = false;
                $location.path('/login');
            }
        });

        // Call when the 403 response is returned by the server
        $rootScope.$on('event:auth-forbidden', function (rejection) {
            $rootScope.$evalAsync(function () {
                $location.path('/error/403').replace();
            });
        });

        // Call when the user logs out
        $rootScope.$on('event:auth-loginCancelled', function () {
            $location.path('/login').replace();
        });

        // Get already authenticated user account
        AuthSharedService.getAccount();
    });
}