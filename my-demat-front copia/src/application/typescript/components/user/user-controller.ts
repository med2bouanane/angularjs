module arvato.demat.controller {
    "use strict";

    export class UserController {

        static $inject: string[] = ["AdminUserService"];

        private passWordNotIdentique: boolean;
        private oldPassword: string;
        private newPassword: string;
        private confirmPassword: string;
        private openPopinConfirmChangePassword: boolean = false;

        constructor(private adminUserService: services.AdminUserService) {
        }

        /**
         * Reset form of change password
         */
        protected resetFormChangePwd(): void {
            this.passWordNotIdentique = undefined;
            this.oldPassword = undefined;
            this.newPassword = undefined;
            this.confirmPassword = undefined;
        }

        /**
         * Check if form to change password is well filled
         */
        protected isFormChangePwdFilled(): boolean {
            if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
                return false;
            } else {
                return true;
            }
        }

        /**
         * Prepare generate password
         */
        protected prepareChangePassword(): void {
            if (this.newPassword !== this.confirmPassword) {
                this.passWordNotIdentique = true;
            } else {
                this.openPopinConfirmChangePassword = true;
            }
        }
        /**
         * Change user password
         */
        protected changePassword(): void {
            this.adminUserService.updateUserPassword(this.oldPassword, this.newPassword).then(() => {
                this.openPopinConfirmChangePassword = false;
                this.oldPassword = undefined;
                this.newPassword = undefined
                this.confirmPassword = undefined;
            });
        }
    }

    app.controller("UserController", UserController);
}