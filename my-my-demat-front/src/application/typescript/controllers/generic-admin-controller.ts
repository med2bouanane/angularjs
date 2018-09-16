module arvato.demat.controller {
    "use strict";

    export class GenericAdminController {

        protected currentPage: number = 1;
        protected itemsPerPage: number = 13;
        protected maxSize: number = 13;

        protected openPopinConfirm: Boolean = false;
        protected openPopinEdit: Boolean = false;
        protected openPopinAdd: Boolean = false;

        constructor() {
        }
    }
}

