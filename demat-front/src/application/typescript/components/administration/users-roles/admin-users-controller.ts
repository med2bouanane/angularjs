module arvato.demat.controller {
    "use strict";

    export class AdminUsersController extends GenericAdminController {

        static $inject: string[] = ["AdminUserService", "$location"];

        private users: models.IUser[];

        private userEdit: models.IUser;
        private userAdd: models.IUser;
        private user: models.IUser;
        private openPopinConfirmGeneratePassword: boolean = false;

        private roles: models.IRole[];
        private roleEdit: models.IRoleAdmin;
        private roleAdd: models.IRoleAdmin;
        private openPopinRoleEdit: boolean;
        private openPopinRoleAdd: boolean;
        private openPopinRoleConfirm: boolean;

        private userRolesAffectation: models.IUserRolesAffectation;
        private openPopinRoleAffectation: boolean;
        private sortableOptions = { connectWith: '.connectedList' };

        constructor(private adminUserService: services.AdminUserService, private $location: ng.ILocationService) {
            super();
            this.userRolesAffectation = { user: undefined, affectedRoles: [], unaffectedRoles: [] };
        }

        /**
         * Load all roles
         */
        public loadAllRoles(): void {
            this.currentPage = 1;
            this.adminUserService.loadAllUserRoles().then((roles: models.IRole[]) => {
                this.roles = roles;
            });
        }

        /**
         * Load all users
         */
        public loadAllUsers(): void {
            this.adminUserService.loadUsers().then((result: models.IUser[]) => {
                this.users = result;
                this.loadAllRoles();
            });
        }

        /**
         * check if user creation is authorized
         */
        public isUserFilled(user: models.IUser): boolean {
            if (user && user.honorific && user.lastName && user.firstName && user.email && user.login) {
                return true;
            }
            return false;
        }

        /**
         * Create new user
         */
        public createUser(): void {
            this.adminUserService.createUser(this.userAdd).then((user: models.IUser) => {
                this.users.unshift(user);
                this.userAdd = undefined;
                this.openPopinAdd = false;
            });
        }

        /**
         * Prepare user deletion
         */
        public prepareDeleteUser(user: models.IUser): void {
            this.userEdit = user;
            this.openPopinConfirm = true;
        }

        /**
         * confirm  user deletion
         */
        public confirmDeleteUser(): void {
            this.adminUserService.deleteUser(this.userEdit.id).then(() => {
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].id === this.userEdit.id) {
                        this.users.splice(i, 1);
                        break;
                    }
                }
                this.openPopinConfirm = false;
                this.userEdit = undefined;
            });
        }

        /**
         * Prepare user update
         */
        public prepareUpdateUser(user: models.IUser): void {
            this.userEdit = angular.copy(user);
            this.openPopinEdit = true;
        }

        /**
         * Confirm user update
         */
        public updateUser(): void {
            this.adminUserService.updateUser(this.userEdit).then((user: models.IUser) => {
                for (var i = 0; i < this.users.length; i++) {
                    if (this.users[i].id === user.id) {
                        this.users.splice(i, 1, user);
                        break;
                    }
                }
                this.openPopinEdit = false;
                this.userEdit = undefined;
            });
        }

        /**
         * Open user roles affectation 
         */
        public openUserRolesAffectation(user: models.IUser): void {
            this.openPopinRoleAffectation = true;
            this.userRolesAffectation.user = user;
            this.userRolesAffectation.unaffectedRoles = angular.copy(this.roles);
            this.userRolesAffectation.affectedRoles = angular.copy(user.authorities);
            for (var affectedRole of this.userRolesAffectation.affectedRoles) {
                for (var i = 0; i < this.userRolesAffectation.unaffectedRoles.length; i++) {
                    if (this.userRolesAffectation.unaffectedRoles[i].id === affectedRole.id) {
                        this.userRolesAffectation.unaffectedRoles.splice(i, 1);
                        break;
                    }
                }
            }
        }

        /**
         * Save user roles
         */
        protected validateUserRoles(): void {
            this.adminUserService.updateOrCreateUserRoles(this.userRolesAffectation.user.id, this.userRolesAffectation.affectedRoles).then((result: any) => {
                this.openPopinRoleAffectation = false;
                this.loadAllUsers();
            });
        }

        /**
         * Prepare generate password
         */
        public prepareGenerateNewPassword(user: models.IUser): void {
            this.userEdit = angular.copy(user);
            this.openPopinConfirmGeneratePassword = true;
        }

        /**
         * Prepare generate password
        */
        public confirmGenerateNewPassword(): void {
            this.adminUserService.generateNewUserPassword(this.userEdit.id).then(() => {
                this.openPopinConfirmGeneratePassword = false;
                this.userEdit = undefined;
            });
        }

        /**
         * check if user creation is authorized
         */
        public isRoleFilled(role: models.IRoleAdmin): boolean {
            if (role && role.label && role.code) {
                return true;
            }
            return false;
        }

        /**
         * Create new role
         */
        public createRole(): void {
            this.adminUserService.createRole(this.roleAdd).then((role: models.IRoleAdmin) => {
                this.roles.unshift(role);
                this.roleAdd = undefined;
                this.openPopinRoleAdd = false;
            });
        }

        /**
         * Prepare role deletion
         */
        public prepareDeleteRole(role: models.IRoleAdmin): void {
            this.roleEdit = role;
            this.openPopinRoleConfirm = true;
        }

        /**
         * confirm role deletion
         */
        public confirmDeleteRole(): void {
            this.adminUserService.deleteRole(this.roleEdit.id).then(() => {
                for (var i = 0; i < this.roles.length; i++) {
                    if (this.roles[i].id === this.roleEdit.id) {
                        this.roles.splice(i, 1);
                        break;
                    }
                }
                this.openPopinRoleConfirm = false;
                this.roleEdit = undefined;
            });
        }

        /**
         * Prepare role update
         */
        public prepareUpdateRole(role: models.IRoleAdmin): void {
            this.roleEdit = angular.copy(role);
            this.openPopinRoleEdit = true;
        }

        /**
         * Confirm user update
         */
        public updateRole(): void {
            this.adminUserService.updateRole(this.roleEdit).then((role: models.IRoleAdmin) => {
                for (var i = 0; i < this.roles.length; i++) {
                    if (this.roles[i].id === role.id) {
                        this.roles.splice(i, 1, role);
                        break;
                    }
                }
                this.openPopinRoleEdit = false;
                this.roleEdit = undefined;
            });
        }
    }

    app.controller("AdminUsersController", AdminUsersController);
}

