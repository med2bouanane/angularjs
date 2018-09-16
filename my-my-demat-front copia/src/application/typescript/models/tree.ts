module arvato.demat.models {
    "use strict";

    /**
     * The Tree model
     */
    export interface ITree {
        id: string;
        label: string;
        imagePath: string;
        type: string;
        selected: string;
        children: Array<ITree>;
    }

    /**
     * The Tree model
     */
    export interface ISelectedTree {
        currentNode: INode;
    }

    /**
     * The Node model
     */
    export interface INode {
        id: number;
        label: string;
        selected: string;
        children: Array<INode>;
        structuralEntityType: IStructuralEntityType;

        // attributs specifiques à certains types d'entites
        imagePath: string;
        documentType: IDocumentType;
    }
}

