module arvato.demat.models {
    "use strict";

    /**
     * The Client model
     */
    export interface IClient {
        id: number;
        name: string;
        logo: string;
        enable: boolean;
    }
}
