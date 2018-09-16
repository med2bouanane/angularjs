module arvato.demat.models {
    "use strict";

    /**
     * The Envelope historic model
     */
    export interface IEnvSearchType {
        id: number;
        label: string;
    }

    /**
     * Simplified tray model used for navigation : dashbord, menu
     */
    export interface ITrayNavigation {
        id: number;
        label: string;
        color: string;
        icon: string;
        structuralEntityType: IStructuralEntityType;
        nbEnvelopes: number;
        authoritiesAsString: string;
    }

    export interface ITray {
        id: number;
        label: string;
        enabled: boolean;
        isDefault: boolean;
        type: ITrayType;
        structuralEntityType: IStructuralEntityType;
        comment: string;
        color: string;
        canPrint: boolean;
        docTypes: IDocumentType[];
        order: number;
        icon: string;
        envSearch: IEnvSearchType;
        accordionCloseOthers: boolean;
        authoritiesAccess: IRole[];
        nbRequiredIndex: number;
        predecessors: ITray[];
        nbEnvelopes: number;
        createDate: Date;
        updateDate: Date;
    }

    export interface ITrayDetail {
        id: number;
        label: string;
        enabled: boolean;
        isDefault: boolean;
        type: ITrayType;
        structuralEntityType: IStructuralEntityType;
        comment: string;
        color: string;
        canPrint: boolean;
        docTypes: IDocumentType[];
        order: number;
        icon: string;
        envSearch: IEnvSearchType;
        accordionCloseOthers: boolean;
        authoritiesAccess: IRole[];
        authoritiesAsString: string;
        nbRequiredIndex: number;
        predecessors: ITray[];
        nbEnvelopes: number;
        createDate: Date;
        updateDate: Date;
    }

    export interface ITrayDocTypesAffectation {
        tray: ITray;
        affectedDocTypes: IDocumentType[];
        unaffectedDocTypes: IDocumentType[];
    }

    export interface ITrayEnvTypesAffectation {
        tray: ITray;
        affectedEnvTypes: IEnvType[];
        unaffectedEnvTypes: IEnvType[];
    }

    export interface ITrayType {
        id: number;
        label: string;
        code: string;
    }

    export interface ITrayRolesAffectation {
        tray: ITray;
        affectedRoles: IRole[];
        unaffectedRoles: IRole[];
    }

    export interface ITrayRejectsAffectation {
        tray: ITray;
        affectedRejects: IRejectType[];
        unaffectedRejects: IRejectType[];
    }

    export interface ITrayIndexesAffectation {
        tray: ITray;
        affectedIndexes: IIndex[];
        unaffectedIndexes: ISimpleIndexAdmin[];
    }

    export interface IDocTypeIndexesAffectation {
        docType: IDocumentType;
        affectedIndexes: ISimpleIndexAdmin[];
        unaffectedIndexes: ISimpleIndexAdmin[];
    }

    export interface IEnvelope {
        id: number;
        label: string;
        comment: string;
        elementType: number;
        selected: string;
        collapsed: boolean;
        children: Array<IDocument>;
        categories: models.ICategory[]
        batch: IBatch;
        updateUser: string;
        lastUser: string;
        createDate: Date;
        updateDate: Date;
    }

    export interface IDocument {
        id: number;
        label: string;
        elementType: number;
        selected: string;
        collapsed: boolean;
        docType: IDocumentType;
        categories: models.ICategory[]
        indexes: models.IIndex[]
        pages: Array<Ipage>;
    }

    export interface Ipage {
        id: number;
        label: string;
        picPath: string;
        selected: string;
    }

    export interface IDocumentType {
        id: number;
        code: string;
        label: string;
        enabled: boolean;
        createDate: Date;
        updateDate: Date;
    }

    export interface IEnvType {
        id: number;
        code: string;
        label: string;
        docType: IDocumentType;
        enabled: boolean;
        createDate: Date;
        updateDate: Date;
    }

    export interface IBatch {
        id: number;
        label: string;
    }

    export interface IItem {
        id: number
        label: string;
        code: string;
        isDefault: Boolean;
    }

    export interface IList {
        id: number;
        label: string;
        items: Array<IListItem>;
        createDate: Date;
        updateDate: Date;
    }

    export interface IDropdown {
        id: number;
        label: string;
        items: Array<IDropdownItem>;
        createDate: Date;
        updateDate: Date;
    }

    export interface IListItem {
        id: number;
        code: string;
        label: string;
        defaultItem: Boolean;
        isEdit: boolean;
    }

    export interface IDropdownItem {
        id: number;
        code: string;
        label: string;
        defaultItem: Boolean;
        isEdit: boolean;
    }

    export interface IRule {
        tray: ITray;
        value: string;
        createDate: Date;
        updateDate: Date;
    }

    export interface IResponse {
        code: number;
        message: string;
        error: IError;
    }

    export interface IRecherche {
        batchId: number;
        envelopeId: number;
        sortType: string;
        sortReverse: boolean;
        startDate: Date;
        endDate: Date;
        currentPage: number;
        itemsPerPage: number;
    }

    export interface IEnvelopeSearch {
        envelopes: models.IEnvelope[];
        total: number;
    }

    export interface IImageSave {
        imagePath: string;
        angle: number;
    }

    export interface IDashboard {
        allIntegrated: number;
        allTreated: number;
        allDeleted: number;
        allExported: number;
        userTreated: number;
        treatedByUser: Object[][];
    }

    export interface ITrayByStep {

        label: string;

        nbClassfication: number;
        nbIndexation: number;
        nbRedirection: number;
        nbRejet: number;
        nbQualityCtrl: number;

        timeClassfication: number;
        timeIndexation: number;
        timeRedirection: number;
        timeRejet: number;
        timeQualityCtrl: number
    }

    export interface ISimpleChart {
        colors: string[];
        labels: string[];
        data: number[];
    }
}