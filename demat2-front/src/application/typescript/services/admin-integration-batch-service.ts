module arvato.demat.services {
    "use strict";

    export class AdminIntegrationBatchService {

        static $inject: string[] = ["$http", "$q", "uiUploader"];

        private httpAddress: string = "##URL_REST##";

        constructor(private http: ng.IHttpService, private q: ng.IQService, private uiUploader: any) {
        }

        /**
         * load XPATH expressions
         */
        public loadXPathExpressions(): ng.IPromise<models.IXPathExpr> {
            var deferred = this.q.defer();
            this.http.get<models.IXPathExpr[]>(this.httpAddress + "/integrationBatch/xpathexpr").success((data: models.IXPathExpr[]) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject('problem occured when loading XPATH expressions');
            });
            return deferred.promise;
        }

        /**
         * save XPATH expressions
         */
        public saveXpathExpressions(data: models.IXPathExpr): ng.IPromise<models.IXPathExpr> {
            var deferred = this.q.defer();
            this.http.post<models.IXPathExpr>(this.httpAddress + "/integrationBatch/xpathexpr", data).success((result: models.IXPathExpr) => {
                deferred.resolve(result);
            }).catch((error: any) => {
                deferred.reject('problem occured when creating/updating XPATH expressions');
            });
            return deferred.promise;
        }

        /**
         * Load regex list
         */
        public loadRegex() {
            var deferred = this.q.defer();
            this.http.get<models.IRegex[]>(this.httpAddress + "/integrationBatch/regex").success((data: models.IRegex[]) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject('problem occured when loading regex(s)');
            });
            return deferred.promise;
        }

        /**
         * update referencial query
         */
        public updateRegexPriority(regexList: models.IRegex[]): ng.IPromise<any> {
            var deferred = this.q.defer();
            this.http.put<models.IRegex>(this.httpAddress + "/integrationBatch/regex/sort", regexList).success(() => {
                deferred.resolve();
            }).catch((error: any) => {
                console.error('problem occured when updating regex list sort');
            });
            return deferred.promise;
        }

        /**
         * Create regular expression
         */
        public createRegex(regex: models.IRegex): ng.IPromise<models.IRegex> {
            var deferred = this.q.defer();
            this.http.post<models.IRegex>(this.httpAddress + "/integrationBatch/regex", regex).success((result: models.IRegex) => {
                deferred.resolve(result);
            }).catch((error: any) => {
                console.error('problem occured when creating new regular expression');
            });
            return deferred.promise;
        }

        /**
         * Delete regular expression
         */
        public deleteRegex(regex: models.IRegex): ng.IPromise<any> {
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/integrationBatch/regex/xpath/" + regex.xpathExpr.id + "/referencialQuery/" + regex.referencialQuery.id).success((response: models.IResponse) => {
                deferred.resolve(response);
            }).catch((error: any) => {
                console.error('problem occured when deleting a regular expression :' + regex.label);
            });
            return deferred.promise;
        }

        /**
         * Update regular expression
         */
        public updateRegex(regex: models.IRegex): ng.IPromise<any> {
            var deferred = this.q.defer();
            this.http.put<models.IRegex>(this.httpAddress + "/integrationBatch/regex", regex).success((result: models.IRegex) => {
                deferred.resolve(result);
            }).catch((error: any) => {
                console.error('problem occured when updating regex label: ' + regex.label);
            });
            return deferred.promise;
        }
    }

    app.service('AdminIntegrationBatchService', AdminIntegrationBatchService);
}
