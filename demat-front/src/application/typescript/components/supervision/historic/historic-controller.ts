module arvato.demat.controller {
    "use strict";

    export class HistoricController {

        static $inject: string[] = ["TrayService", "$scope", "$timeout", "hotkeys"];

        private envelopeHistorics: models.IEnvelopeHistoric[];

        constructor(private trayService: services.TrayService, private $scope: ng.IScope, private $timeout: ng.ITimeoutService, private hotkeys) {
            this.hotkeys.bindTo($scope).add({
                combo: 'enter',
                description: 'chercher un pli',
                callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#searchEnvelope').click();
                    });
                }
            });
        }

        /*
         * Load envelope historics
         */
        public loadEnvelopeHistorics(envelopeId: number) {
            this.trayService.loadEnvelopeHistorics(envelopeId).then((historics: models.IEnvelopeHistoric[]) => {
                this.envelopeHistorics = historics;
            });
        }

        public getTimelineBadgeIconCss(actionId: number): string {
            const integrationAction = 1;
            const classificationAction = 2;
            const indexationAction = 3;
            const rejectAction = 4;
            const redirectionAction = 5;
            const exportAction = 6;
            const deletionAction = 7;
            const ctrlQualityAction = 8;

            switch (actionId) {
                case integrationAction:
                    return "fa fa-cart-arrow-down";
                case classificationAction:
                    return "fa fa-random";
                case indexationAction:
                    return "fa fa-keyboard-o";
                case rejectAction:
                    return "fa fa-times-circle";
                case redirectionAction:
                    return "fa fa-reply";
                case exportAction:
                    return "fa fa-paper-plane-o";
                case deletionAction:
                    return "fa fa-trash-o";
                case ctrlQualityAction:
                    return "fa fa-binoculars";
            }

            return "";
        }

        public getTimelineBadgeCssClass(actionId: number): string {
            const integrationAction = 1;
            const classificationAction = 2;
            const indexationAction = 3;
            const rejectAction = 4;
            const redirectionAction = 5;
            const exportAction = 6;
            const deletionAction = 7;
            const ctrlQualityAction = 8;

            switch (actionId) {
                case integrationAction:
                    return "timeline-badge success";
                case classificationAction:
                    return "timeline-badge default";
                case indexationAction:
                    return "timeline-badge info";
                case rejectAction:
                    return "timeline-badge danger";
                case redirectionAction:
                    return "timeline-badge warning";
                case exportAction:
                    return "timeline-badge success";
                case deletionAction:
                    return "timeline-badge danger";
                case ctrlQualityAction:
                    return "timeline-badge success";
            }

            return "";
        }
    }

    app.controller("HistoricController", HistoricController);
}
