module arvato.demat.services {
    "use strict";

    app.service('AuthSharedService', function ($rootScope, $http, $resource, authService, Session) {
        return {
            login: function (userName, password, rememberMe) {
                var config = {
                    params: {
                        username: userName,
                        password: password,
                        rememberme: rememberMe
                    },
                    ignoreAuthModule: 'ignoreAuthModule'
                    /* headers: {
                         'Content-Type': 'text/plain'
                     }*/
                };
                $http.post('##URL_REST##/authenticate', '', config)
                    .success(function (data, status, headers, config) {
                        authService.loginConfirmed(data);
                    }).error(function (data, status, headers, config) {
                        $rootScope.authenticationError = true;
                        Session.invalidate();
                    });
            },
            getAccount: function () {
                $rootScope.loadingAccount = true;
                $http.get('##URL_REST##/security/account')
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
                $http.get('##URL_REST##/logout');
                Session.invalidate();
                authService.loginCancelled();
            }
        };
    });

    /*interface AuthSharedRootScope extends ng.IRootScopeService {
        loadingAccount: boolean;
        authenticationError: boolean;
        authenticated: boolean;

        account: any;
    }
    export class AuthSharedService {

        static $inject: string[] = ["$http", "$q", "authService", "$rootScope"];

        private httpAddress: string = "##URL_REST##";

        constructor(private $http: ng.IHttpService, private q: ng.IQService, private authService, private $rootScope: AuthSharedRootScope) {
        }

        public login(userName: string, password: string, rememberMe: boolean): void {
            var config = {
                params: {
                    username: userName,
                    password: password,
                    rememberme: rememberMe
                },
                ignoreAuthModule: 'ignoreAuthModule',
                headers : {
                    'Content-Type': 'text/plain'
                }
            };

            this.$http.post(this.httpAddress + '/authenticate', '',config)
            
                .success(function (data, status, headers, config) {
                    this.authService.loginConfirmed(data);
                }).error(function (data, status, headers, config) {
                    this.$rootScope.authenticationError = true;
                    Session.invalidate();
                });
        }

        public getAccount() {
            this.$rootScope.loadingAccount = true;
            this.$http.get('http://localhost:8080/demat/security/account')
                .then(function (response) {
                    this.authService.loginConfirmed(response.data);
                });
        }

        public isAuthorized(authorizedRoles: any) {
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
        }

        public logout(): void {
            this.$rootScope.authenticationError = false;
            this.$rootScope.authenticated = false;
            this.$rootScope.account = null;
            this.$http.get('logout');
            //Session.invalidate();
            this.authService.loginCancelled();
        }
    }

    app.service('AuthSharedService', AuthSharedService);*/
}


