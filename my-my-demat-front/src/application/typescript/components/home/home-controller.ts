module arvato.demat.controller {
    "use strict";

    export interface IHomeScope extends ng.IScope {
        pieChart: models.ISimpleChart;
        barChart: models.ISimpleChart;
        dashboard: models.IDashboard;
        countSeconds: number;
    }

    export class HomeController {

        static $inject: string[] = ["TrayService", "HomeService", "AuthSharedService", "$scope", "hotkeys", "$timeout"];

        private trays: models.ITrayNavigation[] = this.trayService.trays;

        private openPopin: boolean;

        private treatedAndCadence: models.ITrayByStep[];

        private totalCadence: number;

        constructor(private trayService: services.TrayService, private homeService: services.HomeService, private authSharedService, private $scope: IHomeScope, private hotkeys: any, private $timeout: ng.ITimeoutService) {
            $scope.pieChart = { labels: [], data: [], colors: undefined }
            $scope.barChart = { labels: [], data: [], colors: undefined }

            this.trayService.loadTrays().then(() => {
                this.refreshChart();
                this.createKeyShorcuts($scope, $timeout);
            });

            homeService.loadDashbordData().then((data: models.IDashboard) => {
                $scope.dashboard = data;
                for (var item of data.treatedByUser) {
                    $scope.barChart.labels.push(item[0].toString());
                    $scope.barChart.data.push(parseInt(item[1].toString()));
                }
            });

            // refresh dashbord every 10 seconds
            $scope.countSeconds = 10;
            var updateCounter = function () {
                if (angular.element(document).find('#refreshSpan').length) {
                    $scope.countSeconds--;
                    if ($scope.countSeconds === -1) {
                        $scope.countSeconds = 10;
                        trayService.loadTrays().then((trays: models.ITrayNavigation[]) => {
                            $scope.pieChart.labels.length = 0;
                            $scope.pieChart.data.length = 0;
                            for (var i = 1; i <= trays.length; i++) {
                                if (trays[i - 1].authoritiesAsString) {
                                    var roles = trays[i - 1].authoritiesAsString.split(',');
                                    if (roles.length > 0 && authSharedService.isAuthorized(roles)) {
                                        $scope.pieChart.labels.push(trays[i - 1].label);
                                        $scope.pieChart.data.push(trays[i - 1].nbEnvelopes);
                                    }
                                }
                            }
                        });

                        homeService.loadDashbordData().then((data: models.IDashboard) => {
                            $scope.dashboard = data;
                            var usernames: string[] = [];
                            var nbEnvTreated: number[] = [];
                            for (var item of data.treatedByUser) {
                                usernames.push(item[0].toString());
                                nbEnvTreated.push(parseInt(item[1].toString()));
                            }
                            $scope.barChart.labels = usernames;
                            $scope.barChart.data = nbEnvTreated;
                        });
                    }
                    $timeout(updateCounter, 1000);
                }
            };
            updateCounter();
        }

        /**
         * create key Shorcuts
         */
        private createKeyShorcuts($scope, $timeout): void {
            for (var i = 1; i <= this.trays.length; i++) {
                if (this.trays[i - 1].authoritiesAsString) {
                    var roles = this.trays[i - 1].authoritiesAsString.split(',');
                    if (roles.length > 0 && this.authSharedService.isAuthorized(roles)) {
                        this.hotkeys.bindTo(this.$scope).add({
                            combo: 'ctrl+' + i,
                            description: 'Ouvrir la corbeille ' + this.trays[i - 1].label,
                            callback: function (event) {
                                event.preventDefault();
                                $timeout(function () {
                                    angular.element(document).find('#trayPanel' + event.key).click();
                                })
                            }
                        });
                    }
                }
            }
        }

        /**
         * Refresh chart
         */
        private refreshChart(): void {
            for (var i = 1; i <= this.trays.length; i++) {
                if (this.trays[i - 1].authoritiesAsString) {
                    var roles = this.trays[i - 1].authoritiesAsString.split(',');
                    if (roles.length > 0 && this.authSharedService.isAuthorized(roles)) {
                        this.$scope.pieChart.labels.push(this.trays[i - 1].label);
                        this.$scope.pieChart.data.push(this.trays[i - 1].nbEnvelopes);
                    }
                }
            }
        }

        /**
         * get tray class panel
         */
        private getClass(tray: models.ITrayNavigation): string {
            return 'panel panel-' + tray.color;
        }

        /**
         * get tray sub type icon
         */
        private getSubTypeIcon(tray: models.ITrayNavigation): string {
            if (tray.structuralEntityType.code === '##STRUCTURAL_ENTITY_TYPE_CODE_ENVELOPE##') {
                return 'fa fa-envelope-o';
            } else if (tray.structuralEntityType.code === '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##') {
                return 'fa fa-file-o';
            }
        }

        /**
         * Display number of treated envelope/spent time/cadence by tray and action
         */
        private getTreatedAndCadenceDetails(): void {
            this.openPopin = true;
            this.homeService.loadTreatedByActionData().then((data: models.ITrayByStep[]) => {
                if (data.length) {
                    this.totalCadence = 0;
                    for (var line of data) {
                        this.totalCadence += line.timeClassfication;
                        this.totalCadence += line.timeIndexation;
                        this.totalCadence += line.timeRedirection;
                        this.totalCadence += line.timeRejet;
                        this.totalCadence += line.timeQualityCtrl;
                    }
                }

                this.treatedAndCadence = data;
            });
        }
        /**
         * calcule l'url de la corbeille en fonction de son type et de son identifiant
         * @param trayType type de la corbeille
         * @param trayId identifiant de la corbeille
         */
        private getUriOfTrayByTypeAndId(trayType: string, trayId: number): string {
            if(trayType == 'STRUCT'){
                return "#/control-image/treatment/"+trayId;
            }else if(trayType == 'RJTSTRUCT'){
                return "#/control-image/reject/"+trayId;
            }
            return "#/tray-detail/"+trayId;
        }
    }

    app.controller("HomeController", HomeController);
}
