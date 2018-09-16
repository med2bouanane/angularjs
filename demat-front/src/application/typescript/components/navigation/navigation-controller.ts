module arvato.demat.controller {
    "use strict";

    export class NavigationController {

        static $inject: string[] = ["TrayService", "ClientService", "hotkeys", "$scope", "$location", "$timeout"];

        private trays: models.ITrayNavigation[] = this.trayService.trays;

        private client: models.IClient = this.clientService.client;

        constructor(private trayService: services.TrayService, private clientService: services.ClientService, private hotkeys: any, private $scope: ng.IScope, private $location: ng.ILocationService, private $timeout: ng.ITimeoutService) {
            this.clientService.loadCurrentClient();
            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+h', description: 'Page d\'Accueil', callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#idLinkHome').click();
                    })
                }
            });
        }

        /**
         * Refresh trays
         */
        public refreshTrays(): void {
            this.trayService.loadTrays();
        }

        /**
         * toggle help
         */
        public toggleHelp(): void {
            this.hotkeys.toggleCheatSheet();
        }

        /**
         * go home page
         */
        public goHome() {
            this.$location.path("/home");
        }
    }

    app.controller("NavigationController", NavigationController);
}
