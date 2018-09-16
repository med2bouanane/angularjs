module arvato.demat.services {
    "use strict";

    export class GenericService {

        static $inject: string[] = ["$http", "$q", "AppSharedService"];

        protected httpAddress: string = "##URL_REST##";
        protected endPointAdmin: string = "##URL_REST_ADMIN##";


        constructor(protected http: ng.IHttpService, protected q: ng.IQService, protected appSharedService: services.AppSharedService) {
        }
    }
}
