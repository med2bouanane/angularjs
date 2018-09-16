module arvato.demat.models {
    "use strict";

    /**
     * The XPath expression model
     */
    export interface IXPathExpr {
        id: number;
        batch: string;
        batchId: string
        batchName: string;
        envelope: string;
        envelopeUrl: string;
        envelopeId: string;
        document: string;
        documentName: string;
        documentType: string;
        page: string;
        pageName: string;
        pagePicture: string;
        pageType: string;
        refIndexDoc: string;
        refIndexEnv: string;
    }

    export interface IRegex {
        label: string;
        regex: string;
        referencialQuery: IReferencialQuery;
        xpathExpr: IXPathExpr;
        createDate: Date;
        updateDate: Date;
    }
}