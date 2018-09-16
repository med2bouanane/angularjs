module arvato.demat.controller {
    "use strict";

    /* export class LoginController {
 
         static $inject: string[] = ["AuthSharedService"];
 
         private rememberMe: boolean = true;
         private username: string;
         private password: string;
 
         private authenticationError: boolean;
 
         constructor(private authSharedService: services.AuthSharedService) {
         }
 
         public login() {
             this.authenticationError = false;
             this.authSharedService.login(this.username, this.password, this.rememberMe);
         }
     }
 
     app.controller("LoginController", LoginController);*/
    app.controller('LoginController', function ($rootScope, $scope, AuthSharedService) {
        $scope.rememberMe = true;
        $scope.login = function () {
            $rootScope.authenticationError = false;
            AuthSharedService.login(
                $scope.username,
                $scope.password,
                $scope.rememberMe
            );
        }
    })
}