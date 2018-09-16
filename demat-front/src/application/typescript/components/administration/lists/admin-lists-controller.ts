module arvato.demat.controller {
    "use strict";

    export class AdminListsController extends GenericAdminController {

        static $inject: string[] = ["AdminListService", "AdminIndexService", "Constants"];

        private lists: models.IList[];
        private listEdit: models.IList;
        private listAdd: models.IList;

        private openPopinConfirmEditListItem: boolean = false;
        private editItemPopinListItem: boolean = false;

        private doctyes: models.IDocumentType[];
        private doctypeEdit: models.IDocumentType;
        private doctypeAdd: models.IDocumentType;
        private openPopinDoctypeAdd: Boolean;
        private openPopinDoctypeEdit: Boolean;
        private openPopinDoctypeConfirm: Boolean;

        private envTypes: models.IEnvType[];
        private envtypeEdit: models.IEnvType;
        private envtypeAdd: models.IEnvType;
        private openPopinEnvtypeAdd: Boolean;
        private openPopinEnvtypeEdit: Boolean;
        private openPopinEnvtypeConfirm: Boolean;

        private allIndexes: models.ISimpleIndexAdmin[];

        private rejectTypes: models.IRejectTypeAdmin[];
        private rejectTypeEdit: models.IRejectTypeAdmin;
        private rejectTypeAdd: models.IRejectTypeAdmin;

        private structuralEntityTypes: models.IStructuralEntityType[];

        private openPopinRejectTypeAdd: Boolean;
        private openPopinRejectTypeEdit: Boolean;
        private openPopinRejectTypeConfirm: Boolean;

        private categories: models.IAdminCategory[];
        private categoryEdit: models.IAdminCategory;
        private categoryAdd: models.IAdminCategory;
        private openPopinCategoryAdd: Boolean;
        private openPopinCategoryEdit: Boolean;
        private openPopinCategoryConfirm: Boolean;

        constructor(private adminListService: services.AdminListService, private adminIndexService: services.AdminIndexService, private constants: constants.Constants) {
            super();
            this.adminListService.loadStructuralEntityTypes().then((structuralEntityTypes: models.IStructuralEntityType[]) => {
                this.structuralEntityTypes = structuralEntityTypes;
            });
        }

        /**
         * Load list
         */
        public loadLists(): void {
            this.adminListService.loadLists().then((lists: models.IList[]) => {
                this.lists = lists;
            });
        }

        /**
         * Create new list
         */
        public createList(): void {
            if (this.listAdd && this.listAdd.label) {
                this.adminListService.createList(this.listAdd).then((list: models.IList) => {
                    this.loadLists();
                    this.listAdd = undefined;
                    this.openPopinAdd = false;
                });
            }
        }

        /**
         * Prepare list deletion
         */
        public prepareDeleteList(list: models.IList): void {
            this.listEdit = list;
            this.openPopinConfirm = true;
        }

        /**
         * Confirm list deletion
         */
        public confirmDeleteList(): void {
            this.adminListService.deleteList(this.listEdit.id).then(() => {
                for (var i = 0; i < this.lists.length; i++) {
                    if (this.lists[i].id === this.listEdit.id) {
                        this.lists.splice(i, 1);
                        break;
                    }
                }
                this.openPopinConfirm = false;
                this.listEdit = undefined;
            });
        }

        /**
         * Prepare list update
         */
        public prepareUpdateList(list: models.IList): void {
            this.listEdit = angular.copy(list);
            if (!this.listEdit.items) {
                this.listEdit.items = [];
            }
            this.openPopinEdit = true;
        }

        /**
         * Update list
         */
        public updateList(): void {
            this.adminListService.updateList(this.listEdit).then((list: models.IList) => {
                for (var i = 0; i < this.lists.length; i++) {
                    if (this.lists[i].id === list.id) {
                        this.lists.splice(i, 1);
                        this.lists.unshift(list);
                        break;
                    }
                }
                this.openPopinEdit = false;
                this.listEdit = undefined;
            });
        }

        /**
         * Manage list items
         */
        public manageListItems(list: models.IList): void {
            this.listEdit = angular.copy(list);
            this.openPopinConfirmEditListItem = true;
        }

        /**
         * Delete item from list
         */
        public deleteItemFromList(itemIndex: number): boolean {
            this.listEdit.items.splice(itemIndex, 1)
            return true;
        }

        /**
         * Add new item to list
         */
        public addItemToList(itemToAdd: models.IListItem): void {
            this.listEdit.items.push(angular.copy(itemToAdd));
            if (itemToAdd.defaultItem == true) {
                this.setDefaultListItem(this.listEdit.items.length - 1)
            }
            itemToAdd.label = undefined;
            itemToAdd.code = undefined;
            itemToAdd.defaultItem = undefined;
        }

        /**
         * validate list items
         */
        public validateListItems(): void {
            console.log(angular.toJson(this.listEdit.items));
            this.adminListService.createListItems(this.listEdit.id, this.listEdit.items).then((items: models.IListItem[]) => {
                this.openPopinConfirmEditListItem = false;
                for (var list of this.lists) {
                    if (list.id === this.listEdit.id) {
                        list.items = items;
                        this.listEdit = undefined;
                        break;
                    }
                }
            });
        }

        /**
         * set defaultItem list items
         */
        public setDefaultListItem(index: number): void {
            for (var i = 0; i < this.listEdit.items.length; i++) {
                if (i !== index) {
                    this.listEdit.items[i].defaultItem = false;
                }
            }
        }

        /**
         * Load document types
         */
        public loadDocTypes(): void {
            this.adminListService.loadDocTypes().then((doctyes: models.IDocumentType[]) => {
                this.doctyes = doctyes;
            });
            this.loadAllIndexes();
        }

        /**
         * Create new document type
         */
        public createDocType(): void {
            if (this.doctypeAdd && this.doctypeAdd.label) {
                this.adminListService.createDocType(this.doctypeAdd).then((doctype: models.IDocumentType) => {
                    this.doctyes.unshift(doctype);
                    this.doctypeAdd = undefined;
                    this.openPopinDoctypeAdd = false;
                });
            }
        }

        /**
         * Open document type deletion confirmation
         */
        public prepareDeleteDocType(doctype: models.IDocumentType): void {
            this.doctypeEdit = doctype;
            this.openPopinDoctypeConfirm = true;
        }

        /**
         * Confirm document type deletion
         */
        public confirmDeleteDocType(): void {
            this.adminListService.deleteDocType(this.doctypeEdit.id).then(() => {
                for (var i = 0; i < this.doctyes.length; i++) {
                    if (this.doctyes[i].id === this.doctypeEdit.id) {
                        this.doctyes.splice(i, 1);
                        break;
                    }
                }
                this.openPopinDoctypeConfirm = false;
                this.doctypeEdit = undefined;
            });
        }

        /**
         * Prepare document type update
         */
        public prepareUpdateDocType(doctype: models.IDocumentType): void {
            this.doctypeEdit = angular.copy(doctype);
            this.openPopinDoctypeEdit = true;
        }

        /**
         * update document type
         */
        public updateDocType(): void {
            this.adminListService.updateDocType(this.doctypeEdit).then((doctype: models.IDocumentType) => {
                for (var i = 0; i < this.doctyes.length; i++) {
                    if (this.doctyes[i].id === doctype.id) {
                        this.doctyes.splice(i, 1);
                        this.doctyes.unshift(doctype);
                        break;
                    }
                }
                this.openPopinDoctypeEdit = false;
                this.doctypeEdit = undefined;
            });
        }

        /**
         * Load envelope types
         */
        public loadEnvTypes(): void {
            this.loadDocTypes();
            this.adminListService.loadEnvTypes().then((envTypes: models.IEnvType[]) => {
                this.envTypes = envTypes;
            });
        }

        /**
         * Create new envelope type
         */
        public createEnvtype(): void {
            if (this.envtypeAdd && this.envtypeAdd.label) {
                this.adminListService.createEnvType(this.envtypeAdd).then((envType: models.IEnvType) => {
                    this.envTypes.unshift(envType);
                    this.envtypeAdd = undefined;
                    this.openPopinEnvtypeAdd = false;
                });
            }
        }

        /**
         * Open envelope type deletion confirmation
         */
        public prepareDeleteEnvType(envType: models.IEnvType): void {
            this.envtypeEdit = envType;
            this.openPopinEnvtypeConfirm = true;
        }

        /**
         * Confirm envelope type deletion
         */
        public confirmDeleteEnvType(): void {
            this.adminListService.deleteEnvType(this.envtypeEdit.id).then(() => {
                for (var i = 0; i < this.envTypes.length; i++) {
                    if (this.envTypes[i].id === this.envtypeEdit.id) {
                        this.envTypes.splice(i, 1);
                        break;
                    }
                }
                this.openPopinEnvtypeConfirm = false;
                this.envtypeEdit = undefined;
            });
        }

        /**
         * Prepare envelope type update
         */
        public prepareUpdateEnvType(envType: models.IEnvType): void {
            this.envtypeEdit = angular.copy(envType);
            this.openPopinEnvtypeEdit = true;
        }

        /**
         * Update envelope type
         */
        public updateEnvType(): void {
            this.adminListService.updateEnvType(this.envtypeEdit).then((envtype: models.IEnvType) => {
                for (var i = 0; i < this.envTypes.length; i++) {
                    if (this.envTypes[i].id === envtype.id) {
                        this.envTypes.splice(i, 1);
                        this.envTypes.unshift(envtype);
                        break;
                    }
                }
                this.openPopinEnvtypeEdit = false;
                this.envtypeEdit = undefined;
            });
        }

        /**
         * Load all indexes
         */
        private loadAllIndexes(): void {
            this.adminIndexService.loadAllIndexes().then((indexes: models.ISimpleIndexAdmin[]) => {
                this.allIndexes = indexes;
            });
        }

        /**
         * Load reject types
         */
        public loadRejectTypes(): void {
            this.loadDocTypes();
            this.adminListService.loadRejectTypes().then((rejectTypes: models.IRejectTypeAdmin[]) => {
                this.rejectTypes = rejectTypes;
                console.log('this.rejectTypes => ' + this.rejectTypes);
            });
        }

        /**
         * Create new reject type
         */
        public createRejectType(): void {
            if (this.rejectTypeAdd && this.rejectTypeAdd.label) {
                console.log(this.rejectTypeAdd);
                this.adminListService.createRejectType(this.rejectTypeAdd).then((rejectType: models.IRejectTypeAdmin) => {
                    this.rejectTypes.unshift(rejectType);
                    this.rejectTypeAdd = undefined;
                    this.openPopinRejectTypeAdd = false;
                });
            }
        }

        /**
         * Prepare reject type update
         */
        public prepareUpdateRejectType(rejectType: models.IRejectTypeAdmin): void {
            console.log(this.rejectTypeEdit);
            this.rejectTypeEdit = angular.copy(rejectType);
            this.openPopinRejectTypeEdit = true;
        }

        /**
         * Update reject type
         */
        public updateRejectType(): void {
            console.log(this.rejectTypeEdit);
            this.adminListService.updateRejectType(this.rejectTypeEdit).then((rejectType: models.IRejectTypeAdmin) => {
                for (var i = 0; i < this.rejectTypes.length; i++) {
                    if (this.rejectTypes[i].id === rejectType.id) {
                        this.rejectTypes.splice(i, 1);
                        this.rejectTypes.unshift(rejectType);
                        break;
                    }
                }
                this.rejectTypeEdit = undefined;
                this.openPopinRejectTypeEdit = false;
            });
        }

        /**
         * Open reject type deletion confirmation
         */
        public prepareDeleteRejectType(rejectType: models.IRejectTypeAdmin): void {
            this.rejectTypeEdit = rejectType;
            this.openPopinRejectTypeConfirm = true;
        }

        /**
         * Confirm reject type deletion
         */
        public confirmDeleteRejectType(): void {
            this.adminListService.deleteRejectType(this.rejectTypeEdit.id).then(() => {
                for (var i = 0; i < this.rejectTypes.length; i++) {
                    if (this.rejectTypes[i].id === this.rejectTypeEdit.id) {
                        this.rejectTypes.splice(i, 1);
                        break;
                    }
                }
                this.openPopinRejectTypeConfirm = false;
                this.rejectTypeEdit = undefined;
            });
        }


        /**
         * Load categories
         */
        public loadCategories(): void {
            this.adminListService.loadCategories().then((categories: models.IAdminCategory[]) => {
                this.categories = categories;
            });
        }

        /**
         * load possible category colors
         */
        public getCategoryColorValues(): string[] {
            return this.constants.colors;
        }

        /**
         * load possible category types
         */
        public getCategoryTypeValues(): string[] {
            return this.constants.categoryTypes;
        }

        /**
         * check if category is well filled
         */
        public isCategoryFilled(category: models.IAdminCategory): boolean {
            if (category && category.label && category.type) {
                return true;
            }
            return false;
        }

        /**
         * Create new category
         */
        public createCategory(): void {
            this.adminListService.createCategory(this.categoryAdd).then((category: models.IAdminCategory) => {
                this.categories.unshift(category);
                this.categoryAdd = undefined;
                this.openPopinCategoryAdd = false;
            });
        }

        /**
         * Prepare category update
         */
        public prepareUpdateCategory(category: models.IAdminCategory): void {
            this.categoryEdit = angular.copy(category);
            this.openPopinCategoryEdit = true;
        }

        /**
         * Update category
         */
        public updateCategory(): void {
            this.adminListService.updateCategory(this.categoryEdit).then((category: models.IAdminCategory) => {
                for (var i = 0; i < this.categories.length; i++) {
                    if (this.categories[i].id === category.id) {
                        this.categories.splice(i, 1);
                        this.categories.unshift(category);
                        break;
                    }
                }
                this.categoryEdit = undefined;
                this.openPopinCategoryEdit = false;
            });
        }

        /**
         * Open category deletion confirmation
         */
        public prepareDeleteCategory(category: models.IAdminCategory): void {
            this.categoryEdit = category;
            this.openPopinCategoryConfirm = true;
        }

        /**
         * Confirm category deletion
         */
        public confirmDeleteCategory(): void {
            this.adminListService.deleteCategory(this.categoryEdit.id).then(() => {
                for (var i = 0; i < this.categories.length; i++) {
                    if (this.categories[i].id === this.categoryEdit.id) {
                        this.categories.splice(i, 1);
                        break;
                    }
                }
                this.openPopinCategoryConfirm = false;
                this.categoryEdit = undefined;
            });
        }
    }

    app.controller("AdminListsController", AdminListsController);
}