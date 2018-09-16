module arvato.demat.services {
    "use strict";

    export class AdminTrayService extends GenericService {

        constructor(protected http: ng.IHttpService, protected q: ng.IQService, protected appSharedService: services.AppSharedService) {
            super(http, q, appSharedService);
        }

        /**
         * Load all trays
         */
        public loadTrays(): ng.IPromise<models.ITray[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.ITray[]>(this.httpAddress + "/admin/trays").success((data: models.ITray[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading trays');
            });
            return deferred.promise;
        }

        /**
         * Load all tray types
         */
        public loadTrayTypes(): ng.IPromise<models.ITrayType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.ITrayType[]>(this.httpAddress + "/admin/trays/types").success((data: models.ITrayType[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading tray types');
            });
            return deferred.promise;
        }

        /**
         * Load all tray types
         */
        public loadStructuralEntityType(): ng.IPromise<models.IStructuralEntityType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IStructuralEntityType[]>(this.httpAddress + "/admin/structuralEntityTypes").success((data: models.IStructuralEntityType[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading tray types');
            });
            return deferred.promise;
        }

        /**
         * Load all tray reject types
         */
        public loadAllTrayRejectTypes(): ng.IPromise<models.IRejectType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IRejectType[]>(this.httpAddress + "/admin/trays/rejectTypes").success((data: models.IRejectType[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading tray types');
            });
            return deferred.promise;
        }

        /**
         * Load reject types  for the tray in parameters
         */
        public loadTrayRejectTypes(trayId: number): ng.IPromise<models.IRejectType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IRejectType[]>(this.httpAddress + "/admin/trays/" + trayId + "/rejectTypes").success((data: models.IRejectType[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading reject types for tray id :" + trayId);
            });
            return deferred.promise;
        }

        /**
         * Update or create user roles
         */
        public updateOrCreateTrayRejects(trayId: number, trayRejects: models.IRejectType[]) {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/admin/trays/" + trayId + "/rejectTypes", trayRejects).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when updating tray reject types");
            });
            return deferred.promise;
        }

        /**
         * Create new tray
         */
        public createTray(tray: models.ITray): ng.IPromise<models.ITray> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.ITray>(this.httpAddress + "/admin/trays", tray).success((result: models.ITray) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating new tray');
            });
            return deferred.promise;
        }

        /**
         * Update tray
         */
        public updateTray(tray: models.ITray): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.ITray>(this.httpAddress + "/admin/trays", tray).success((result: models.ITray) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating tray id ' + tray.id);
            });
            return deferred.promise;
        }

        /**
         * delete tray
         */
        public deleteTray(trayId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete<number>(this.httpAddress + "/admin/trays/" + trayId).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when deleting tray id' + trayId);
            });
            return deferred.promise;
        }

        /**
         * load all document types
         */
        public loadAllDocTypes(): ng.IPromise<models.IDocumentType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IDocumentType[]>(this.httpAddress + "/documents/types").success((result: models.IDocumentType[]) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading all documents types');
            });
            return deferred.promise;
        }

        /**
         * load all envelope types
         */
        public loadAllEnvTypes(): ng.IPromise<models.IEnvType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvType[]>(this.httpAddress + "/admin/trays/envTypes").success((result: models.IEnvType[]) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading all envelopes types');
            });
            return deferred.promise;
        }

        /**
         * load envlope types by tray
         */
        public loadEnvTypes(idTray: number): ng.IPromise<models.IEnvType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvType[]>(this.httpAddress + "/admin/trays/" + idTray + "/envTypes").success((result: models.IEnvType[]) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading envelopes types for tray id : ' + idTray);
            });
            return deferred.promise;
        }

        /**
         * update tray document types
         */
        public updateTrayDocTypes(trayId: number, docTypes: models.IDocumentType[]): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.IDocumentType[]>(this.httpAddress + "/admin/trays/" + trayId + "/docTypes", docTypes).success((result: any) => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating tray document types');
            });
            return deferred.promise;
        }

        /**
         * update tray document types
         */
        public updateTrayEnvTypes(trayId: number, envTypes: models.IEnvType[]): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.IDocumentType[]>(this.httpAddress + "/admin/trays/" + trayId + "/envTypes", envTypes).success((result: any) => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating tray envelope types');
            });
            return deferred.promise;
        }

        /**
         * Load all tray roles
         */
        public loadAllTrayRoles(): ng.IPromise<models.IRole[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IRole[]>(this.httpAddress + "/trays/roles").success((data: models.IRole[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading users roles');
            });
            return deferred.promise;
        }

        /**
         * Update or create user roles
         */
        public updateOrCreateTrayRoles(trayId: number, trayRoles: models.IRole[]) {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/trays/" + trayId + "/roles", trayRoles).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when updating user roles");
            });
            return deferred.promise;
        }

        /**
         * Load tray indexes
         */
        public loadTrayIndexes(trayId: number): ng.IPromise<models.IIndex[]> {
            var deferred = this.q.defer();
            this.http.get<models.IIndex[]>(this.httpAddress + "/trays/" + trayId + "/indexes").success((data: models.IIndex[]) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading indexes for tray id :" + trayId);
            });

            return deferred.promise;
        }

        /**
         * Update or create tray indexes
         */
        public updateOrCreateTrayIndexes(trayId: number, indexes: models.IIndex[]) {
            var deferred = this.q.defer();
            this.http.put<models.IIndex[]>(this.httpAddress + "/trays/" + trayId + "/indexes", indexes).success((data: models.IIndex[]) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when updating indexes for tray id :" + trayId);
            });

            return deferred.promise;
        }

        /**
         * Save default tray
         */
        public saveDefaultTray(trayId: number): ng.IPromise<boolean> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<any>(this.httpAddress + "/admin/trays/default", trayId).success((data: any) => {
                deferred.resolve(true);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when updating default tray");
            });
            return deferred.promise;
        }

        /**
         * Save trays priority
         */
        public saveTraysPriority(traysId: number[]): ng.IPromise<boolean> {
            var deferred = this.q.defer();
            this.http.put<any>(this.httpAddress + "/admin/trays/order", traysId).success((data: any) => {
                deferred.resolve(true);
            }).catch((error: any) => {
                deferred.reject("problem occured when updating trays priority");
            });
            return deferred.promise;
        }

        /**
         * Save trays priority
         */
        public loadTraysCriterion(): ng.IPromise<models.IEnvSearchType[]> {
            var deferred = this.q.defer();
            this.http.get<models.IEnvSearchType[]>(this.httpAddress + "/admin/trays/envSearchcriterion").success((data: models.IEnvSearchType[]) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject("problem occured when loading envelope search criterion");
            });
            return deferred.promise;
        }

    }

    app.service('AdminTrayService', AdminTrayService);
}
