module arvato.demat.models {
    "use strict";

    export interface IUser {
        id: number;
        honorific: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        login: string;
        password: string;
        enabled: boolean;
        authorities: IRole[];
        authoritiesAsString;
    }

    export interface IRole {
        id: number;
        label: string;
    }

    export interface IRoleAdmin extends IRole {
        code: string;
        createDate: Date;
        updateDate: Date;
    }

    export interface IUserRolesAffectation {
        user: IUser;
        affectedRoles: IRole[];
        unaffectedRoles: IRole[];
    }
}
