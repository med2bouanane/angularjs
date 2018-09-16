module arvato.demat.services {
    "use strict";
/*
    export class AuthSharedService {

        static $inject: string[] = ["$http", "$rootScope", "authService", "Session"];

        constructor(private http: ng.IHttpService, private rootScope: ng.IRootScopeService, private session: services.Session) {
        }

        public login(userName, password, rememberMe) {
            var config = {
                params: {
                    username: userName,
                    password: password,
                    rememberme: rememberMe
                },
                ignoreAuthModule: 'ignoreAuthModule'
            };
            this.http.post('authenticate', '', config)
                .success(function (data, status, headers, config) {
                    this.authService.loginConfirmed(data);
                }).error(function (data, status, headers, config) {
                    this.rootScope.authenticationError = true;
                    this.session.invalidate();
                });
        }
    }

    app.service("AuthSharedService", AuthSharedService);*/
}