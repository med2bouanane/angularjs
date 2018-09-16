module arvato.demat.services {
    "use strict";

    export class AdminUserService {

        static $inject: string[] = ["$http", "AppSharedService", "$q"];

        private httpAddress: string = "##URL_REST##";

        constructor(private http: ng.IHttpService, private appSharedService: services.AppSharedService, private q: ng.IQService) {
        }

        /**
         * Load all users
         */
        public loadUsers(): ng.IPromise<models.IUser[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IUser[]>(this.httpAddress + "/admin/users").success((data: models.IUser[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading users');
            });
            return deferred.promise;
        }

        /**
         * Create user 
         */
        public createUser(user: models.IUser): ng.IPromise<models.IUser> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IUser>(this.httpAddress + "/admin/users", user).success((data: models.IUser) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating new user');
            });
            return deferred.promise;
        }

        /**
         * Delete user
         */
        public deleteUser(userId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/users/" + userId).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                console.log(error);
                deferred.reject('problem occured when deleting user id' + userId);
            });
            return deferred.promise;
        }

        /**
         * Update user
         */
        public updateUser(user: models.IUser): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/admin/users", user).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating user');
            });
            return deferred.promise;
        }

        /**
         * Load all user roles
         */
        public loadAllUserRoles(): ng.IPromise<models.IRole[]> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.get<models.IRole[]>(this.httpAddress + "/admin/users/roles").success((data: models.IRole[]) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when loading users roles');
            });
            return deferred.promise;
        }

        /**
         * Update or create user roles
         */
        public updateOrCreateUserRoles(userId: number, userRoles: models.IRole[]) {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/admin/users/" + userId + "/roles", userRoles).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject("problem occured when updating user roles");
            });
            return deferred.promise;
        }

        /**
         * Change user password
         */
        public updateUserPassword(oldPassword: string, newPassWord: string) {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/security/password", { 'current-password': oldPassword, 'new-password': newPassWord }).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating user password');
            });
            return deferred.promise;
        }

        /**
         * Change user password
         */
        public generateNewUserPassword(userId: number) {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/admin/users/" + userId + "/generate", {}).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when generating new user password, user id : ' + userId);
            });
            return deferred.promise;
        }


        /**
        * Create role 
        */
        public createRole(role: models.IRoleAdmin): ng.IPromise<models.IRoleAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.post<models.IRoleAdmin>(this.httpAddress + "/admin/users/roles", role).success((data: models.IRoleAdmin) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when creating new role');
            });
            return deferred.promise;
        }

        /**
         * Delete role
         */
        public deleteRole(roleId: number): ng.IPromise<any> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.delete(this.httpAddress + "/admin/users/roles/" + roleId).success((data: any) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when deleting role id' + roleId);
            });
            return deferred.promise;
        }

        /**
         * Update role
         */
        public updateRole(role: models.IRoleAdmin): ng.IPromise<models.IRoleAdmin> {
            this.appSharedService.displayLoading();
            var deferred = this.q.defer();
            this.http.put(this.httpAddress + "/admin/users/roles", role).success((data: models.IRoleAdmin) => {
                deferred.resolve(data);
                this.appSharedService.closeLoading();
            }).catch((error: any) => {
                deferred.reject('problem occured when updating role');
            });
            return deferred.promise;
        }
    }

    app.service('AdminUserService', AdminUserService);
}
