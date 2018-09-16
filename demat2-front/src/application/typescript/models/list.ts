module arvato.demat.models {
    "use strict";

    export interface IStructuralEntityType {
        id: number;
        label: string;
        code: string;
    }

    export interface IRejectType {
        id: number;
        label: string;
        structuralEntityType: IStructuralEntityType[];
        trayDestinationId: number;
    }

    export interface IRejectTypeAdmin extends IRejectType {
        code: string;
        createDate: Date;
        updateDate: Date;
    }
}
