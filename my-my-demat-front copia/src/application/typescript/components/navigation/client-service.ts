module arvato.demat.services {
    "use strict";

    export class ClientService extends GenericService {

        public client: models.IClient = { id: undefined, name: undefined, logo: undefined, enable: false };

        constructor(protected http: ng.IHttpService, protected q: ng.IQService, protected appSharedService: services.AppSharedService) {
            super(http, q, appSharedService);
        }

        /**
         * Load current client
         */
        public loadCurrentClient(): ng.IPromise<models.IClient> {
            var deferred = this.q.defer();
            this.http.get<models.IClient>(this.httpAddress + "/clients/current").success((data: models.IClient) => {
                this.refreshSharedClient(data);
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject('problem occured when loading current client');
            });
            return deferred.promise;
        }

        /**
         * Update client
         */
        public updateClient(client: models.IClient): ng.IPromise<models.IClient> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IClient>(this.httpAddress + "/clients", client).success((data: models.IClient) => {
                this.refreshSharedClient(data);
                this.appSharedService.closeLoading();
                deferred.resolve(data);
            }).catch((error: any) => {
                deferred.reject('problem occured when create client');
            });
            return deferred.promise;
        }

        private refreshSharedClient(client: models.IClient): void {
            this.client.id = client.id;
            this.client.logo = client.logo;
            this.client.name = client.name;
            this.client.enable = client.enable;
        }
    }

    app.service('ClientService', ClientService);
}
