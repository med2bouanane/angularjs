module arvato.demat.services {
    "use strict";

    export class CategoryService extends GenericService {

        constructor(protected http: ng.IHttpService, protected q: ng.IQService, protected appSharedService: services.AppSharedService) {
            super(http, q, appSharedService);
        }

        /**
        *returns an array of categories
        */
        public loadAllCategories(): ng.IPromise<models.IAdminCategory[]> {
            var deferred = this.q.defer();
            this.http.get<models.IAdminCategory[]>(this.httpAddress + "/admin/categories").success((data: models.IAdminCategory[]) =>{
                deferred.resolve(data);
            }).catch((error: any) =>{
                deferred.reject("problem occured when loading categories");
            });
            return deferred.promise;
        }
    }
    app.service('CategoryService', CategoryService);
}
