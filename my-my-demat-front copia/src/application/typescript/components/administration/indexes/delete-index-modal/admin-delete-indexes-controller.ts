module arvato.demat.controller {
    "use strict";

    export class ModalDeleteIndexesCtrl {

        private simpleIndex: models.ISimpleIndexAdmin;

        static $inject = ['$uibModalInstance', 'AdminIndexService', 'modalOptions'];

        constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private adminIndexService: services.AdminIndexService, private modalOptions: any) {
            this.loadIndex(modalOptions.toString());
        }

        ok(): void {
            this.deleteIndex();
            this.$uibModalInstance.close();
        };

        cancel(): void {
            this.$uibModalInstance.dismiss('cancel');
        };

        public deleteIndex(): void {
            this.adminIndexService.deleteSimpleIndex(this.simpleIndex.id);
        }

        loadIndex(indexId: string): void {
            this.adminIndexService.getIndexById(indexId).then((simpleIndex : models.ISimpleIndexAdmin) => {
                this.simpleIndex = simpleIndex;
            });
        }
    }

    app.controller("ModalDeleteIndexesCtrl", ModalDeleteIndexesCtrl);
}
