module arvato.demat.services {
    "use strict";

    export class AdminIndexService extends GenericService {

        constructor(protected http: ng.IHttpService, protected q: ng.IQService, protected appSharedService: services.AppSharedService) {
            super(http, q, appSharedService);
        }

        /**
         * Load indexes by id
         */
        public getIndexById(indexId: string): ng.IPromise<models.ISimpleIndexAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            var url = this.endPointAdmin + "/admin/indexes/simples/"+indexId;
                this.http.get<models.ISimpleIndexAdmin>(url).success((data: models.ISimpleIndexAdmin) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading index by id');
            });
            return deferred.promise;
        }

        /**
         * Load all composite indexes
         */
        public loadAllCompositeIndexes(): ng.IPromise<models.ICompositeIndexAdmin[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.ICompositeIndexAdmin[]>(this.httpAddress + "/admin/indexes/composite").success((data: models.ICompositeIndexAdmin[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading composite indexes');
            });
            return deferred.promise;
        }

        /**
         * Create new simple index
         */
        public postSimpleIndex(simpleIndex: models.ISimpleIndexAdmin): ng.IPromise<models.ISimpleIndexAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            var url = this.endPointAdmin + "/admin/indexes/simples";
            this.http.post<models.ISimpleIndexAdmin>(url, simpleIndex).success((createdIndex: models.ISimpleIndexAdmin) => {
                deferred.resolve(createdIndex);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating simple index');
            });
            return deferred.promise;
        }

        /**
         * Update index
         */
        public updateSimpleIndex(simpleIndex: models.ISimpleIndexAdmin): ng.IPromise<models.ISimpleIndexAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            var url = this.endPointAdmin + "/admin/indexes/simples";
            this.http.put<models.ISimpleIndexAdmin>(url, simpleIndex).success((updatedIndex: models.ISimpleIndexAdmin) => {
                deferred.resolve(updatedIndex);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                let reason = 'problem occured when update simple index id : ' + simpleIndex.id;
                this.appSharedService.notifyErrorWithObjectError(reason, error);
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        /**
         * Delete simple index
         */
        public deleteSimpleIndex(indexId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            var url = this.endPointAdmin + "/admin/indexes/simples/"+indexId;
            this.http.delete(url).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                let reason = 'problem occured when deleting simple index id : ' + indexId;
                this.appSharedService.notifyErrorWithObjectError(reason, error);
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        /**
         * Create new composite index
         */
        public createCompositeIndex(compositeIndex: models.ICompositeIndexAdmin): ng.IPromise<models.ICompositeIndexAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.ICompositeIndexAdmin>(this.httpAddress + "/admin/indexes/composite", compositeIndex).success((createdIndex: models.ICompositeIndexAdmin) => {
                deferred.resolve(createdIndex);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating composite index');
            });
            return deferred.promise;
        }

        /**
         * Update composite index
         */
        public updateCompositeIndex(compositeIndex: models.ICompositeIndexAdmin): ng.IPromise<models.ICompositeIndexAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.ICompositeIndexAdmin>(this.httpAddress + "/admin/indexes/composite", compositeIndex).success((updateIndex: models.ICompositeIndexAdmin) => {
                deferred.resolve(updateIndex);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating composite index with id : ' + compositeIndex.id);
            });
            return deferred.promise;
        }

        /**
         * Delete composite index
         */
        public deleteCompositeIndex(compositeIndexId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/indexes/composite/" + compositeIndexId).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when deleting composite index with id : ' + compositeIndexId);
            });
            return deferred.promise;
        }
    }

    app.service('AdminIndexService', AdminIndexService);
}
