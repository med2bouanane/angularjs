module arvato.demat.controller {
    "use strict";

    export class AdminTrayController extends GenericAdminController {

        static $inject: string[] = ["AdminTrayService", "AdminIndexService", "CategoryService", "$location"];

        private trays: models.ITray[];
        private trayTypes: models.ITrayType[];
        private structuralEntityTypes: models.IStructuralEntityType[];

        private trayEdit: models.ITray;
        private trayAdd: models.ITray;

        private trayDocTypesAffectation: models.ITrayDocTypesAffectation;
        private allDocTypes: models.IDocumentType[];
        private openPopinDocTypesAffectation: boolean;

        private trayEnvTypesAffectation: models.ITrayEnvTypesAffectation;
        private allEnvTypes: models.IEnvType[];
        private openPopinEnvTypesAffectation: boolean;

        private openPopinRoleAffectation: boolean;
        private allRoles: models.IRole[];
        private trayRolesAffectation: models.ITrayRolesAffectation;

        private openPopinRejectAffectation: boolean;
        private allTrayReject: models.IRejectType[];
        private trayRejectsAffectation: models.ITrayRejectsAffectation;

        private allIndexes: models.ISimpleIndexAdmin[];
        private trayIndexesAffectation: models.ITrayIndexesAffectation;
        private openPopinIndexAffectation: boolean;

        private sortableOptions = {connectWith: '.connectedList'};

        private openPopinDefaultTray: boolean;

        private openPopinTraysPriority: boolean;
        private traysInOrder: models.ITray[];
        private openPopinTraysWorkflow: boolean;

        private openAffectedTrayIndexeEdit: boolean;
        private trayIndexEdit: models.ISimpleIndexAdmin;

        private searchCriterion: models.IEnvSearchType[];

        private categories: models.IAdminCategory[];

        constructor(private adminTrayService: services.AdminTrayService, private adminIndexService: services.AdminIndexService, private categoryService: services.CategoryService, private $location: ng.ILocationService) {
            super();
            this.trayDocTypesAffectation = {
                tray: undefined,
                affectedDocTypes: undefined,
                unaffectedDocTypes: undefined
            };
            this.trayEnvTypesAffectation = {tray: undefined, affectedEnvTypes: undefined, unaffectedEnvTypes: undefined}
            this.trayRolesAffectation = {tray: undefined, affectedRoles: [], unaffectedRoles: []};
            this.trayRejectsAffectation = {tray: undefined, affectedRejects: [], unaffectedRejects: []};
            this.trayIndexesAffectation = {tray: undefined, affectedIndexes: [], unaffectedIndexes: []};
            this.loadAllTrays();
            this.loadAllTrayTypes();
            this.loadAllStructuralEntityType();
            this.loadAllTrayRejects();
            this.loadAllTrayRoles();
            this.loadAllTrayIndexes();


            this.loadAllEnvTypes();
            this.loadAllDocTypes();
            this.loadAllCategories();

            adminTrayService.loadTraysCriterion().then((data: models.IEnvSearchType[]) => {
                this.searchCriterion = data;
            });
        }

        /**
         * Load all trays
         */
        private loadAllTrays(): void {
            this.adminTrayService.loadTrays().then((trays: models.ITray[]) => {
                this.trays = trays;
            });
        }

        /**
         * Load all tray types
         */
        private loadAllTrayTypes(): void {
            this.adminTrayService.loadTrayTypes().then((trayTypes: models.ITrayType[]) => {
                this.trayTypes = trayTypes;
            });
        }

        /**
         * Load all tray sub type
         */
        private loadAllStructuralEntityType() {
            this.adminTrayService.loadStructuralEntityType().then((structuralEntityTypes: models.IStructuralEntityType[]) => {
                this.structuralEntityTypes = structuralEntityTypes;
            });
        }

        /**
         * Load all document type
         */
        private loadAllDocTypes() {
            this.adminTrayService.loadAllDocTypes().then((docTypes: models.IDocumentType[]) => {
                this.allDocTypes = docTypes;
            });
        }

        /**
         * Load all document type
         */
        private loadAllEnvTypes() {
            this.adminTrayService.loadAllEnvTypes().then((envTypes: models.IEnvType[]) => {
                this.allEnvTypes = envTypes;
            });
        }

        /**
         * Create new tray
         */
        public createTray(): void {
            if (this.trayAdd && this.trayAdd.type) {
                this.adminTrayService.createTray(this.trayAdd).then((tray: models.ITray) => {
                    this.trays.unshift(tray);
                    this.trayAdd = undefined;
                    this.openPopinAdd = false;
                });
            }
        }

        /**
         * check if tray creation is authorized
         */
        public isTrayFilled(tray: models.ITray): boolean {
            if (tray && tray.label && tray.type && tray.color && tray.icon && tray.structuralEntityType) {
                return true;
            }
            return false;
        }

        /**
         * Prepare tray deletion
         */
        public prepareDeleteTray(tray: models.ITray): void {
            this.trayEdit = tray;
            this.openPopinConfirm = true;
        }

        /**
         * Confirm tray deletion
         */
        public confirmDeleteTray(): void {
            this.adminTrayService.deleteTray(this.trayEdit.id).then(() => {
                for (var i = 0; i < this.trays.length; i++) {
                    if (this.trays[i].id === this.trayEdit.id) {
                        this.trays.splice(i, 1);
                        break;
                    }
                }
                this.openPopinConfirm = false;
                this.trayEdit = undefined;
            });
        }

        /**
         * Prepare update tray
         */
        protected prepareUpdateTray(tray: models.ITray): void {
            this.trayEdit = angular.copy(tray);
            this.openPopinEdit = true;
        }

        /**
         * Update tray
         */
        protected updateTray(): void {
            this.adminTrayService.updateTray(this.trayEdit).then((tray: models.ITray) => {
                for (var i = 0; i < this.trays.length; i++) {
                    if (this.trays[i].id === tray.id) {
                        this.trays.splice(i, 1, tray);
                        break;
                    }
                }
                this.openPopinEdit = false;
                this.trayEdit = undefined;
            });
        }

        /**
         * Manage tray doc types
         */
        protected manageTrayDocType(tray: models.ITray): void {
            switch (tray.structuralEntityType.code) {
                case '##STRUCTURAL_ENTITY_TYPE_CODE_ENVELOPE##':
                    this.openPopinEnvTypesAffectation = true;
                    this.trayEnvTypesAffectation.tray = tray;
                    this.adminTrayService.loadEnvTypes(tray.id).then((envTypes: models.IEnvType[]) => {
                        this.trayEnvTypesAffectation.affectedEnvTypes = envTypes;
                        this.trayEnvTypesAffectation.unaffectedEnvTypes = this.allEnvTypes;
                        for (var affectedEnvType of this.trayEnvTypesAffectation.affectedEnvTypes) {
                            for (var i = 0; i < this.trayEnvTypesAffectation.unaffectedEnvTypes.length; i++) {
                                if (this.trayEnvTypesAffectation.unaffectedEnvTypes[i].id === affectedEnvType.id) {
                                    this.trayEnvTypesAffectation.unaffectedEnvTypes.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });

                    break;
                case '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##':
                    this.openPopinDocTypesAffectation = true;
                    this.trayDocTypesAffectation.tray = tray;
                    this.adminTrayService.loadAllDocTypes().then((doctypes: models.IDocumentType[]) => {
                        this.trayDocTypesAffectation.affectedDocTypes = angular.copy(tray.docTypes);
                        this.trayDocTypesAffectation.unaffectedDocTypes = doctypes;
                        for (var affectedDocType of this.trayDocTypesAffectation.affectedDocTypes) {
                            for (var i = 0; i < this.trayDocTypesAffectation.unaffectedDocTypes.length; i++) {
                                if (this.trayDocTypesAffectation.unaffectedDocTypes[i].id === affectedDocType.id) {
                                    this.trayDocTypesAffectation.unaffectedDocTypes.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
                    break;

                default:
                    break;
            }
        }

        /**
         * Validate tray doc type
         */
        protected validateTrayDocTypes(): void {
            this.adminTrayService.updateTrayDocTypes(this.trayDocTypesAffectation.tray.id, this.trayDocTypesAffectation.affectedDocTypes).then(() => {
                this.openPopinDocTypesAffectation = false;
                this.loadAllTrays();
            });
        }

        /**
         * Validate tray doc type
         */
        protected validateTrayEnvTypes(): void {
            this.adminTrayService.updateTrayEnvTypes(this.trayEnvTypesAffectation.tray.id, this.trayEnvTypesAffectation.affectedEnvTypes).then(() => {
                this.openPopinEnvTypesAffectation = false;
                this.loadAllTrays();
            });
        }

        /**
         * Load all tray roles
         */
        protected loadAllTrayRoles(): void {
            this.adminTrayService.loadAllTrayRoles().then((roles: models.IRole[]) => {
                this.allRoles = roles;
            });
        }

        /**
         * Open tray roles affectation
         */
        protected openTrayRolesAffectation(tray: models.ITray): void {
            this.openPopinRoleAffectation = true;
            this.trayRolesAffectation.tray = tray;
            this.trayRolesAffectation.unaffectedRoles = angular.copy(this.allRoles);
            this.trayRolesAffectation.affectedRoles = angular.copy(tray.authoritiesAccess);
            for (var affectedRole of this.trayRolesAffectation.affectedRoles) {
                for (var i = 0; i < this.trayRolesAffectation.unaffectedRoles.length; i++) {
                    if (this.trayRolesAffectation.unaffectedRoles[i].id === affectedRole.id) {
                        this.trayRolesAffectation.unaffectedRoles.splice(i, 1);
                        break;
                    }
                }
            }
        }

        /**
         * Save tray roles
         */
        protected validateTrayRoles(): void {
            this.adminTrayService.updateOrCreateTrayRoles(this.trayRolesAffectation.tray.id, this.trayRolesAffectation.affectedRoles).then((result: any) => {
                this.openPopinRoleAffectation = false;
                this.loadAllTrays();
            });
        }

        /**
         * Load all indexes
         */
        public loadAllTrayIndexes(): void {
            this.adminIndexService.loadAllIndexes().then((indexes: models.ISimpleIndexAdmin[]) => {
                this.allIndexes = indexes;
            });
        }

        /**
         * Open tray roles affectation
         */
        protected openTrayIndexesAffectation(tray: models.ITray): void {
            this.openPopinIndexAffectation = true;
            this.trayIndexesAffectation.tray = tray;
            this.trayIndexesAffectation.unaffectedIndexes = angular.copy(this.allIndexes);
            this.adminTrayService.loadTrayIndexes(tray.id).then((trayIndexes: models.IIndex[]) => {
                this.trayIndexesAffectation.affectedIndexes = angular.copy(trayIndexes);
                for (var affectedIndex of this.trayIndexesAffectation.affectedIndexes) {
                    for (var i = 0; i < this.trayIndexesAffectation.unaffectedIndexes.length; i++) {
                        if (this.trayIndexesAffectation.unaffectedIndexes[i].id === affectedIndex.id) {
                            this.trayIndexesAffectation.unaffectedIndexes.splice(i, 1);
                            break;
                        }
                    }
                }
            });
        }

        /**
         * Save user roles
         */
        protected validateTrayIndexes(): void {
            this.adminTrayService.updateOrCreateTrayIndexes(this.trayIndexesAffectation.tray.id, this.trayIndexesAffectation.affectedIndexes).then((result: any) => {
                this.openPopinIndexAffectation = false;
            });
        }

        /**
         * Load all tray reject types
         */
        protected loadAllTrayRejects(): void {
            this.adminTrayService.loadAllTrayRejectTypes().then((trayRejects: models.IRejectType[]) => {
                this.allTrayReject = trayRejects;
            });
        }

        /**
         * Open tray reject types affectation
         */
        protected openTrayRejectsAffectation(tray: models.ITray): void {
            this.openPopinRejectAffectation = true;
            this.trayRejectsAffectation.tray = tray;
            this.trayRejectsAffectation.unaffectedRejects = angular.copy(this.allTrayReject);
            this.adminTrayService.loadTrayRejectTypes(tray.id).then((trayRejects: models.IRejectType[]) => {
                this.trayRejectsAffectation.affectedRejects = angular.copy(trayRejects);
                for (var affectedRole of this.trayRejectsAffectation.affectedRejects) {
                    for (var i = 0; i < this.trayRejectsAffectation.unaffectedRejects.length; i++) {
                        if (this.trayRejectsAffectation.unaffectedRejects[i].id === affectedRole.id) {
                            this.trayRejectsAffectation.unaffectedRejects.splice(i, 1);
                            break;
                        }
                    }
                }
            });
        }

        /**
         * Save tray reject types
         */
        protected validateTrayRejects(): void {
            this.adminTrayService.updateOrCreateTrayRejects(this.trayRejectsAffectation.tray.id, this.trayRejectsAffectation.affectedRejects).then((result: any) => {
                this.openPopinRejectAffectation = false;
            });
        }

        /**
         * Change default tray
         */
        protected changeDefaultTray(trayId: number): void {
            for (var tray of this.trays) {
                tray.isDefault = tray.id === trayId ? true : false;
            }
        }

        /**
         * validate default tray
         */
        protected validateDefaultTray(): void {
            for (var tray of this.trays) {
                if (tray.isDefault) {
                    this.adminTrayService.saveDefaultTray(tray.id).then(() => {
                        this.openPopinDefaultTray = false;
                    });
                    break;
                }
            }
        }

        /**
         * open popin to set trays priority
         */
        protected openTraysPriorityPoPin() {
            this.openPopinTraysPriority = true;
            this.traysInOrder = angular.copy(this.trays).sort(function (tray1, tray2) {
                return tray1.order - tray2.order;
            });
        }

        /**
         * save trays priority
         */
        protected validateTraysPriority(): void {
            var listTrayId: number[] = [];
            for (var tray of this.traysInOrder) {
                listTrayId.push(tray.id);
            }
            this.adminTrayService.saveTraysPriority(listTrayId).then(() => {
                this.openPopinTraysPriority = false;
            });
        }

        /**
         * open popup for edit tray indexe
         */
        protected openAffectedTrayIndexeEdition(index: models.ISimpleIndexAdmin): void {
            this.trayIndexEdit = index;
            this.openAffectedTrayIndexeEdit = true;
        }

        /**
         * Save a tray indexe parameted
         */
        protected editTrayIndex(): void {
            this.openAffectedTrayIndexeEdit = false;
        }

        /**
         * Check regex validity
         */

        public checkRegexValidity(indexRegex: string): boolean {
            var isValid = true;
            try {
                new RegExp(indexRegex);
            } catch (e) {
                isValid = false;
            }
            return isValid;
        }

        public loadAllCategories(): void {
            this.categoryService.loadAllCategories().then((categories: models.IAdminCategory[]) => {
                this.categories = categories;
            });
        }
    }

    app.controller("AdminTrayController", AdminTrayController);
}
