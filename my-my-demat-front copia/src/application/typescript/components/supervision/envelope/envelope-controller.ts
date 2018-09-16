module arvato.demat.controller {
    "use strict";

    interface routeParams extends ng.route.IRouteParamsService {
        batchId: number;
    }

    export class EnvelopeController extends GenericAdminController {

        static $inject: string[] = ["EnvelopeService", "$routeParams", "$location", "$scope", "$timeout", "hotkeys"];

        private envelopes: models.IEnvelope[];

        constructor(private envelopeService: services.EnvelopeService, private routeParams: routeParams, private $location: ng.ILocationService, private $scope: ng.IScope, private $timeout: ng.ITimeoutService, private hotkeys) {
            super();
            if (routeParams.batchId) {
                this.findEnv(routeParams.batchId);
            }
        }

        /*
         * find env by batch
         */
        public findEnv(batchId: number): void {
            this.envelopeService.findEnvelopes(batchId).then((envelopes: models.IEnvelope[]) => {
                this.envelopes = envelopes;
            });
        }

        /**
         * Open envelope historic
         */
        public openEnvelopeHistoric(envelopeId: number) {
            this.$location.path("historic/" + envelopeId);
        }
    }

    app.controller("EnvelopeController", EnvelopeController);
}
