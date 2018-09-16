module arvato.demat.models {
    "use strict";

    export interface IReferencialQuery {
        id: number;
        label: string;
        index: string;
        type: string;
        referencialType: IReferencialQueryType;
        createDate: Date;
        updateDate: Date;
    }

    export interface IReferencialQueryType {
        id: number;
        label: string;
        type: string;
    }
    
}