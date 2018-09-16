module arvato.demat.services {
    "use strict";

    export class HomeService extends GenericService {

        constructor(protected http: ng.IHttpService, protected q: ng.IQService, protected appSharedService: services.AppSharedService) {
            super(http, q, appSharedService);
        }

        /**
         * load dashboard data
         */
        public loadDashbordData(): ng.IPromise<models.IDashboard> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get(this.httpAddress + "/dashboard").success((data: models.IDashboard) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading data for dashboard");
            });
            return deferred.promise;
        }


        /**
         * Load number of treated envelope and cadence by tray and action for the current user
         */
        public loadTreatedByActionData(): ng.IPromise<models.ITrayByStep[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get(this.httpAddress + "/dashboard/treatedAndTimeSpent").success((data: models.ITrayByStep[]) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading nb treated task and cadence");
            });
            return deferred.promise;
        }
    }

    app.service("HomeService", HomeService);
}