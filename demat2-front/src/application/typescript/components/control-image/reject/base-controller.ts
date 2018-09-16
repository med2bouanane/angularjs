module arvato.demat.controller {
    "use strict";

    /**
     * Pour la recuperation de l'identifiant de la corbeille
     */
    interface routeParamsTray extends ng.route.IRouteParamsService {
        trayId: number;
    }

    /**
     * controller pour le controle image de base
     */
    export class ControlImageRejectBaseController {

        static $inject: string[] = ["$location", "$routeParams", "AuthSharedService","ControlImageRejectService","TrayService"];
        private batchs: models.controlimage.IBatch[];
        private numberBatch: number;
        private search: models.controlimage.IRecherche;
        private trayId: number;

        constructor(private $location: ng.ILocationService,
                    private routeParams: routeParamsTray,
                    private authService: services.AuthSharedService,
                    private controlImageService: services.controlimage.ControlImageRejectService,
                    private trayService: services.TrayService) {
            this.trayId = routeParams.trayId;
            this.init();
        }

        /**
         * Initialize le controle image
         */
        private init() {
            this.trayService.loadTray(this.trayId).then((result: models.ITray) => {
                if (!result || !this.authService.isAuthorized(result.authoritiesAsString.split(','))) {
                    this.$location.path("home");
                }
                this.initSearch();
            },(error)=>{
                this.$location.path("home");
            });
        }
        /**
         * initialise la recherche
         */
        public initSearch() {
            this.search = { batchId: undefined, sortType: 'createDate', sortReverse: true, startDate: undefined, endDate: undefined, currentPage: 1, itemsPerPage: 18 };
            this.loadBatchs();
        }
        /**
         * recherche la liste des batchs dans le controle image
         */
        public loadBatchs(){
            this.controlImageService.loadBatchs(this.trayId, this.search).then((result: models.controlimage.IBatchSearch) => {
                this.batchs = result.batchs;
                this.numberBatch = result.total;
            },(error)=>{
                this.batchs = [];
                this.numberBatch = 0;
            });
        }
        /**
         * redirige vers le detail du batch pour le controle image
         * @param batchId numero du batch à detailler
         */
        public open(batchId: number) {
            this.$location.path("control-image/reject/"+this.trayId+"/detail/"+batchId);
        }
    }

    app.controller("ControlImageRejectBaseController", ControlImageRejectBaseController);
}