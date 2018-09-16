module arvato.demat.controller {
    "use strict";

    interface routeParamsTray extends ng.route.IRouteParamsService {
        trayId: number;
    }

    export class TrayDetailController {

        static $inject: string[] = ["TrayService", "$location", "$routeParams", "AuthSharedService"];

        private tray: models.ITray;

        private envelopesSearch: models.IEnvelopeSearch;

        private search: models.IRecherche;

        constructor(private trayService: services.TrayService, private $location: ng.ILocationService, private routeParams: routeParamsTray, private authService: services.AuthSharedService) {

            this.init(routeParams.trayId);
        }

        /**
         * Initialize tray data
         */
        private init(trayId: number) {
            this.trayService.loadTrayDetail(trayId).then((result: models.ITrayDetail) => {
                if (!result || !this.authService.isAuthorized(result.authoritiesAsString.split(','))) {
                    this.$location.path("home");
                } else {

                    this.initSearch();
                    this.tray = result;
                    for (var tray2 of this.trayService.trays) {
                        if (tray2.id === this.tray.id) {
                            this.tray.nbEnvelopes = tray2.nbEnvelopes;
                            break;
                        }
                    }

                    // load doc Types on classification tray type
                    if (this.tray.type.code === '##TRAY_CLASSIF_TYPE##') {
                        if (this.tray.structuralEntityType.code === '##STRUCTURAL_ENTITY_TYPE_CODE_ENVELOPE##') {
                            this.trayService.loadEnvelopeTypes(trayId);
                        } else if (this.tray.structuralEntityType.code === '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##') {
                            this.trayService.loadDocTypes(trayId);
                        }
                    }
                }
            });

            // load reject Type
            this.trayService.loadRejectTypes(trayId);
        }

        /**
         * init search from and load envelopes
         */
        public initSearch() {
            this.search = {
                batchId: undefined,
                envelopeId: undefined,
                sortType: 'createDate',
                sortReverse: true,
                startDate: undefined,
                endDate: undefined,
                currentPage: 1,
                itemsPerPage: 18
            };
            this.loadEnvelopesByCriteria();
        }

        /**
         * Open envelope
         */
        public openEnvelope(envelopeId: number) {
            this.$location.path("envelope-detail/" + envelopeId);
        }

        /**
         * get envelopes by criteria
         */
        public loadEnvelopesByCriteria() {
            this.trayService.loadEnvelopes(this.routeParams.trayId, this.search).then((result: models.IEnvelopeSearch) => {
                this.envelopesSearch = result;
            });
        }
    }

    app.controller("TrayDetailController", TrayDetailController);
}