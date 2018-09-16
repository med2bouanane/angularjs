module arvato.demat.controller {
    "use strict";

    export class AdminAppController extends GenericAdminController {

        static $inject: string[] = ["ClientService", "$scope", "$location"];

        private client: models.IClient = angular.copy(this.clientService.client);

        private logos: string[] = undefined;

        constructor(private clientService: services.ClientService, private $scope: ng.IScope, private $location: ng.ILocationService) {
            super();
        }

        private updateClient(): void {
            this.clientService.updateClient(this.client);
        }

        public cancelUpdateClientparameters() {
            this.client = angular.copy(this.clientService.client);
        }

        public isClientFilled() {
            return this.client.logo && this.client.name;
        }
    }

    app.controller("AdminAppController", AdminAppController);
}