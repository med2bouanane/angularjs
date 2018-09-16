module arvato.demat.controller {
    "use strict";

    interface routeParams extends ng.route.IRouteParamsService {
        envelopeId: number;
    }

    export class HistoricParamsController extends HistoricController {

        static $inject: string[] = ["TrayService", "$routeParams", "$scope", "$timeout", "hotkeys"];

        constructor(trayService: services.TrayService, routeParams: routeParams, $scope: ng.IScope, $timeout: ng.ITimeoutService, hotkeys) {
            super(trayService, $scope, $timeout, hotkeys);
            this.loadEnvelopeHistorics(routeParams.envelopeId);
        }
    }

    app.controller("HistoricParamsController", HistoricParamsController);
}
