module arvato.demat.services {
    "use strict";

    import IError = arvato.demat.models.IError;

    interface IAppSharedRootScope extends ng.IRootScopeService {
        isLoading: boolean;
        showAlert: boolean;
        msgAlert: string;
        error: string;
        errorObject: models.IError;
    }

    export class AppSharedService {

        static $inject: string[] = ["$rootScope"];

        constructor(private rootScope: IAppSharedRootScope) {
        }

        public displayLoading(): void {
            this.rootScope.isLoading = true;
        }

        public closeLoading(): void {
            this.rootScope.isLoading = false;
        }

        public notifyError(error: string): void {
            this.rootScope.error = error;
            this.closeLoading();
        }

        public notifyErrorWithObjectError(error: string, object: any): void {
            this.rootScope.error = error;
            this.rootScope.errorObject = object;
            this.closeLoading();
        }

        public getError(): string {
            return this.rootScope.error;
        }

        public getErrorObject(): IError {
            return this.rootScope.errorObject;
        }

        public showAlert(msg: string): void {
            this.rootScope.showAlert = true;
            this.rootScope.msgAlert = msg;
        }

        public closeAlert(): void {
            this.rootScope.showAlert = false;
        }
    }

    app.service("AppSharedService", AppSharedService);
}
