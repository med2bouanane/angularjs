module arvato.demat.services {
    "use strict";

    const ENDPOINT = "##URL_REST_BACKEND##";

    export class BoardService {

        static $inject: string[] = ["$http", "$q", "AppSharedService"];

        constructor(private http: ng.IHttpService, private q: ng.IQService, private appSharedService: services.AppSharedService) {
        }

        /**
         * Get board
         */
        public getBoard(url: string): ng.IPromise<models.IBoard> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IBoard>(ENDPOINT + url).success((data: models.IBoard) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when loading " + url);
            });

            return deferred.promise;
        }
    }
    app.service("BoardService", BoardService);
}
