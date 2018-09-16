module arvato.demat.services {
    "use strict";

    export class AdminListService {

        static $inject: string[] = ["$http", "AppSharedService", "$q"];

        private httpAddress: string = "##URL_REST##";

        constructor(private http: ng.IHttpService, private appSharedService: services.AppSharedService, private q: ng.IQService) {
        }

        /**
         * Load lists
         */
        public loadLists(): ng.IPromise<models.IList[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IList[]>(this.httpAddress + "/admin/lists").success((data: models.IList[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading lists');
            });
            return deferred.promise;
        }

        /**
         * Create new list
         */
        public createList(list: models.IList): ng.IPromise<models.IList> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IList>(this.httpAddress + "/admin/lists", list).success((data: models.IList) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating list');
            });
            return deferred.promise;
        }

        /**
         * Delete list
         */
        public deleteList(listId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/lists/" + listId).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when deleting list id : ' + listId);
            });
            return deferred.promise;
        }

        /**
         * Update list
         */
        public updateList(list: models.IList): ng.IPromise<models.IList> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.IList>(this.httpAddress + "/admin/lists", list).success((result: models.IList) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating list id : ' + list.id);
            });
            return deferred.promise;
        }

        /**
         * Create Or update list items
         */
        public createListItems(listId: number, listItems: models.IListItem[]): ng.IPromise<models.IListItem[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IListItem[]>(this.httpAddress + "/admin/lists/" + listId + "/items", listItems).success((data: models.IListItem[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating list items');
            });
            return deferred.promise;
        }

        /**
         * Load doctypes
         */
        public loadDocTypes(): ng.IPromise<models.IDocumentType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IDocumentType[]>(this.httpAddress + "/admin/doctypes").success((data: models.IDocumentType[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading doctypes');
            });
            return deferred.promise;
        }

        /**
         * Create new doctype
         */
        public createDocType(doctype: models.IDocumentType): ng.IPromise<models.IDocumentType> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IDocumentType>(this.httpAddress + "/admin/doctypes", doctype).success((data: models.IDocumentType) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating doctype');
            });
            return deferred.promise;
        }

        /**
         * Delete doctype
         */
        public deleteDocType(doctypeId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/doctypes/" + doctypeId).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when deleting doctype id : ' + doctypeId);
            });
            return deferred.promise;
        }

        /**
         * Update doctype
         */
        public updateDocType(doctype: models.IDocumentType): ng.IPromise<models.IDocumentType> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.IDocumentType>(this.httpAddress + "/admin/doctypes", doctype).success((result: models.IDocumentType) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating doctype id : ' + doctype.id);
            });
            return deferred.promise;
        }

        /**
         * Load envelope types
         */
        public loadEnvTypes(): ng.IPromise<models.IEnvType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IEnvType[]>(this.httpAddress + "/admin/envtypes").success((data: models.IEnvType[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading envelope types');
            });
            return deferred.promise;
        }

        /**
         * Create new envelope type
         */
        public createEnvType(envType: models.IEnvType): ng.IPromise<models.IEnvType> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IEnvType>(this.httpAddress + "/admin/envtypes", envType).success((data: models.IEnvType) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating envelope type');
            });
            return deferred.promise;
        }

        /**
         * Update envelope type
         */
        public updateEnvType(envType: models.IEnvType): ng.IPromise<models.IEnvType> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.IEnvType>(this.httpAddress + "/admin/envtypes", envType).success((result: models.IEnvType) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating envelope type id : ' + envType.id);
            });
            return deferred.promise;
        }

        /**
         * Delete envelope type
         */
        public deleteEnvType(envTypeId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/envtypes/" + envTypeId).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when deleting envelope type id : ' + envTypeId);
            });
            return deferred.promise;
        }

        /**
         * Load reject type
         */
        public loadRejectTypes(): ng.IPromise<models.IRejectTypeAdmin[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IRejectTypeAdmin[]>(this.httpAddress + "/admin/rejectTypes").success((data: models.IRejectTypeAdmin[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading reject types');
            });
            return deferred.promise;
        }

        /**
         * Load Structural Entity type
         */
        public loadStructuralEntityTypes(): ng.IPromise<models.IStructuralEntityType[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IStructuralEntityType[]>(this.httpAddress + "/admin/structuralEntityTypes").success((data: models.IStructuralEntityType[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading Structural Entity types');
            });
            return deferred.promise;
        }

        /**
         * Create new reject type
         */
        public createRejectType(rejectType: models.IRejectTypeAdmin): ng.IPromise<models.IRejectTypeAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IRejectTypeAdmin>(this.httpAddress + "/admin/rejectTypes", rejectType).success((data: models.IRejectTypeAdmin) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating reject type');
            });
            return deferred.promise;
        }

        /**
         * Update reject type
         */
        public updateRejectType(rejectType: models.IRejectTypeAdmin): ng.IPromise<models.IRejectTypeAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.IRejectTypeAdmin>(this.httpAddress + "/admin/rejectTypes", rejectType).success((result: models.IRejectTypeAdmin) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating reject type id : ' + rejectType.id);
            });
            return deferred.promise;
        }

        /**
         * Delete reject type
         */
        public deleteRejectType(rejectTypeId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/rejectTypes/" + rejectTypeId).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when deleting reject type id : ' + rejectTypeId);
            });
            return deferred.promise;
        }

        /**
         * Load categories
         */
        public loadCategories(): ng.IPromise<models.IAdminCategory[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IAdminCategory[]>(this.httpAddress + "/admin/categories").success((data: models.IAdminCategory[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading categories');
            });
            return deferred.promise;
        }

        /**
         * Create new category
         */
        public createCategory(category: models.IAdminCategory): ng.IPromise<models.IAdminCategory> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IAdminCategory>(this.httpAddress + "/admin/categories", category).success((data: models.IAdminCategory) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating new category');
            });
            return deferred.promise;
        }

        /**
         * Update category
         */
        public updateCategory(category: models.IAdminCategory): ng.IPromise<models.IAdminCategory> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put<models.IAdminCategory>(this.httpAddress + "/admin/categories", category).success((result: models.IAdminCategory) => {
                deferred.resolve(result);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating category id : ' + category.id);
            });
            return deferred.promise;
        }

        /**
         * Delete category
         */
        public deleteCategory(categoryId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/categories/" + categoryId).success(() => {
                deferred.resolve();
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when deleting category type id : ' + categoryId);
            });
            return deferred.promise;
        }
    }

    app.service('AdminListService', AdminListService);
}