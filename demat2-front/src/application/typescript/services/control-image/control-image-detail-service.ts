module arvato.demat.services.controlimage {
    "use strict";

    export class ControlImageDetailService {

        
        static $inject: string[] = ["$http", "$q", "AppSharedService", "$filter"];

        private httpAddress: string = "##URL_REST##";

        constructor(private http: ng.IHttpService, 
            private q: ng.IQService, 
            private appSharedService: services.AppSharedService, 
            private filter: ng.IFilterService) {
        }

        public loadBatch(batchId:number, trayId:number): ng.IPromise<models.controlimage.IBatchTree> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.controlimage.IBatchSearch>(this.httpAddress + "/control-image/detail/" + batchId + "/tray/" + trayId)
            .success((data: models.controlimage.IBatchSearch) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading batchs : " + batchId);
            });
            return deferred.promise;
        }

        public validateEnvelope(envelope:models.controlimage.IEnvelope): ng.IPromise<models.controlimage.IEnvelope>{
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.controlimage.IEnvelope>(this.httpAddress + "/control-image/detail/envelope/validate",envelope)
            .success((data: models.controlimage.IEnvelope) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when save envelope");
            });
            return deferred.promise;
        }

        public saveEnvelope(envelope:models.controlimage.IEnvelope):ng.IPromise<models.controlimage.IEnvelope>{
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.controlimage.IEnvelope>(this.httpAddress + "/control-image/detail/envelope",envelope)
            .success((data: models.controlimage.IEnvelope) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when save page");
            });
            return deferred.promise;
        }

        public saveDocument(document:models.controlimage.IDocument):ng.IPromise<models.controlimage.IDocument>{
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.controlimage.IDocument>(this.httpAddress + "/control-image/detail/document",document)
            .success((data: models.controlimage.IDocument) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when save page");
            });
            return deferred.promise;
        }

        public savePage(page:models.controlimage.IPage):ng.IPromise<models.controlimage.IPage>{
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.controlimage.IPage>(this.httpAddress + "/control-image/detail/page",page)
            .success((data: models.controlimage.IPage) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when save page");
            });
            return deferred.promise;
        }

        /**
         * recupere les id des enveloppes qui doivent etre affichés
         */
        public getEnvelopeUnlockedByTrayAndBatch(batchId:number, trayId:number): ng.IPromise<Array<number>>{
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<Array<number>>(this.httpAddress + "/control-image/detail/"+batchId +"/tray/"+trayId+"/envelopes/unlocked").success((data: Array<number>) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading batchs : " + trayId);
            });
            return deferred.promise;
        }

        /**
         * print batch
         */
        public printBatch(batchId: number): ng.IPromise<models.IResponse> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get(this.httpAddress + "/exchange/export/batch/" + batchId + "/pdf", {responseType: 'arraybuffer'}).success((data: models.IResponse) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when exporting batch into pdf file');
            });
            return deferred.promise;
        }        
    }

    app.service("ControlImageDetailService", ControlImageDetailService);
}
