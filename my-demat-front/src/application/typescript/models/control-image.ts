module arvato.demat.models.controlimage {
    "use strict";
    
    export interface IBatch {
        label: string;
        id: number;
        pliNumber: number;
    }
    
    export interface IRecherche {
        batchId: number;
        sortType: string;
        sortReverse: boolean;
        startDate: Date;
        endDate: Date;
        currentPage: number;
        itemsPerPage: number;
    }
    
    export interface IBatchSearch {
        batchs: IBatch[];
        total: number;
    }

    export interface IBatchTree{
        id: number;
        name: string;
        envelopes: IEnvelope[];

        label:string;
        nodes: IEnvelope[];
        elementType:number;
    }

    export interface IEnvelope{
        id: number;
        number:string;
        documents: IDocument[];
        batchId:number;

        label:string;
        elementType:number;
        nodes: IDocument[];
        hidden:boolean;
        deleted:boolean;
    }

    export interface IDocument{
        id: number;
        name:string;
        pages: IPage[];
        envelopeId:number;

        label:string;
        elementType:number;
        nodes: IPage[];
        deleted:boolean;
    }

    export interface IPage{
        id: number;
        name: string;
        imagePath:string;

        label:string;
        elementType:number;
        deleted:boolean;
    }
}