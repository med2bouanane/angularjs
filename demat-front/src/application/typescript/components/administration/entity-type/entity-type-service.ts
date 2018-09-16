module arvato.demat.services {
    "use strict";

    import IError = arvato.demat.models.IError;

    export class EntityTypeService {

        static $inject: string[] = ["$http", "AppSharedService", "$q"];

        private httpAddress: string = "##URL_REST_ADMIN##";

        constructor(private http: ng.IHttpService, private appSharedService: services.AppSharedService, private q: ng.IQService) {

        }

        /**
         * load a entity type by id
         */
        public loadEntityType(entityType: string, entityTypeId: number): ng.IPromise<models.IEntityType> {
            this.appSharedService.displayLoading();
            console.log(this.httpAddress + "/admin/entity-type/" + entityType + "/" + entityTypeId)
            var deferred = this.q.defer();
            this.http.get<models.IEntityType>(this.httpAddress + "/entity-type/" + entityType + "/" + entityTypeId).success((data: models.IEntityType) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                let reason = 'problem occured when get entity type by id : ' + entityTypeId;
                this.appSharedService.notifyErrorWithObjectError(reason, error);
                deferred.reject(reason);
            });
            // @ts-ignore
            return deferred.promise;
        }

        /**
         * Load envelope types
         */
        public loadEntityTypes(entityType: string): angular.IPromise<arvato.demat.models.IEntityType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEntityType[]>(this.httpAddress + "/admin/entity-type/" + entityType).success((data: models.IEntityType[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                let reason = 'problem occured when loading batch types';
                this.appSharedService.notifyErrorWithObjectError(reason, error);
                deferred.reject(reason);
            });
            // @ts-ignore
            return deferred.promise;
        }

        /**
         * Create new envelope type
         */
        public addEntityType(entityType: string, entityTypeModel: models.IEntityType): ng.IPromise<models.IEntityType> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IEntityType>(this.httpAddress + "/admin/entity-type/" + entityType, entityTypeModel).success((data: models.IEntityType) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                let reason = 'problem occured when creating entity type';
                this.appSharedService.notifyErrorWithObjectError(reason, error);
                deferred.reject(reason);
            });
            // @ts-ignore
            return deferred.promise;
        }

        /**
         * Update envelope type
         */
        public updateEntityType(entityType: string, entityTypeModel: models.IEntityType): ng.IPromise<models.IEntityType> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.IEntityType>(this.httpAddress + "/admin/entity-type/" + entityType, entityTypeModel).success((result: models.IEntityType) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                let reason = 'problem occured when updating entity type id : ' + entityTypeModel.id;
                this.appSharedService.notifyErrorWithObjectError(reason, error.data);
                deferred.reject(reason);
            });
            // @ts-ignore
            return deferred.promise;
        }

        /**
         * Delete entity type
         */
        public deleteEntityType(entityType: string, entityTypeId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/entity-type/" + entityType + "/" + entityTypeId).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                let reason = 'problem occured when deleting entity type id : ' + entityTypeId;
                this.appSharedService.notifyErrorWithObjectError(reason, error);
                deferred.reject(reason);
            });
            // @ts-ignore
            return deferred.promise;
        }
    }

    app.service('EntityTypeService', EntityTypeService);
}