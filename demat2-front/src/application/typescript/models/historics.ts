module arvato.demat.models {
    "use strict";

    /**
     * The Envelope historic model
     */
    export interface IEnvelopeHistoric {
        id: number;
        label: string;
        trayOrigin: string;
        trayDestination: string;
        user: string;
        date: Date;
    }

    /**
     * The Batch historic model
     */
    export interface IBatchHistoric {
        id: number;
        batNumber: number;
        name: string;
        createDate: Date;
        nbDeletedEnv: number;
        nbTreatedEnv: number;
        nbPendingEnv: number;
    }
}
