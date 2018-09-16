module arvato.demat.controller {
    "use strict";

    const URL_SIMPLE_INDEX_BOARD =  "/boards-settings/indexes";

    export class AdminIndexesController extends GenericAdminController {

        static $inject: string[] = ["BoardService"];

        private board: models.IBoard;

        constructor(private boardService: services.BoardService) {
            super();
        }
        /**
         * Load simple indexes
         */
        public loadBoardIndex() {
            this.boardService.getBoard(URL_SIMPLE_INDEX_BOARD).then((board : models.IBoard) => {
                this.board = board;
                console.info("this.board", this.board)
            });
        }
    }

    app.controller("AdminIndexesController", AdminIndexesController);
}
