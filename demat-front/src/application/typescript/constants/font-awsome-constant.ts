module arvato.demat.constants {
    "use strict";

    /**
     * font awsome icon version 4.7.0
     */
    export class Constants /*implements IMyConstant*/ {

        colors: string[] = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

        categoryTypes: string[] = ['table', 'list'];

        ERROR_500_PATH: string = "error/500";

        constructor() {
        }

        static get getConstant() {
            return new Constants();
        }
    }

    app.constant('Constants', Constants.getConstant);
}