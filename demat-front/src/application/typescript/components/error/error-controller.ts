module arvato.demat.controller {
    "use strict";

    import IError = arvato.demat.models.IError;

    interface routeParamsError extends ng.route.IRouteParamsService {
        code: string;
    }

    export class ErrorController {

        static $inject: string[] = ["$routeParams", "AppSharedService"];

        private code: string;
        private message: string;
        private error: string;
        private errorObject: IError;

        constructor(private routeParams: routeParamsError, private appSharedService: services.AppSharedService) {

            this.code = routeParams.code;

            switch (routeParams.code) {
                case '403':
                    this.message = "Oops! Vous êtes arrivé à une page non autorisée.."
                    break;
                case '404':
                    this.message = "Page non trouvée."
                    break;
                default:
                    this.code = '500';
                    this.message = "Oops! erreur inattendue"
                    this.error = appSharedService.getError();
                    this.errorObject = appSharedService.getErrorObject();
            }
        }
    }

    app.controller("ErrorController", ErrorController);
}