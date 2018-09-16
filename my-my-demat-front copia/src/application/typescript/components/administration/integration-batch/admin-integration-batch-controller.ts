module arvato.demat.controller {
    "use strict";

    export class AdminIntegrationBatchController extends GenericAdminController {

        static $inject: string[] = ["AdminIntegrationBatchService","AdminReferencialService", "AppSharedService", "$scope"];

        private xpathExpr: models.IXPathExpr;

        private regexList: models.IRegex[];
        private regexListSortable: models.IRegex[];
        private regexEdit: models.IRegex;
        private regexAdd: models.IRegex;

        private referentialQueries: models.IReferencialQuery[];

        private openPopinRegexConfirm: Boolean;
        private openPopinRegexEdit: Boolean;
        private openPopinRegexAdd: Boolean;



        constructor( private adminService: services.AdminIntegrationBatchService, private adminReferencialService: services.AdminReferencialService,
            private appSharedService: services.AppSharedService, private $scope: ng.IScope ) {
            super();
        }

        /**
         * Load XPath expressions
         */
        public loadXPathExpressions(): void {
            this.appSharedService.displayLoading();
            this.adminService.loadXPathExpressions().then(( result: models.IXPathExpr ) => {
                this.xpathExpr = result;
                this.appSharedService.closeLoading();
            } );
        }
        
        /**
         * Load referencial queries
         */
        public loadRefQueries(): void {
            this.appSharedService.displayLoading();
            this.referentialQueries = [];
            this.adminReferencialService.loadReferencialQueries().then((result: models.IReferencialQuery[]) => {
                this.referentialQueries = result;
                this.appSharedService.closeLoading();
            });
        }

        /**
         * Load regex
         */
        public loadRegex(): void {
            this.appSharedService.displayLoading();
            this.adminService.loadRegex().then(( result: models.IRegex[] ) => {
                this.regexList = result;
                this.regexListSortable = angular.copy( result );
                this.appSharedService.closeLoading();
            } );
            this.loadRefQueries();
        }

        /**
         *  Save Xpath expressions 
         */
        public saveXpathExpressions(): void {
            this.appSharedService.displayLoading()
            this.adminService.saveXpathExpressions( this.xpathExpr ).then(( result: models.IXPathExpr ) => {
                this.xpathExpr = result;
                this.appSharedService.closeLoading();
            } );
        }

        /**
         * check if regex is well filled
         */
        public isRegexFilled( regex: models.IRegex ): boolean {
            if ( regex && regex.label && regex.regex && regex.referencialQuery && regex.referencialQuery.id ) {
                return true;
            }
            return false;
        }

        /**
         * Create regular expression
         */
        public createRegex() {
            this.regexAdd.xpathExpr = this.xpathExpr;
            this.appSharedService.displayLoading();
            this.adminService.createRegex( this.regexAdd ).then(( regex: models.IRegex ) => {
                this.regexList.unshift( regex );
                this.regexListSortable.unshift( regex );
                this.regexAdd = undefined;
                this.openPopinRegexAdd = false;
                this.appSharedService.closeLoading();
            } );
        }

        /**
         * Prepare regular expression deletion
         */
        public prepareDeleteRegex( reflQuery: models.IRegex ): void {
            this.regexEdit = reflQuery;
            this.openPopinRegexConfirm = true;
        }

        /**
         * Confrim regular expression deletion
         */
        public confirmDeleteRegex(): void {
            this.appSharedService.displayLoading();
            this.openPopinRegexConfirm = false;
            this.regexEdit.xpathExpr = this.xpathExpr;
            this.adminService.deleteRegex( this.regexEdit ).then(( response: models.IResponse ) => {
                if ( response.code && response.code.toString() !== '##INTERNAL_ERROR##' ) {
                    for ( var i = 0; i < this.regexList.length; i++ ) {
                        if ( this.regexList[i].referencialQuery.id === this.regexEdit.referencialQuery.id ) {
                            this.regexList.splice( i, 1 );
                            break;
                        }
                    }
                    for ( var i = 0; i < this.regexListSortable.length; i++ ) {
                        if ( this.regexListSortable[i].referencialQuery.id === this.regexEdit.referencialQuery.id ) {
                            this.regexListSortable.splice( i, 1 );
                            break;
                        }
                    }
                } else {
                    this.appSharedService.showAlert( response.message );
                }
                this.regexEdit = undefined;
                this.appSharedService.closeLoading();
            } );
        }

        /**
         * Prepare update referencial query
         */
        public prepareUpdateRegex( regex: models.IRegex ): void {
            this.regexEdit = angular.copy( regex );
            this.openPopinRegexEdit = true;
        }

        /**
         * Update referencial query
         */
        public updateRegex(): void {
            this.appSharedService.displayLoading();
            this.openPopinRegexEdit = false;
            this.regexEdit.xpathExpr = this.xpathExpr;
            this.adminService.updateRegex( this.regexEdit ).then(( regex: models.IRegex ) => {
                for ( var i = 0; i < this.regexList.length; i++ ) {
                    if ( this.regexList[i].referencialQuery.id === regex.referencialQuery.id ) {
                        this.regexList.splice( i, 1, regex );
                        break;
                    }
                }
                for ( var i = 0; i < this.regexListSortable.length; i++ ) {
                    if ( this.regexListSortable[i].referencialQuery.id === regex.referencialQuery.id ) {
                        this.regexListSortable.splice( i, 1, regex );
                        break;
                    }
                }
                this.regexEdit = undefined;
                this.appSharedService.closeLoading();
            } );
        }

        /**
         * Update regex priority
         */
        public updateRegexPriority(): void {
            this.appSharedService.displayLoading()
            this.adminService.updateRegexPriority( this.regexListSortable ).then(() => {
                this.appSharedService.closeLoading();
            } );
        }
    }

    app.controller( 'AdminIntegrationBatchController', AdminIntegrationBatchController );
}