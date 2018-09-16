module arvato.demat.services {
    "use strict";

    export class DropdownService {

        static $inject: string[] = ["$http", "AppSharedService", "$q"];

        private httpAddress: string = "##URL_REST_ADMIN##";

        constructor(private http: ng.IHttpService, private appSharedService: services.AppSharedService, private q: ng.IQService) {

        }

        /**
         * Load dropdowns
         */
        public loadDropdowns(entitySimple: string): angular.IPromise<arvato.demat.models.IDropdown[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IDropdown[]>(this.httpAddress + "/admin/entity-type/" + entitySimple).success((data: models.IDropdown[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                let reason = 'problem occured when loading dropdowns';
                this.appSharedService.notifyErrorWithObjectError(reason, error);
                deferred.reject(reason);
            });
            // @ts-ignore
            return deferred.promise;
        }
    }

    app.service('DropdownService', DropdownService);
}