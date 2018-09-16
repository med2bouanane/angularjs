module arvato.demat.controller {
    "use strict";
    export class HistoricBatchController extends GenericAdminController {

        static $inject: string[] = ["TrayService", "$location", "$scope", "$timeout", "hotkeys"];

        private historics: models.IBatchHistoric[];

        private historic: models.IBatchHistoric;

        private comment: string;

        constructor(private trayService: services.TrayService, private $location: ng.ILocationService, private $scope: ng.IScope, private $timeout: ng.ITimeoutService, private hotkeys) {
            super();
            this.hotkeys.bindTo($scope).add({
                combo: 'enter',
                description: 'chercher un lot',
                callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#searchBatch').click();
                    });
                }
            });
        }

        /*
         * Load batch historics
         */
        public loadBatchHistorics(batchNumber: number): void {
            this.trayService.loadBatchHistorics(batchNumber).then((historics: models.IBatchHistoric[]) => {
                this.historics = historics;
            });
        }

        /**
         * Delete batch = mark envelope with pending status with deleted status
         */
        public deleteBatch(): void {
            this.trayService.deleteBatch(this.historic.id, this.comment).then((historic: models.IBatchHistoric) => {
                this.openPopinConfirm = false;
                this.comment = undefined;
                this.historic = undefined;
                for (var i = 0; i < this.historics.length; i++) {
                    if (this.historics[i].id === historic.id) {
                        this.historics[i].nbDeletedEnv = historic.nbDeletedEnv;
                        this.historics[i].nbPendingEnv = historic.nbPendingEnv;
                        this.historics[i].nbTreatedEnv = historic.nbTreatedEnv;
                        break;
                    }
                }
            });
        }

        /**
         * Cancel batch deletion
         */
        public cancelBatchDeletion(): void {
            this.openPopinConfirm = false;
            this.comment = undefined;
            this.historic = undefined;
        }

        /**
         * Confirm batch deletion
         */
        public prepareBatchDeletion(batchHistoric: models.IBatchHistoric): void {
            this.historic = batchHistoric;
            this.openPopinConfirm = true;
        }

        /**
         * Open envelope
         */
        public openEnvelopes(batchId: number) {
            this.$location.path("envelopes/" + batchId);
        }
    }

    app.controller("HistoricBatchController", HistoricBatchController);
}
