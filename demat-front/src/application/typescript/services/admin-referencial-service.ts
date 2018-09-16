module arvato.demat.services {
    "use strict";

    export class AdminReferencialService {

        static $inject: string[] = ["$http", "$q", "uiUploader"];

        private httpAddress: string = "##URL_REST##";

        constructor(private http: ng.IHttpService, private q: ng.IQService, private uiUploader: any) {
            
        }
        
        /**
         * create referencial query
         */
        public createReferencialQuery(referencialQuery: models.IReferencialQuery): ng.IPromise<models.IReferencialQuery> {
            var deferred = this.q.defer();
            this.http.post<models.IReferencialQuery>(this.httpAddress + "/referencial/referencialQuery", referencialQuery).success((result: models.IReferencialQuery) => {
                deferred.resolve(result);
            }).catch((error: any) => {
                console.error('problem occured when creating new referencialQuery');
            });
            return deferred.promise;
        }
        /**
         * delete referencial query
         */
        public deleteReferencialQuery(refQueryId: number): ng.IPromise<any> {
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/referencial/referencialQuery/" + refQueryId).success((response: models.IResponse) => {
                deferred.resolve(response);
            }).catch((error: any) => {
                console.error('problem occured when deleting referencialQuery id :' + refQueryId);
            });
            return deferred.promise;
        }

        /**
         * load referencial queries
         */
        public loadReferencialQueries(): ng.IPromise<models.IReferencialQuery[]> {
            var deferred = this.q.defer();
            this.http.get<models.IReferencialQuery[]>(this.httpAddress + "/referencial/referencialQuery").success((data: models.IReferencialQuery[]) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject('problem occured when loading referencial queries');
            });
            return deferred.promise;
        }
        
        /**
         * update referencial query
         */
        public updateReferencialQuery(referencialQuery: models.IReferencialQuery): ng.IPromise<any> {
            var deferred = this.q.defer();
            this.http.put<models.IReferencialQuery>(this.httpAddress + "/referencial/referencialQuery", referencialQuery).success((result: models.IReferencialQuery) => {
                deferred.resolve(result);
            }).catch((error: any) => {
                console.error('problem occured when updating referencialQuery id ' + referencialQuery.id);
            });
            return deferred.promise;
        }
        
        /**
         * load referencial type queries
         */
        public loadReferencialTypeQueries(): ng.IPromise<models.IReferencialQueryType[]> {
            var deferred = this.q.defer();
            this.http.get<models.IReferencialQueryType[]>(this.httpAddress + "/referencial/type").success((data: models.IReferencialQueryType[]) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject('problem occured when loading referencial type queries');
            });
            return deferred.promise;
        }

    }
    
    app.service('AdminReferencialService', AdminReferencialService);
}