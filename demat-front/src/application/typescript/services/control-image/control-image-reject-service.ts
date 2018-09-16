module arvato.demat.services.controlimage {
    "use strict";

    export class ControlImageRejectService {

        static $inject: string[] = ["$http", "$q", "AppSharedService", "$filter"];

        private httpAddress: string = "##URL_REST##";

        constructor(private http: ng.IHttpService, private q: ng.IQService, private appSharedService: services.AppSharedService, private filter: ng.IFilterService) {
        }

        /**
         * recupère les batchs en fonction de la corbeille de controle image de rejet
         */
        public loadBatchs(trayId: number, search: models.controlimage.IRecherche): ng.IPromise<models.controlimage.IBatchSearch> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.controlimage.IBatchSearch>(this.httpAddress + "/control-image/reject/" + trayId, search).success((data: models.controlimage.IBatchSearch) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading batchs : " + trayId);
            });
            return deferred.promise;
        }
    }

    app.service("ControlImageRejectService", ControlImageRejectService);
}
