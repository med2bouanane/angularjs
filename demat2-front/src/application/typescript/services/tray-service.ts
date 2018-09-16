module arvato.demat.services {
    "use strict";

    export class TrayService {

        static $inject: string[] = ["$http", "$q", "AppSharedService", "$filter"];

        private httpAddress: string = "##URL_REST##";

        public docIndexes: models.IIndex[];

        public envelopeIndexes: models.IIndex[];

        public rejectIndexes: models.IIndex[];

        public docTypes: models.IDocumentType[];

        public envTypes: models.IEnvType[];

        public rejectTypes: models.IRejectType[];

        // differents reject type by structural entity type
        public rejectTypesByBatch: models.IRejectType[];

        public rejectTypesByEnvelope: models.IRejectType[];

        public currentTray: models.ITray;

        public trays: models.ITrayNavigation[] = [];

        constructor(private http: ng.IHttpService, private q: ng.IQService, private appSharedService: services.AppSharedService, private filter: ng.IFilterService) {
        }

        public loadTrays(): ng.IPromise<models.ITrayNavigation[]> {

            var deferred = this.q.defer();
            this.http.get<models.ITrayNavigation[]>(this.httpAddress + "/trays").success((data: models.ITrayNavigation[]) => {
                deferred.resolve(data);

                // clean trays 
                this.trays.length = 0;
                // refresh trays
                this.trays.push.apply(this.trays, data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading trays");
            });

            return deferred.promise;
        }

        /**
         * Load tray by id
         */
        public loadTray(trayId: number): ng.IPromise<models.ITray> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.ITray>(this.httpAddress + "/trays/" + trayId).success((data: models.ITray) => {
                this.currentTray = data;
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading tray id : " + trayId);
            });
            return deferred.promise;
        }
        /**
         * Load tray detail by id
         */
        public loadTrayDetail(trayId: number): ng.IPromise<models.ITrayDetail> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.ITrayDetail>(this.httpAddress + "/trays/" + trayId + "/detail").success((data: models.ITrayDetail) => {
                this.currentTray = data;
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading tray id : " + trayId);
            });
            return deferred.promise;
        }
        /**
         * Load all envelopes by tray id
         */
        /*public loadEnvelopes(trayId: number): ng.IPromise<models.IEnvelope[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvelope[]>(this.httpAddress + "/trays/" + trayId + "/envelopes").success((data: models.IEnvelope[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading envelopes for tray id :" + trayId);
            });
            return deferred.promise;
    }*/

        /**
         * Load envelopes by tray id and page
         */

        /*public loadEnvelopesPerPage(trayId: number, pageId: number, itemsPerPage: number): ng.IPromise<models.IEnvelope[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvelope[]>(this.httpAddress + "/trays/" + trayId + "/pages/" + pageId + "/nbElements/" + itemsPerPage).success((data: models.IEnvelope[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading envelopes for tray id :" + trayId + " and pageId =" + pageId);
            });
            return deferred.promise;
    }*/

        /**
         * Load envelopes by criteria
         */
        public loadEnvelopes(trayId: number, search: models.IRecherche): ng.IPromise<models.IEnvelopeSearch> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IEnvelopeSearch>(this.httpAddress + "/trays/" + trayId + "/criteria", search).success((data: models.IEnvelopeSearch) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading envelopes for tray id :" + trayId + " and envelopeId =" + search.envelopeId + " and batchId =" + search.batchId);
            });
            return deferred.promise;
        }

        /**
         * Load document types for the tray in parameters
         */
        public loadDocTypes(trayId: number): void {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IDocumentType[]>(this.httpAddress + "/trays/" + trayId + "/docTypes").success((data: models.IDocumentType[]) => {
                this.docTypes = data;
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading document types for tray id :" + trayId);
            });
        }

        /**
         * Load envelope types for the tray in parameters
         */
        public loadEnvelopeTypes(trayId: number): void {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvType[]>(this.httpAddress + "/trays/" + trayId + "/envelopeTypes").success((data: models.IEnvType[]) => {
                this.envTypes = data;
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading envelope types for tray id :" + trayId);
            });
        }

        /**
         * Load reject types  for the tray in parameters
         */
        public loadRejectTypes(trayId: number): void {
            //this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IRejectType[]>(this.httpAddress + "/trays/" + trayId + "/rejectTypes").success((data: models.IRejectType[]) => {
                this.rejectTypes = data;
                //this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading reject types for tray id :" + trayId);
            });
        }

        /**
         * Load reject types for the tray in parameters
         */
        public loadRejectTypesByStructuralEntityType(trayId: number, codeStructuralEntityType: string): ng.IPromise<models.IRejectType[]> {
            var deferred = this.q.defer();
            this.http.get<models.IRejectType[]>(this.httpAddress + "/trays/" + trayId + "/rejectTypes/" + codeStructuralEntityType).success((data: models.IRejectType[]) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading BATCH reject types for tray id :" + trayId);
            });
            return deferred.promise;
        }

        /**
         * Load next envelope to treat for a gvien tray id
         */
        public getNextEnvelope(trayId: number): ng.IPromise<number> {
            var deferred = this.q.defer();
            this.http.get<number>(this.httpAddress + "/trays/" + trayId + "/envelope").success((data: number) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading next envelope of tray id :" + trayId);
            });
            return deferred.promise;
        }

        /**
         * Change envelope tray
         */
        public changeEnvelopeTray(envelopeId: number, trayId: number): ng.IPromise<models.ITray> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.ITray>(this.httpAddress + "/envelopes/" + envelopeId + "/tray", trayId).success((tray: any) => {
                this.appSharedService.closeLoading();
                deferred.resolve(tray);
            }).catch((error: any) => {
                deferred.reject("problem occured when changing envelope tray to tray id: " + trayId);
            });
            return deferred.promise;
        }

        /**
         * Load envelope by id
         */
        public loadEnvelope(envelopeId: number): ng.IPromise<models.IEnvelope> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvelope>(this.httpAddress + "/envelopes/" + envelopeId).success((data: models.IEnvelope) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading envelope id :" + envelopeId);
            });
            return deferred.promise;
        }

        /**
         * Load l'arbre d'une envelope by id (TODO : Rendre cette arbre chargeable pour n'importe quel niveau
         */
        public loadEnvelopeTree(envelopeId: number): ng.IPromise<models.INode> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.INode>(this.httpAddress + "/envelopes/" + envelopeId + "/tree").success((data: models.INode) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading envelope id :" + envelopeId);
            });
            return deferred.promise;
        }

        /**
         * Index envelope
         */
        public indexEnvelope(envelopeId: number, envelope: models.IEnvelope): ng.IPromise<models.ITray> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/index", envelope).success((data: any) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when index envelope");
            });
            return deferred.promise;
        }

        /**
         * Validate/invalidated envelope quality control
         */
        public validateQualityControl(envelopeId: number, isValidated: boolean): ng.IPromise<models.ITray> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/qualityControl", isValidated).success((data: any) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when validating quality control envelope");
            });
            return deferred.promise;
        }

        /**
         * Reject envelope
         */
        public rejectEnvelope(envelopeId: number, trayId: number, rejectId: number, comment: string): ng.IPromise<models.ITray> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/tray/" + trayId + "/reject/" + rejectId, comment).success((data: any) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when reject an envelope");
            });
            return deferred.promise;
        }

        /**
         * Classify envelope
         */
        public classifyEnvelope(envelopeId: number, documents: models.IDocument[]): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/classify", documents).success((data: any) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when classify envelope");
            });
            return deferred.promise;
        }

        /**
         * Quit envelope
         */
        public quitEnvelope(envelopeId: number, comment: string): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post(this.httpAddress + "/envelopes/" + envelopeId + "/quit", comment).success((data: any) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when quit envelope");
            });
            return deferred.promise;
        }

        /**
         * change envelope status
         */
        public changeEnvelopeStatus(envelopeId: number, newStatus: string): ng.IPromise<models.IResponse> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/envelopes/" + envelopeId + "/status", newStatus).success((data: any) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when change envelope status");
            });
            return deferred.promise;
        }

        /**
         * Save rotate image
         */
        public saveRotateImage(imageSave: models.IImageSave): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/image/rotate", imageSave).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when saving image rotation");
            });
            return deferred.promise;
        }

        /**
         * Load referencial indexes from referencial
         */
        public loadRefIndexes(key: models.IReferentialRequest): ng.IPromise<models.IReferentialIndex[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post(this.httpAddress + "/referential/search", key).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading referential indexes");
            });
            return deferred.promise;
        }

        /**
         * Export envelope images into pdf file
         */
        public exportEnvelopePdf(envelopeId: number): ng.IPromise<models.IResponse> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get(this.httpAddress + "/exchange/export/envelope/" + envelopeId + "/pdf", {responseType: 'arraybuffer'}).success((data: models.IResponse) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when exporting envelope into pdf file');
            });
            return deferred.promise;
        }

        /**
         * load envelope historics
         */
        public loadEnvelopeHistorics(envelopeId: number): ng.IPromise<models.IEnvelopeHistoric[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvelopeHistoric[]>(this.httpAddress + "/envelopes/" + envelopeId + "/historics").success((historics: models.IEnvelopeHistoric[]) => {
                this.appSharedService.closeLoading();
                deferred.resolve(historics);
            }).catch((error: any) => {
                deferred.reject("problem occured when load envelope historics");
            });
            return deferred.promise;
        }

        /**
         * load batch historics
         */
        public loadBatchHistorics(batchId: number): ng.IPromise<models.IBatchHistoric[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IBatchHistoric[]>(this.httpAddress + "/batches/" + batchId + "/historics").success((historics: models.IBatchHistoric[]) => {
                this.appSharedService.closeLoading();
                deferred.resolve(historics);
            }).catch((error: any) => {
                deferred.reject("problem occured when load batch historics");
            });
            return deferred.promise;
        }

        /**
         * delete batch
         */
        public deleteBatch(batchId: number, comment: string): ng.IPromise<models.IBatchHistoric> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<any>(this.httpAddress + "/batches/" + batchId, comment).success((data: any) => {
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when delete batch");
            });
            return deferred.promise;
        }
    }

    app.service("TrayService", TrayService);
}
