module arvato.demat.models {
    "use strict"

    export interface IIndex {
        id: number;
        label: string;
        refLabel: string;
        inputType: string;
        minLength: number;
        maxLength: number;
        enable: boolean;
        required: boolean;
        positionX: number;
        positionY: number;
        refSearch: boolean;
        childIndexes: IIndex[];
        value: Array<Object>;
        items: IItem[];
        indexRegex: string;
        idCategory: number;
    }

    /**
     * Category model of indexes
     */
    export interface ICategory {
        id: number;
        label: string;
        icon: string;
        type: string;
        open: Boolean;
        enabled: Boolean;
        nbRows: number;
        nbColumns: number;
        indexes: IIndex[];
    }


    /**
     * Admin Category model of indexes
     */
    export interface IAdminCategory {
        id: number;
        label: string;
        color: string;
        type: string;
        nbRows: number;
        nbColumns: number;
        icon: string;
        open: boolean;
        enabled: boolean;
        priority: number;
        createDate: Date;
        updateDate: Date;
    }

    /**
     * Simple index model used for administration
     */
    export interface IIndexType extends IEntityType{
    }

    /**
     * Generic index model used for administration
     */
    export interface IGenericIndexAdmin {
        id: number;
        label: string;
        code: string;
        createDate: Date;
        updateDate: Date;
    }

    /**
     * Simple index model used for administration
     */
    export interface ISimpleIndexAdmin extends IGenericIndexAdmin {
        reference: string;
        xpath: string;
        indexType: IIndexType;
        regex: string;
        color: string;
        displayOrder: string;
        dropdown: IDropdown;
        positionX: number;
        positionY: number;
        minLength: number;
        maxLength: number;
        prefix: string;
        suffix: string;
        required: boolean;
    }

    /**
     * composite index model used for administration
     */
    export interface ICompositeIndexAdmin extends IGenericIndexAdmin {
        childIndexes: ISimpleIndexAdmin[];
    }

    /**
     * Referential request model
     */
    export interface IReferentialRequest {
        trayId: number;
        indexId: number;
        searchId: Object;
    }

    /**
     * Referential index model
     */
    export interface IReferentialIndex {
        code: string;
        values: IItem[];
    }
}
