module arvato.demat.controller {
    "use strict";

    interface IRouteParamsEnvelope extends ng.route.IRouteParamsService {
        envelopeId: number;
    }

    export interface ITreeScope extends ng.IScope {
        tree: models.ISelectedTree;
        fileInput: string;
        overlays: Array<Object>;
        options: Object;
        treedata: models.INode;
        treedataArray: Array<models.INode>;
        imageAddress: string;
        currentTray: models.ITray;
        openPopPinReject: boolean;
        openPopSendBack: boolean;
    }

    export class EnvelopeDetailController {

        static $inject: string[] = ["TrayService", "$scope", "$routeParams", "$location", "hotkeys", "$timeout", "HelperController"];

        private pagesPictures: Array<models.INode> = [];
        private envelopeObject: models.IEnvelope;
        private currentDate: number;
        private currentTray: models.ITray;
        private docTypes: models.IDocumentType[];
        private envTypes: models.IEnvType[];
        private rejectTypes: models.IRejectType[];
        private envType: models.IEnvType;
        private imageSave: models.IImageSave = {imagePath: undefined, angle: undefined};

        private isControleQualityValidated: boolean;

        constructor(private trayService: services.TrayService, private $scope: ITreeScope, private routeParams: IRouteParamsEnvelope, private $location: ng.ILocationService, private hotkeys, private $timeout) {

            if (!this.trayService.currentTray) {
                //refresh with F5 keyboard
                this.$location.path("/home");
            } else {

                this.$scope.options = {
                    controls: {toolbar: false, fit: 'height'},
                    zoom: {value: 0.25, step: 0.01},
                    rotate: {value: 90}
                };

                $scope.imageAddress = "##URL_IMG##";

                this.$scope.currentTray = this.trayService.currentTray;
                this.currentTray = this.trayService.currentTray;

                this.createSortcuts($scope, $timeout);

                this.docTypes = this.trayService.docTypes;

                this.envTypes = this.trayService.envTypes;
                console.log("this?envTypes => " + angular.toJson(this.envTypes));

                this.rejectTypes = this.trayService.rejectTypes;


                this.trayService.loadEnvelope(routeParams.envelopeId).then((envelope: models.IEnvelope) => {

                    if (!envelope) {
                        this.$location.path("/tray-detail/" + this.currentTray.id);
                    } else {
                        this.envelopeObject = envelope;
                    }
                });

                // TODO : prevoir le meme chose quelque soit le niveau de structure
                this.trayService.loadEnvelopeTree(routeParams.envelopeId).then((node: models.INode) => {
                    // inform tree view
                    this.$scope.treedata = node;
                    this.$scope.treedataArray = [node];

                    console.log("treedata => " + angular.toJson($scope.treedata));

                    this.$scope.tree.currentNode = node.children[0]; // code uniquement valid pour les envelopes?
                    console.log("tree => " + angular.toJson(this.$scope.tree.currentNode));

                    switch (this.currentTray.type.code) {
                        case '##TRAY_INDEX_TYPE##':
                        case '##TRAY_QUALITY_TYPE##':
                            this.$scope.treedata.children[0].selected = 'selected';
                            break;
                        case '##TRAY_CLASSIF_TYPE##':
                            this.selectNextDocumentWithoutType();
                            break;
                        default:
                            this.$scope.treedata.children[0].selected = 'selected';
                    }


                    console.log(' => ' + this.$scope.treedata.children);
                    for (var document of this.$scope.treedata.children) {
                        console.log(document.children);
                        for (var page of document.children) {
                            this.pagesPictures.push(page);
                        }
                    }
                    $scope.$watch('tree.currentNode', function (newObj, oldObj) {
                        if ($scope.tree && angular.isObject($scope.tree.currentNode)) {
                            console.log("watch tree => " + angular.toJson($scope.tree.currentNode));
                            if (!$scope.tree.currentNode.children) {
                                console.log("tree ici99 => $scope.tree.currentNode.imagePath " + $scope.tree.currentNode.imagePath);
                                $scope.fileInput = $scope.imageAddress + "/" + $scope.tree.currentNode.imagePath + "?" + Date.now();
                            } else if ($scope.tree.currentNode.structuralEntityType.code == '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##') {
                                console.log("tree ici => $scope.tree.currentNode.children[0].imagePath " + $scope.tree.currentNode.children[0].imagePath);
                                $scope.fileInput = $scope.imageAddress + "/" + $scope.tree.currentNode.children[0].imagePath + "?" + Date.now();
                            }
                        }
                    }, false);
                });
            }
        }

        /**
         * Create all shorcuts keys
         */
        private createSortcuts($scope, $timeout): void {
            // shorcuts keys on action - start
            if (this.currentTray.type.code === '##TRAY_INDEX_TYPE##') {
                this.hotkeys.bindTo($scope).add({
                    combo: 'ctrl+r',
                    description: 'Rejeter la tâche',
                    callback: function (event) {
                        event.preventDefault();
                        $scope.openPopPinReject = true;
                    }
                });
            } else if (this.currentTray.type.code === '##TRAY_REJECT_TYPE##') {
                this.hotkeys.bindTo($scope).add({
                    combo: 'ctrl+r',
                    description: 'Renvoyer la tâche',
                    callback: function (event) {
                        event.preventDefault();
                        $scope.openPopSendBack = true;
                    }
                });
            } else if (this.currentTray.type.code === '##TRAY_CLASSIF_TYPE##') {
                this.hotkeys.bindTo($scope).add({
                    combo: 'ctrl+r',
                    description: 'Rejeter la tâche',
                    callback: function (event) {
                        event.preventDefault();
                        $scope.openPopPinReject = true;
                    }
                });
                if (this.currentTray.structuralEntityType.code === '##STRUCTURAL_ENTITY_TYPE_CODE_ENVELOPE##') {
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+v',
                        description: 'Valider le type d\'enveloppe',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                angular.element(document).find('#validateEnvTypeBtn').click();
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+del',
                        description: 'Supprimer le type d\'enveloppe',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                if ($scope.tree.currentNode.documentType && $scope.tree.currentNode.documentType.label) {
                                    angular.element(document).find('#dropDocTypeBtn').click();
                                }
                            });
                        }
                    });

                } else if (this.currentTray.structuralEntityType.code === '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##') {
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+v',
                        description: 'Valider le type de document',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                if ($scope.tree.currentNode.documentType && $scope.tree.currentNode.documentType.id) {
                                    angular.element(document).find('#validateDocTypeBtn').click();
                                }
                            });
                        }
                    });
                    this.hotkeys.bindTo($scope).add({
                        combo: 'ctrl+del',
                        description: 'Supprimer le type de document',
                        callback: function (event) {
                            event.preventDefault();
                            $timeout(function () {
                                if ($scope.tree.currentNode.documentType && $scope.tree.currentNode.documentType.label) {
                                    angular.element(document).find('#dropDocTypeBtn').click();
                                }
                            });
                        }
                    });
                }


            }

            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+q', description: 'Quitter la tâche', callback: function (event) {
                    $timeout(function () {
                        angular.element(document).find('#quitEnvelope').click();
                    })
                }
            });
            // shorcuts keys on action - end
            // shorcuts keys on image - start
            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl++',
                description: 'Zoomer l\'image',
                callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#zoomin').click();
                    })
                }
            });
            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+-',
                description: 'Dézoomer sur l\'image',
                callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#zoomout').click();
                    })
                }
            });
            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+*',
                description: 'Redimensionner l\'image',
                callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#resizeImage').click();
                    })
                }
            });
            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+left',
                description: 'Rotation gauche de l\'image',
                callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#rotateleft').click();
                    })
                }
            });
            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+right',
                description: 'Rotation droite de l\'image',
                callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#rotateright').click();
                    })
                }
            });
            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+i',
                description: 'Corriger l\'image',
                callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(document).find('#saveImageBtn').click();
                    })
                }
            });

            // shorcuts keys on image - end
            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+down', description: 'Naviguer dans les images', callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        var selectedFound = false;
                        var newSelectedFound = false;
                        if ($scope.treedata[0] && $scope.treedata[0].children) {
                            for (var document of $scope.treedata[0].children) {
                                if (document.id === $scope.tree.currentNode.id) {
                                    document.selected = '';
                                    selectedFound = true;
                                } else if (selectedFound) {
                                    document.selected = 'selected';
                                    newSelectedFound = true;
                                    $scope.tree.currentNode = document;
                                    break;
                                }

                                for (var page of document.children) {
                                    if (page.id === $scope.tree.currentNode.id) {
                                        page.selected = '';
                                        selectedFound = true;
                                    } else if (selectedFound) {
                                        page.selected = 'selected';
                                        newSelectedFound = true;
                                        $scope.tree.currentNode = page;
                                        break;
                                    }
                                }
                                if (newSelectedFound) {
                                    break;
                                }
                            }
                        }

                        if (!newSelectedFound && $scope.treedata[0] && $scope.treedata[0].children) {
                            $scope.treedata[0].children[0].selected = 'selected';
                            $scope.tree.currentNode = $scope.treedata[0].children[0];
                        }
                    });
                }
            });

            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+space', description: 'Mode Saisie', callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        if ($scope.openPopPinReject || $scope.openPopSendBack) {
                            angular.element(document).find('select:visible:first').focus();
                        } else {
                            if (angular.element(document).find('input:visible:first').length) {
                                angular.element(document).find('input:visible:first').focus();
                            } else {
                                angular.element(document).find('select:visible:first').focus();
                            }
                        }
                    })
                }
            });

            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+enter', description: 'Valider l\'opération en cours', callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        if ($scope.openPopPinReject) {
                            angular.element(document).find('#rejectTypeSubmit').click();
                        } else if ($scope.openPopSendBack) {
                            angular.element(document).find('#sendBackSubmit').click();
                        } else if ($scope.currentTray.type.code === '##TRAY_CLASSIF_TYPE##') {
                            angular.element(document).find('#classifySubmit').click();
                        } else if ($scope.currentTray.type.code === '##TRAY_INDEX_TYPE##') {
                            angular.element(document).find('#indexSubmit').click();
                        }
                    });
                }
            });

            this.hotkeys.bindTo($scope).add({
                combo: 'esc', description: 'Annuler l\'opération en cours', callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        if ($scope.openPopPinReject) {
                            angular.element(document).find('#rejectTypeCancel').click();
                        } else if ($scope.openPopSendBack) {
                            angular.element(document).find('#sendBackCancel').click();
                        }
                    })
                }
            });

            this.hotkeys.bindTo($scope).add({
                combo: 'enter', description: 'Chercher dans le referentiel', callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element(window.document.activeElement).parent().find('span.input-group-btn>button#callRefBtn').click();
                    })
                }
            });

            this.hotkeys.bindTo($scope).add({
                combo: 'tab', description: 'Tabulations entre les champs de saisie', callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {
                        var idCurrentFocusedInput = angular.element(window.document.activeElement).attr('id');
                        var idfirstInput;
                        var isFocusedFound = false;

                        var nextInputIsFocused;

                        angular.element(document).find('input:visible').each((index, element) => {
                            if (!idfirstInput) {
                                idfirstInput = element.getAttribute('id');
                            }
                            if (isFocusedFound) {
                                angular.element(document).find('#' + element.getAttribute('id')).focus();
                                nextInputIsFocused = true;
                                return false;
                            } else if (idCurrentFocusedInput === element.getAttribute('id')) {
                                isFocusedFound = true;
                            }
                        });

                        if (!nextInputIsFocused) {
                            angular.element(document).find('#' + idfirstInput).focus();
                        }

                    });
                }
            });

            this.hotkeys.bindTo($scope).add({
                combo: 'ctrl+b', description: 'Tabulations entre les accordions', callback: function (event) {
                    event.preventDefault();
                    $timeout(function () {

                        if (['##TRAY_INDEX_TYPE##', '##TRAY_QUALITY_TYPE##'].indexOf($scope.currentTray.type.code) >= 0) {

                            switch ($scope.currentTray.structuralEntityType.code) {
                                case '##STRUCTURAL_ENTITY_TYPE_CODE_ENVELOPE##':
                                    for (var i = 0; i < $scope.treedata[0].categories.length; i++) {
                                        // the the opened accordion is not the last one then open the next accordion
                                        if ($scope.treedata[0].categories[i].open && i < $scope.treedata[0].categories.length - 1) {
                                            $scope.treedata[0].categories[i + 1].open = true;
                                            return;
                                        }
                                    }
                                    // if the last accordion is opened then open the first accordion
                                    $scope.treedata[0].categories[0].open = true;
                                    break;

                                case '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##':
                                    if ($scope.treedata[0] && $scope.tree.currentNode) {

                                        // case page is selected
                                        if (!$scope.tree.currentNode.structuralEntityType) {
                                            for (var document of $scope.treedata[0].children) {
                                                for (var page of document.children) {
                                                    if ($scope.tree.currentNode.id === page.id) {
                                                        //return document.categories;
                                                        for (var i = 0; i < document.categories.length; i++) {
                                                            // the the opened accordion is not the last one then open the next accordion
                                                            if (document.categories[i].open && i < document.categories.length - 1) {
                                                                document.categories[i + 1].open = true;
                                                                return;
                                                            }
                                                        }
                                                        // if the last accordion is opened then open the first accordion
                                                        document.categories[0].open = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            // case of document
                                        } else if ($scope.tree.currentNode.structuralEntityType.code == '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##') {
                                            for (var document of $scope.treedata[0].children) {
                                                if ($scope.tree.currentNode && (document.id === $scope.tree.currentNode.id)) {
                                                    for (var i = 0; i < document.categories.length; i++) {
                                                        // the the opened accordion is not the last one then open the next accordion
                                                        if (document.categories[i].open && i < document.categories.length - 1) {
                                                            document.categories[i + 1].open = true;
                                                            return;
                                                        }
                                                    }
                                                    // if the last accordion is opened then open the first accordion
                                                    document.categories[0].open = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                            }
                        }
                    })
                }
            });
        }

        /**
         * call referential and get indexes
         * if referential return empty list clear all indexes
         * else inform retrieved indexes
         */
        public callReferential(index: models.IIndex): void {
            if (index.value[0]) {
                this.trayService.loadRefIndexes({
                    trayId: this.currentTray.id,
                    indexId: index.id,
                    searchId: index.value[0]
                }).then((refIndexes: models.IReferentialIndex[]) => {
                    for (var category of this.getCategoriesForIndexationPanel()) {
                        for (var index of category.indexes) {
                            if (refIndexes.length) {
                                for (var refIndex of refIndexes) {
                                    if (index.refLabel === refIndex.code) {
                                        if (refIndex.values.length) {
                                            switch (index.inputType) {
                                                case 'list':
                                                    index.items = refIndex.values;
                                                    break;
                                                case 'number':
                                                    index.value[0] = parseFloat(refIndex.values[0].label);
                                                    break;
                                                default:
                                                    index.value[0] = refIndex.values[0].label;
                                            }
                                        }
                                        break;
                                    }
                                }
                            } else {
                                index.value[0] = undefined;
                            }
                        }
                    }
                });
            }
        }


        /**
         * Validate/invalidate envelope quality controle
         */
        public validateControleQuality(): void {
            if (this.isControleQualityValidated !== undefined) {
                this.trayService.validateQualityControl(this.envelopeObject.id, this.isControleQualityValidated).then((result: any) => {
                    this.getNextEnvelope();
                });
            }
        }

        /**
         * index envelope
         */
        public index(): void {

            for (var document of this.envelopeObject.children) {
                for (var category of document.categories) {
                    for (var index of category.indexes) {
                        if (index.inputType === 'date' && index.value.length && index.value[0]) {
                            index.value[0] = index.value[0].toLocaleDateString();
                        }
                    }
                }
            }

            this.trayService.indexEnvelope(this.envelopeObject.id, this.envelopeObject).then((result: any) => {
                this.getNextEnvelope();
            });
        }

        /**
         * classify envelope
         */
        public classify(): void {
            this.trayService.classifyEnvelope(this.envelopeObject.id, this.envelopeObject.children).then((result: any) => {
                this.getNextEnvelope();
            });
        }

        /**
         * Reject the envelope
         */
        public rejectEnvelope(rejectId: number, comment: string): void {
            this.$scope.openPopPinReject = false;
            this.trayService.rejectEnvelope(this.envelopeObject.id, this.currentTray.id, rejectId, comment).then((result: any) => {
                this.getNextEnvelope();
            });
        }

        /**
         * Change envelope tray
         */
        public changeEnvelopeTray(tray: models.ITray): void {
            this.$scope.openPopSendBack = false;
            this.trayService.changeEnvelopeTray(this.envelopeObject.id, tray.id).then((result: any) => {
                this.getNextEnvelope();
            });
        }

        /**
         * Load next envelope
         */
        public getNextEnvelope(): void {
            this.trayService.getNextEnvelope(this.currentTray.id).then((nextEnvelopeId: number) => {
                if (nextEnvelopeId) {
                    this.$location.path("/envelope-detail/" + nextEnvelopeId);
                } else {
                    this.$location.path("/tray-detail/" + this.currentTray.id);
                }
            });
        }

        /**
         * Quit enveloppe
         */
        public quitEnvelope(comment: string): void {
            this.trayService.quitEnvelope(this.envelopeObject.id, comment).then((result: any) => {
                this.$scope.openPopPinReject = false;
                this.$scope.openPopSendBack = false;
                this.$location.path("/tray-detail/" + this.currentTray.id);
            });
        }

        /**
         * Save image redress
         */
        public saveRedressImage(): void {
            var path = this.$scope.fileInput;
            this.imageSave.imagePath = path.substring(path.lastIndexOf("\/") + 1, path.lastIndexOf("\?"));
            this.imageSave.angle = angular.element('canvas').scope().options.rotate.value;
            this.trayService.saveRotateImage(this.imageSave).then((data: any) => {
                this.$scope.fileInput = this.$scope.imageAddress + "/" + path.substring(path.lastIndexOf("\/") + 1, path.lastIndexOf("\?")) + "?" + Date.now();
            });
        }

        /**
         * format date
         */
        private formatDate(index: models.IIndex): void {
            if (index.inputType === 'date') {
                for (var i = 0; i < index.value.length; i++) {
                    if (index.value[i]) {
                        index.value[i] = new Date(index.value[i].toString());
                    }
                }
            }
        }

        /**
         * change selected picture when a pricture witin GUI is clicked
         */
        public changePictureView(pictureName: string): void {
            this.envelopeObject.selected = undefined;
            for (var document of this.$scope.treedata.children) {
                document.selected = undefined;
                for (var page of document.children) {
                    if (page.label === pictureName) {
                        page.selected = "selected";
                        this.$scope.tree.currentNode = page;
                    } else {
                        page.selected = undefined;
                    }
                }
            }
        }

        /**
         * add new line for composite indexes table
         */
        public addNewLine(index: models.IIndex): void {
            for (var childIndex of index.childIndexes) {
                if (!childIndex.value) {
                    childIndex.value = new Array();
                }
                childIndex.value.push(null);
            }
        }

        /**
         * duplicate line of composite indexes table
         */
        public dropLine(index: models.IIndex, lineId: number): void {
            if (index) {
                for (var childIndex of index.childIndexes) {
                    childIndex.value.splice(lineId, 1);
                }
            }
        }

        /**
         * duplicate line for composite indexes table
         */
        public duplicateLine(index: models.IIndex, lineId: number): void {
            if (index) {
                for (var childIndex of index.childIndexes) {
                    childIndex.value.push(angular.copy(childIndex.value[lineId]));
                }
            }
        }

        /**
         * check if we can allow the user to classify the envelope
         */
        public canClassify(): boolean {
            if (this.$scope.treedata && this.$scope.treedata.children) {
                for (var document of this.$scope.treedata.children) {
                    if (!(document.documentType && document.documentType.label)) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        }

        /**
         * check if we can allow the user to index the envelope
         */
        public canIndex(): boolean {
            if (this.envelopeObject && this.envelopeObject.categories) {
                var nbIndexInformed = 0;
                for (var category of this.envelopeObject.categories) {
                    for (var index of category.indexes) {
                        // check only simple indexes
                        if (!index.childIndexes.length) {
                            if (index.required === true && (index.value.length === 0 || index.value[0] === undefined || index.value[0] === null || !index.value[0].toString().length)) {
                                return false;
                            } else if (index.value.length > 0 && index.value[0]) {
                                nbIndexInformed++;
                            }
                        }
                    }
                }

                if (nbIndexInformed < this.currentTray.nbRequiredIndex) {
                    return false;
                } else {
                    return true;
                }

            } else {
                return false;
            }
        }

        /**
         * Refresh doc type label
         */
        public refreshDocTypeLabel(currentDocType: models.IDocumentType): void {


            for (var doctype of this.docTypes) {
                if (currentDocType.id === doctype.id) {
                    currentDocType.label = doctype.label;
                    break;
                }
            }

            this.selectNextDocumentWithoutType();
        }


        /**
         * Refresh env type label
         */

        /* remove because not managed in new mdd
        public informEnvDocsTypes(): void {
            console.log('quoi....');
            if (this.envelopeObject && this.envelopeObject.children) {
                for (var document of this.envelopeObject.children) {
                    document.docType = this.envType.docType;
                }
            }
        }*/

        /**
         * Select next document without type
         */
        private selectNextDocumentWithoutType(): void {
            var untypedDocumentFound = false;
            for (var document of this.$scope.treedata.children) {
                if (!document.documentType || !document.documentType.id) {
                    untypedDocumentFound = true;
                    document.selected = "selected";
                    if (this.$scope.tree.currentNode) {
                        this.$scope.tree.currentNode.selected = undefined;
                    }
                    this.$scope.tree.currentNode = document;
                    break;
                }
            }

            // if all doc has a doc type, select first document
            if (!untypedDocumentFound) {
                this.$scope.treedata.children[0].selected = "selected";
                this.$scope.tree.currentNode = this.$scope.treedata.children[0];
            }
        }

        /**
         * put index of date type in the right format
         */
        private formatDateIndexes(envelopeObject: models.IEnvelope): void {
        }

        /**
         * Export envelope PDF
         */
        public exportEnvelopePdf(envelopeId: number): void {
            this.trayService.exportEnvelopePdf(envelopeId).then((data: any) => {
                var file = new Blob([data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });
        }

        /**
         * Flag export envelope
         */
        public flagExportEnvelope(envelopeId: number): void {
            this.trayService.changeEnvelopeStatus(envelopeId, '##ENV_STATUS_OTC_DELETED##').then((data: any) => {
                this.getNextEnvelope();
            });
        }

        /**
         * Get Selected or Default item code from list of items
         */
        public getSelectedOrDefaultItem(index: models.IIndex): string {
            if (index.value[0]) {
                return index.value[0].toString();
            } else {
                for (var item of index.items) {
                    if (item.isDefault) {
                        return item.code;
                    }
                }
            }
        }

        /**
         * Get categories for panel indexation
         */
        public getCategoriesForIndexationPanel(): models.ICategory[] {
            if (this.showEnvelopeIndexationPanel()) {
                return this.envelopeObject.categories;
            } else if (this.showDocumentIndexationPanel()) {
                return this.getCurrentDocIndexes();
            }
            return null;
        }

        /**
         * Show envelope indexation panel
         */
        public showEnvelopeIndexationPanel(): boolean {
            if (this.envelopeObject && this.envelopeObject.categories.length && this.currentTray.structuralEntityType.code === '##STRUCTURAL_ENTITY_TYPE_CODE_ENVELOPE##' && ['##TRAY_INDEX_TYPE##', '##TRAY_QUALITY_TYPE##'].indexOf(this.currentTray.type.code) >= 0) {
                return true;
            }
            return false;
        }

        /**
         * Show document indexation panel
         */
        public showDocumentIndexationPanel(): boolean {
            if (this.currentTray && this.currentTray.structuralEntityType.code === '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##' && ['##TRAY_INDEX_TYPE##', '##TRAY_QUALITY_TYPE##'].indexOf(this.currentTray.type.code) >= 0 && this.getCurrentDocIndexes().length) {
                return true;
            }
            return false;
        }

        /**
         * return categories of indexes for the current selected document
         */
        public getCurrentDocIndexes(): models.ICategory[] {

            if (this.envelopeObject && this.$scope.tree.currentNode) {

                // case page is selected
                if (!this.$scope.tree.currentNode.structuralEntityType) {
                    for (var document of this.envelopeObject.children) {
                        for (var page of document.children) {
                            if (this.$scope.tree.currentNode.id === page.id) {
                                return document.categories;
                            }
                        }
                    }
                    // case of document
                } else if (this.$scope.tree.currentNode.structuralEntityType.code == '##STRUCTURAL_ENTITY_TYPE_CODE_DOCUMENT##') {
                    for (var document of this.envelopeObject.children) {
                        if (this.$scope.tree.currentNode && (document.id === this.$scope.tree.currentNode.id)) {
                            return document.categories;
                        }
                    }
                }
            }
            return [];
        }

        /**
         * Get related index for the given positions
         */
        public getIndexByPosition(category: models.ICategory, positionX: number, positionY: number): models.IIndex {
            for (var i = 0; i < category.indexes.length; i++) {
                if (category.indexes[i].positionX === positionX && category.indexes[i].positionY === positionY) {
                    return category.indexes[i];
                }
            }
            return null;
        }
    }


    app.controller("EnvelopeDetailController", EnvelopeDetailController);
}
