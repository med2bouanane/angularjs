module arvato.demat.services {
    "use strict";

    export class EnvelopeService {

        static $inject: string[] = ["$http", "$q", "AppSharedService", "$filter"];

        private httpAddress: string = "##URL_REST##";

        constructor(private http: ng.IHttpService, private q: ng.IQService, private appSharedService: services.AppSharedService, private filter: ng.IFilterService) {
        }

        /**
         * load envelope by batch
         */
        public findEnvelopes(batchId: number): ng.IPromise<models.IEnvelope[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvelope[]>(this.httpAddress + "/batches/" + batchId + "/envelopes").success((envelopes: models.IEnvelope[]) => {
                this.appSharedService.closeLoading();
                deferred.resolve(envelopes);
            }).catch((error: any) => {
                deferred.reject("problem occured when find envelopes");
            });
            return deferred.promise;
        }

    }

    app.service("EnvelopeService", EnvelopeService);
}
