module arvato.demat.services {
    "use strict";

    export class AdministrationService {

        static $inject: string[] = ["$http", "$q", "uiUploader"];

        private httpAddress: string = "##URL_REST##";

        constructor(private http: ng.IHttpService, private q: ng.IQService, private uiUploader: any) {
        }

        public export(trayId: number, fileType: string): ng.IPromise<models.IResponse> {
            var deferred = this.q.defer();
            this.http.get<models.IResponse>(this.httpAddress + "/exchange/export/" + trayId + "/" + fileType).success((data: models.IResponse) => {
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject('problem occured when exporting file type : ' + fileType);
            });
            return deferred.promise;
        }

        private uploadOnProgress(file: any): void {
            console.log(file.name + '=' + file.humanSize);
        }
    }

    app.service('AdministrationService', AdministrationService);
}
