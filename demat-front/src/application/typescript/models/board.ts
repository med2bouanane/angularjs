module arvato.demat.models {
    "use strict";

    /**
     * The column model
     */
    export interface IBoardColumn {
        id: string;
        value: string;
    }


    /**
     * The line model
     */
    export interface IBoardLine {
        id: string;
        columns: Array<IBoardColumn>;
    }

    /**
     * The board model
     */
    export interface IBoard {
        boardHead: IBoardLine;
        boardLines: Array<IBoardLine>;
    }
}
