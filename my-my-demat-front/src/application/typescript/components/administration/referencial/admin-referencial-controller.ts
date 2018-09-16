module arvato.demat.controller {
    "use strict";

    export class AdminReferencialController extends GenericAdminController {

        static $inject: string[] = ["AdminReferencialService", "AppSharedService", "$scope"];

        private referentialQueries: models.IReferencialQuery[]
        private referencialQueryEdit: models.IReferencialQuery;
        private referencialQueryAdd: models.IReferencialQuery;
        private referencialTypeQueries: models.IReferencialQueryType[];
        
        constructor(private adminService: services.AdminReferencialService, private appSharedService: services.AppSharedService, private $scope: ng.IScope) {
            super();
        }
        
        /**
         * Load referencial queries
         */
        public loadRefQueries(): void {
            this.appSharedService.displayLoading();
            this.referentialQueries = [];
            this.adminService.loadReferencialQueries().then((result: models.IReferencialQuery[]) => {
                this.referentialQueries = result;
                this.appSharedService.closeLoading();
            });
            this.loadRefTypeQueries();
        }
        /**
         * load type of referencial
         */
        public loadRefTypeQueries(): void{
            this.appSharedService.displayLoading();
            this.referencialTypeQueries = [];
            this.adminService.loadReferencialTypeQueries().then((result: models.IReferencialQueryType[]) => {
                this.referencialTypeQueries = result;
                this.appSharedService.closeLoading();
            });
        }

        /**
         * Create referential query
         */
        public createReferencialQuery() {
            this.appSharedService.displayLoading();
            this.adminService.createReferencialQuery(this.referencialQueryAdd).then((referencialQuery: models.IReferencialQuery) => {
                this.referentialQueries.unshift(referencialQuery);
                this.referencialQueryAdd = undefined;
                this.openPopinAdd = false;
                this.appSharedService.closeLoading();
            });
        }

        /**
         * Prepare delete referencial query
         */
        public prepareDeleteRefQuery(reflQuery: models.IReferencialQuery): void {
            this.referencialQueryEdit = reflQuery;
            this.openPopinConfirm = true;
        }

        /**
         * Confrim query deletion
         */
        public confirmDeleteRefQuery(): void {
            this.appSharedService.displayLoading();
            this.openPopinConfirm = false;
            this.adminService.deleteReferencialQuery(this.referencialQueryEdit.id).then((response: models.IResponse) => {
                if (response.code && response.code.toString() !== '##INTERNAL_ERROR##') {
                    for (var i = 0; i < this.referentialQueries.length; i++) {
                        if (this.referentialQueries[i].id === this.referencialQueryEdit.id) {
                            this.referentialQueries.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this.appSharedService.showAlert(response.message);
                }
                this.referencialQueryEdit = undefined;
                this.appSharedService.closeLoading();
            });
        }

        /**
         * Prepare update referencial query
         */
        public prepareUpdateRefQuery(reflQuery: models.IReferencialQuery): void {
            this.referencialQueryEdit = angular.copy(reflQuery);
            this.openPopinEdit = true;
        }

        /**
         * Update referencial query
         */
        public updateRefQuery(): void {
            this.appSharedService.displayLoading();
            this.openPopinEdit = false;
            this.adminService.updateReferencialQuery(this.referencialQueryEdit).then((referencialQuery: models.IReferencialQuery) => {
                for (var i = 0; i < this.referentialQueries.length; i++) {
                    if (this.referentialQueries[i].id === referencialQuery.id) {
                        this.referentialQueries.splice(i, 1, referencialQuery);
                        break;
                    }
                }
                this.referencialQueryEdit = undefined;
                this.appSharedService.closeLoading();
            });
        }
        /**
         * check if referential query is well filled
         */
        public isRefQueryFilled( refQuery: models.IReferencialQuery ): boolean {
            if ( refQuery && refQuery.index && refQuery.label && refQuery.type && refQuery.referencialType.id) {
                return true;
            }
            return false;
        }

        
    }

    app.controller("AdminReferencialController", AdminReferencialController);
}