module arvato.demat.controller {
    "use strict";

    export class HelperController {

        constructor() {
        }

        public calculateClass(column: string) {
            let style;
            switch (column) {
                case "CREATE_DATE":
                case "UPDATE_DATE":
                case "REGEX":
                case "ACTION":
                case "REFERENCE":
                case "DISPLAY_ORDER":
                case "MAX_LENGTH":
                case "MIN_LENGTH":
                case "PREFIX":
                case "REQUIRED":
                    style ={
                        textAlign: 'center'
                    }
                    break;
            }
            return style;
        }
    }
    app.controller("HelperController", HelperController);

}


