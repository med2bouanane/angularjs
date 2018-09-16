module arvato.demat.services {
    "use strict";

    export class Session {

        private id: number;
        public login: string;
        private firstName: string;
        private civility: string;
        private lastName: string;
        private email: string;
        private phone: string;
        private honorific: string;
        private authoritiesAsString: string;
        public userRoles = [];

        constructor() {
            return this;
        }

        public create(data) {
            this.id = data.id;
            this.login = data.login;
            this.firstName = data.firstName;
            this.honorific = data.honorific;
            this.lastName = data.lastName;
            this.email = data.email;
            this.phone = data.phone;
            this.authoritiesAsString = data.authoritiesAsString;
            this.userRoles = [];
            angular.forEach(data.authorities, function (value, key) {
                this.push(value.label);
            }, this.userRoles);
        }

        public invalidate() {
            this.id = null;
            this.login = null;
            this.firstName = null;
            this.lastName = null;
            this.civility = null;
            this.email = null;
            this.phone = null;
            this.userRoles = null;
        }
    }

    app.service("Session", Session);
}