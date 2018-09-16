module arvato.demat.models {
    "use strict";

    export interface IEntityType {
        id: number;
        code: string;
        label: string;
        type: string;
        enabled: Boolean;
        createDate: Date;
        updateDate: Date;
    }
}