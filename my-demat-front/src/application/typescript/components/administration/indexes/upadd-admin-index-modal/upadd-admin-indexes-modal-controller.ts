module arvato.demat.controller {
    "use strict";
    const URL_SIMPLE_INDEX_BOARD =  "/boards-settings/indexes";

    export class ModalUpAddIndexesCtrl {

        private simpleIndex: models.ISimpleIndexAdmin;
        private board: models.IBoard;
        private indexTypes: models.IIndexType[];
        private dropdowns: models.IDropdown[];
        private action: string;
        static $inject = ['$uibModalInstance', 'AdminIndexService', 'modalOptions', 'BoardService', '$timeout', 'EntityTypeService', 'DropdownService'];

        constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private adminIndexService: services.AdminIndexService, private modalOptions:any, private boardService: services.BoardService, private $timeout: ng.ITimeoutService, private entityTypeService: services.EntityTypeService, private dropdownService: services.DropdownService) {
            this.board = modalOptions[0];
            this.action = modalOptions[2];

            /**
             * load type and list indexes
             */
            this.loadLists();
            this.loadAllIndexType();

            /**
             * loard index
             *              */
            if(this.action === 'update') {
                this.loadIndex(modalOptions[1].toString());
            }
        }

        ok(): void {
            if(this.action === 'update'){
                this.updateIndex();
            }
            else if(this.action === 'add'){
                this.adminIndexService.postSimpleIndex(this.simpleIndex);
            }
            else {
                console.error('action not authorized');
            }
            this.$uibModalInstance.close();
        };

        cancel(): void {
            this.$uibModalInstance.dismiss('cancel');
        };

        loadIndex(indexId: string): void {
            this.adminIndexService.getIndexById(indexId).then((simpleIndex : models.ISimpleIndexAdmin) => {
                this.simpleIndex = simpleIndex;
            });
        }

        public reloadBoardIndexes(board: models.IBoard) {
            this.boardService.getBoard(URL_SIMPLE_INDEX_BOARD).then((boardService : models.IBoard) => {
                board = boardService;

            });
        }

        /**
         * Update index
         */
        public updateIndex(): void {
            this.adminIndexService.updateSimpleIndex(this.simpleIndex).then(() => {
                this.reloadBoardIndexes(this.board);
            });
        }

        /**
         *
         * @param {string} regex
         * @returns {boolean}
         */
        public checkRegexValidity(regex: string): boolean {
            var isValid = true;
            try{
                new RegExp(regex);
            }catch(e){
                isValid = false;
            }
            return isValid;
        }

        /**
         * @returns all Type of indexes
         */
        private loadAllIndexType(): void {
            this.entityTypeService.loadEntityTypes("indexes-type").then((result: models.IIndexType[]) => {
                this.indexTypes = result;
            });
        }

        /**
         * @retourns all lists
         */
        private loadLists(): void {
            this.dropdownService.loadDropdowns("dropdowns").then((result: models.IDropdown[]) => {
                this.dropdowns = result;
            });
        }

        /**
         * update index type
         */
        public updateIndexType(simpleIndex: models.ISimpleIndexAdmin): void {
            for (var indexType of this.indexTypes) {
                if (simpleIndex.indexType && simpleIndex.indexType.id === indexType.id) {
                    simpleIndex.indexType.code = indexType.code;
                    simpleIndex.indexType.label = indexType.label;
                    break;

                }
            }
        }

        /**
         * update index dropdown
         */
        public updateIndexDropdown(simpleIndex: models.ISimpleIndexAdmin): void {
            for (var dropdonw of this.dropdowns) {
                if (simpleIndex.dropdown && simpleIndex.dropdown.id === dropdonw.id) {
                    simpleIndex.dropdown.label = dropdonw.label;
                    break;
                }
            }
        }

        /**
         * Check if index (to add/update) is filled
         */
        public isIndexFilled(index: models.ISimpleIndexAdmin): boolean {

            if (index && index.label && index.code && index.indexType) {
                if (index.indexType.code === "list" && !index.dropdown) {
                    return false;
                }

                if(index.regex && !this.checkRegexValidity(index.regex)){
                    return false;
                }
                return true;
            }
            return false;
        }
    }

    app.controller("ModalUpAddIndexesCtrl", ModalUpAddIndexesCtrl);
}
