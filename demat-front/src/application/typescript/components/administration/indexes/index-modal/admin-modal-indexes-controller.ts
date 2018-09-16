module arvato.demat.controller {
    "use strict";


    export class ModalIndexesCtrl {

        private isClose: boolean;
        static $inject = ['$uibModal', '$timeout'];

        constructor(private $uibModal: ng.ui.bootstrap.IModalService) {}

        openUpdate(board: any, params: any, action: string): void {
            var modalInstance: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                templateUrl: 'components/administration/indexes/upadd-admin-index-modal/upadd-admin-indexes-modal.html',
                controller: ModalUpAddIndexesCtrl,
                bindToController: true,
                controllerAs: 'modalUpAddIndexesCtrl',
                resolve: {
                    modalOptions: () => [board, params, action]
                }
            });

            modalInstance.result.then(() => {
                this.isClose = true;
            });
        };

        openDelete(params: any): void {
            var modalInstance: ng.ui.bootstrap.IModalServiceInstance = this.$uibModal.open({
                templateUrl: 'components/administration/indexes/delete-index-modal/admin-delete-indexes-modal.html',
                controller: ModalDeleteIndexesCtrl,
                bindToController: true,
                controllerAs: 'modalDeleteIndexesCtrl',
                resolve: {
                    modalOptions: () => params
                }
            });

            modalInstance.result.then(() => {
                this.isClose = true;
            });
        };
    }

    app.controller("ModalIndexesCtrl", ModalIndexesCtrl);
}
