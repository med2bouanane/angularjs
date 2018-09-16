module arvato.demat.controller {
    "use strict";

    /**
     * Pour la recuperation de l'identifiant de la corbeille
     */
    interface RouteParams extends ng.route.IRouteParamsService {
        trayId: number;
        batchId: number;
    }

    export interface DetailScope extends ng.IScope {
        fileInput: string;
        optionsCanvasViewer: Object;
        overlaysCanvasViewer: Array<Object>;
        openPopPinRejectLot: boolean;
        openPopPinRejectPli: boolean;
        openPopPinTimeOut: boolean;
        pagePictures: Array<models.controlimage.IPage>;
        indexPagePicture: number;
        treeData: Object;
        treeOptions: object;
        batchTree: models.controlimage.IBatchTree;

        // differents reject type by structural entity type
        rejectTypesByBatch: models.IRejectType[];
        rejectTypesByEnvelope: models.IRejectType[];
    }

    /**
     * controller pour le controle image de base
     */
    export class ControlImageTreatmentDetailController {

        static $inject: string[] = ["$location", "$q", "$scope", "$routeParams", "$timeout", "AuthSharedService", "ControlImageDetailService", "TrayService"];

        private batchId: number;
        private trayId: number;
        private timerPopPinTimeOut;
        private timerDeclareTimeOut;
        private CST_MILLISECOND_TO_MINUTE = 60000;
        private CST_NUMBER_OF_MINUTE_BEFORE_POPUP_TIMEOUT = 10; // time before popup no activity
        private CST_NUMBER_OF_MINUTE_BEFORE_DECLARE_TIMEOUT = 1; // timeout after popup

        constructor(private $location: ng.ILocationService,
                    private q: ng.IQService,
                    private $scope: DetailScope,
                    private routeParams: RouteParams,
                    private $timeout: ng.ITimeoutService,
                    private authService: services.AuthSharedService,
                    private controlImageService: services.controlimage.ControlImageDetailService,
                    private trayService: services.TrayService) {
            this.$scope = $scope;
            this.$scope.pagePictures = [];
            this.$scope.treeData = [];
            this.trayId = routeParams.trayId;
            this.batchId = routeParams.batchId;
            console.time("init");
            this.init(this.$scope);
            console.timeEnd("init");
            console.time("initUi");
            this.initUi(this.$scope);
            console.timeEnd("initUi");

            // declare a timer for display popup if no activity
            this.timerPopPinTimeOut = $timeout(this.displayPopPinTimeOut, this.timeBeforePopupTimeout(), true, this);
        }

        private timeBeforePopupTimeout() {
            return this.CST_NUMBER_OF_MINUTE_BEFORE_POPUP_TIMEOUT * this.CST_MILLISECOND_TO_MINUTE;
        }

        private timeBeforeDeclareTimeout() {
            return this.CST_NUMBER_OF_MINUTE_BEFORE_DECLARE_TIMEOUT * this.CST_MILLISECOND_TO_MINUTE;
        }

        private initUi($scope: DetailScope) {
            var contexteSave = this;
            this.$scope.treeOptions = {
                beforeDrop: function (e) {
                    var deferred = contexteSave.q.defer();
                    var sourceValue = e.source.nodeScope.node;
                    if (!e.dest.nodesScope.node) {//pour empecher le deplacement de la racine
                        deferred.reject("deplacement racine impossible");
                        return deferred.promise;
                    }
                    var destValue = e.dest.nodesScope.node;
                    if ((sourceValue.elementType - destValue.elementType) != 1) {
                        deferred.reject("deplacement dans un sous type  sup a -1 impossible");
                        return deferred.promise;
                    }
                    if (sourceValue.elementType == "##IMAGE_CONTROLLER_PAGE##") {
                        var oldIdDocument = sourceValue.documentId;
                        sourceValue.documentId = destValue.id;
                        contexteSave.controlImageService.savePage(sourceValue).then(function (data) {
                            contexteSave.generateListImage();
                            deferred.resolve();
                        }, function (error) {
                            sourceValue.documentId = oldIdDocument;
                            deferred.reject("erreur");
                        });
                    } else if (sourceValue.elementType == "##IMAGE_CONTROLLER_DOCUMENT##") {
                        var oldIdEnvelope = sourceValue.envelopeId;
                        sourceValue.envelopeId = destValue.id;
                        contexteSave.controlImageService.saveDocument(sourceValue).then(function (data) {
                            contexteSave.generateListImage();
                            deferred.resolve();
                        }, function (error) {
                            sourceValue.envelopeId = oldIdEnvelope;
                            deferred.reject("erreur");
                        });
                    }
                    return deferred.promise;
                }
            };
            $scope.openPopPinRejectLot = false;
            $scope.openPopPinRejectPli = false;
            $scope.openPopPinTimeOut = false;
            $scope.currentNode;
            $scope.optionsCanvasViewer = {
                controls: {toolbar: false, image: false, fit: 'height'},
                zoom: {value: 0.25, step: 0.01},
                rotate: {value: 90}
            };
            $scope.$on("control-image-view-picture", function (event, node) {//affichage d'une page a partir de l'arbre
                if (node.elementType == "##IMAGE_CONTROLLER_PAGE##") {
                    $scope.fileInput = '##URL_IMG##' + node.imagePath;
                }
                contexteSave.resetPicture(node.id);
                node.select = true;
            });
            $scope.$on("control-image-add-envelope", function (event, node) {//ajouter envelope a partir de l'arbre
                var documents: models.controlimage.IDocument[] = [];
                var newEnvelope: models.controlimage.IEnvelope = <models.controlimage.IEnvelope> {
                    nodes: documents,
                    documents: documents,
                    batchId: contexteSave.batchId
                }
                contexteSave.controlImageService.saveEnvelope(newEnvelope).then((result: models.controlimage.IEnvelope) => {
                    result.label = result.number;
                    result.nodes = result.documents;
                    result.elementType = parseInt("##IMAGE_CONTROLLER_ENVELOPE##");
                    $scope.batchTree.envelopes.unshift(result);
                }, (error) => {
                });
            });
            $scope.$on("control-image-add-document", function (event, node) {//ajouter document a partir de l'arbre
                var pages: models.controlimage.IPage[] = [];
                var newDocument: models.controlimage.IDocument = <models.controlimage.IDocument> {
                    pages: pages,
                    envelopeId: node.id
                };
                contexteSave.controlImageService.saveDocument(newDocument).then((result: models.controlimage.IDocument) => {
                    result.label = result.name;
                    result.nodes = result.pages;
                    result.elementType = parseInt("##IMAGE_CONTROLLER_DOCUMENT##");
                    node.documents.unshift(result);
                })
            });
            $scope.$on("control-image-remove-envelope", function (event, node) {//supprimer envelope a partir de l'arbre
                node.deleted = true;
                contexteSave.controlImageService.saveEnvelope(node).then((result: models.controlimage.IEnvelope) => {
                }, (error) => {
                    node.deleted = false;
                });
            });
            $scope.$on("control-image-remove-document", function (event, node) {//supprimer document a partir de l'arbre
                node.deleted = true;
                contexteSave.controlImageService.saveDocument(node).then((result: models.controlimage.IDocument) => {
                }, (error) => {
                    node.deleted = false;
                });

            });
            $scope.$on("control-image-remove-page", function (event, node) {//supprimer page a partir de l'arbre
                node.deleted = true;
                contexteSave.controlImageService.savePage(node).then((result: models.controlimage.IPage) => {
                    contexteSave.generateListImage();
                    contexteSave.$scope.indexPagePicture = 0;
                }, (error) => {
                    node.deleted = false;
                });
            });
            $scope.indexPagePicture = 0;
            $scope.pagePictures = [];
        }

        /**
         * Initialize le controle image
         */
        private init($scope: DetailScope) {
            this.trayService.loadTray(this.trayId).then((result: models.ITray) => {
                if (!result || !this.authService.isAuthorized(result.authoritiesAsString.split(','))) {
                    this.$location.path("control-image/treatment/" + this.trayId);
                }

                // load reject Type by structural type
                this.trayService.loadRejectTypesByStructuralEntityType(this.trayId, "BATCH").then((data: models.IRejectType[]) => {
                    $scope.rejectTypesByBatch = data;
                }, (error) => {
                });

                this.trayService.loadRejectTypesByStructuralEntityType(this.trayId, "ENVELOPE").then((data: models.IRejectType[]) => {
                    $scope.rejectTypesByEnvelope = data;
                }, (error) => {
                });

                this.loadBatch($scope);
            }, (error) => {
                this.$location.path("control-image/treatment/" + this.trayId);
            });
        }

        /**
         * recherche la liste des batchs dans le controle image
         */
        public loadBatch($scope: DetailScope) {
            console.time("loadBatch");
            this.controlImageService.loadBatch(this.batchId, this.trayId).then((batch: models.controlimage.IBatchTree) => {
                this.controlImageService.getEnvelopeUnlockedByTrayAndBatch(this.batchId, this.trayId).then((listEnvelope: Array<number>) => {
                    $scope.batchTree = batch;
                    console.time("remplir_label");
                    this.remplir_label($scope, listEnvelope);
                    console.timeEnd("remplir_label");
                    this.$scope.treeData = [$scope.batchTree];
                }, (error) => {
                });
            }, (error) => {
                // possible error if all envelopes of this tray are locked by another user
                this.$location.path("control-image/treatment/" + this.trayId);
            });
            console.timeEnd("loadBatch");
        }

        private generateListImage() {
            while (this.$scope.pagePictures.length) {
                this.$scope.pagePictures.pop();
            }
            for (var indexEnvelope = 0; indexEnvelope < this.$scope.batchTree.envelopes.length; indexEnvelope++) {
                var envelope = this.$scope.batchTree.envelopes[indexEnvelope];
                for (var indexDocument = 0; indexDocument < envelope.documents.length; indexDocument++) {
                    var document = envelope.documents[indexDocument];
                    for (var indexPage = 0; indexPage < document.pages.length; indexPage++) {
                        var page = document.pages[indexPage]
                        if (page.deleted) continue;
                        this.$scope.pagePictures.push(page);
                    }
                }
            }
            this.resetTimeout();
        }

        /**
         * remplit tous les labels pour l'arbre et genere la liste des images.
         */
        private remplir_label($scope: DetailScope, listEnvelope: Array<number>) {
            $scope.batchTree.label = $scope.batchTree.name;
            $scope.batchTree.nodes = $scope.batchTree.envelopes;
            $scope.batchTree.elementType = 0;
            for (var indexEnvelope = 0; indexEnvelope < $scope.batchTree.envelopes.length; indexEnvelope++) {
                var envelope = $scope.batchTree.envelopes[indexEnvelope];
                envelope.label = envelope.number;
                envelope.nodes = envelope.documents;
                envelope.hidden = listEnvelope.indexOf(envelope.id) == -1;
                envelope.elementType = 1;
                for (var indexDocument = 0; indexDocument < envelope.documents.length; indexDocument++) {
                    var document = envelope.documents[indexDocument];
                    document.label = document.name;
                    document.nodes = document.pages;
                    document.elementType = 2;
                    for (var indexPage = 0; indexPage < document.pages.length; indexPage++) {
                        var page = document.pages[indexPage]
                        if (page.deleted) continue;
                        page.label = page.name;
                        page.elementType = 3;
                        $scope.pagePictures.push(page);
                    }
                }
            }
            $scope.fileInput = '##URL_IMG##' + $scope.pagePictures[0].imagePath;
        }

        public openPopPinRejectBatch(batch: models.controlimage.IBatchTree): void {
            this.$scope.openPopPinRejectLot = true;
            this.resetTimeout();
        }

        public rejectBatch(rejectId: number, comment: string): void {
            this.$scope.openPopPinRejectLot = false;
            for (let envelope of this.$scope.batchTree.envelopes) {
                if (!envelope.hidden && !envelope.deleted) {
                    this.trayService.rejectEnvelope(envelope.id, this.trayId, rejectId, comment);
                }
            }
            this.$location.path("/control-image/treatment/" + this.trayId);
        }

        /* Bouton action validation de batch*/
        public validateBatch(batch: models.controlimage.IBatchTree): void {
            for (let envelope of batch.envelopes) {
                if (!envelope.hidden && !envelope.deleted) {
                    this.validateEnvelope(envelope);
                }
            }
            this.resetTimeout();
        }

        /* validation d'une envelope*/
        public validateEnvelope(envelope: models.controlimage.IEnvelope): void {
            this.controlImageService.validateEnvelope(envelope).then((result: models.controlimage.IEnvelope) => {
                envelope.hidden = true;
                // si tous les plis sont validés redirection vers l'accueil
                for (let envelope of this.$scope.batchTree.envelopes) {
                    if (!envelope.deleted && !envelope.hidden) {
                        return;
                    }
                }
                this.$location.path("/control-image/treatment/" + this.trayId);
            }, (error) => {

            });
            this.resetTimeout();
        }

        public openPopPinRejectPli(envelope: models.controlimage.IEnvelope): void {
            this.$scope.openPopPinRejectPli = true;
            this.$scope.currentNode = envelope;
            this.resetTimeout();
        }

        public rejectEnvelope(rejectId: number, comment: string): void {
            this.trayService.rejectEnvelope(this.$scope.currentNode.id, this.trayId, rejectId, comment).then((result: any) => {
                this.$scope.currentNode.hidden = true;
                // si tous les plis sont validés redirection vers l'accueil
                for (let envelope of this.$scope.batchTree.envelopes) {
                    if (!envelope.deleted && !envelope.hidden) {
                        return;
                    }
                }
                this.$location.path("/control-image/treatment/" + this.trayId);
            });
            this.$scope.openPopPinRejectPli = false;
            this.resetTimeout();
        }

        /**
         * retourne vrai si toutes les documents de l'enveloppe sont supprimés
         */
        public isValidToDeleteEnvelope(envelope: models.controlimage.IEnvelope) {
            for (let document of envelope.documents) {
                if (!document.deleted) {
                    return false;
                }
            }
            return true;
        }

        /**
         * retourne vrai si toutes les pages du documents sont supprimées
         */
        public isValidToDeleteDocument(document: models.controlimage.IDocument) {
            for (let page of document.pages) {
                if (!page.deleted) {
                    return false;
                }
            }
            return true;
        }

        /**
         * retourne vrai si le batch est bien formé, aucun noeud n'a d'enfants vides.
         */
        public isValidBatch(batch: models.controlimage.IBatchTree) {
            if (batch.envelopes.length == 0) {
                return false;
            }
            for (let envelope of batch.envelopes) {
                if (envelope.deleted) continue;
                if (!this.isValidEnvelope(envelope)) {
                    return false;
                }
            }
            return true;
        }

        /**
         * retourne vrai si aucun des documents n'est vide
         */
        public isValidEnvelope(envelope: models.controlimage.IEnvelope) {
            if (envelope.documents.length == 0) {
                return false;
            }
            for (let document of envelope.documents) {
                if (document.deleted) continue;
                if (document.pages.length == 0) {
                    return false;
                }
            }
            return true;
        }

        /* Canvas Viewer - redimensionne la page  */
        public reset(): void {
            this.$scope.$broadcast("canvas-viewer-resize", 'page');
            this.resetTimeout();
        }

        /* Canvas Viewer - rotationne la page  */
        public rotate(val: number): void {
            this.$scope.$broadcast("canvas-viewer-rotate", val);
            this.resetTimeout();
        }

        /* Canvas Viewer - zoom sur la page  */
        public zoom(val: number): void {
            this.$scope.$broadcast("canvas-viewer-zoom", val);
            this.resetTimeout();
        }

        /* Canvas Viewer - page precedente  */
        public prev(): void {
            this.$scope.indexPagePicture--;
            if (this.$scope.indexPagePicture < 0) {
                this.$scope.indexPagePicture = 0;
            }
            this.refreshViewer();
        }

        /* Canvas Viewer - page suivante  */
        public next(): void {
            this.$scope.indexPagePicture++;
            if (this.$scope.indexPagePicture >= this.$scope.pagePictures.length) {
                this.$scope.indexPagePicture = this.$scope.pagePictures.length - 1;
            }
            this.refreshViewer();
        }

        /* Canvas Viewer - premiere page  */
        public first(): void {
            this.$scope.indexPagePicture = 0;
            this.refreshViewer();
        }

        /* Canvas Viewer - derniere page  */
        public last(): void {
            this.$scope.indexPagePicture = this.$scope.pagePictures.length - 1;
            this.refreshViewer();
        }

        /* Canvas Viewer - remove page */
        public remove(): void {
            var page: models.controlimage.IPage = this.$scope.pagePictures[this.$scope.indexPagePicture];
            this.$scope.$emit("control-image-remove-page", page);
            this.resetTimeout();
        }

        /* Canvas Viewer - change de page  */
        public refreshViewer(): void {
            this.$scope.fileInput = '##URL_IMG##' + this.$scope.pagePictures[this.$scope.indexPagePicture].imagePath;
            this.resetTimeout();
        }

        /* cherche l'index de la page selectionne dans la liste des images  */
        public resetPicture(idPage: number) {
            for (var indexPicture = 0; indexPicture < this.$scope.pagePictures.length; indexPicture++) {
                if (idPage == this.$scope.pagePictures[indexPicture].id) {
                    this.$scope.indexPagePicture = indexPicture;
                }
            }
            this.resetTimeout();
        }

        /* initialize timeout on corbeille controle image for display popup if no activity 
        @param controller current class because no access this scope in this method because call in a $timeout method
        */
        public displayPopPinTimeOut(controller) {
            controller.$scope.openPopPinTimeOut = true;
            controller.timerDeclareTimeOut = controller.$timeout(function () {
                controller.unlockAllEnvelopes();
                controller.returnTray();
            }, controller.timeBeforeDeclareTimeout());
        }

        /* reset time for popup if no activity and relaunch timeout */
        public resetTimeout(): void {
            // console.log('reset time for popup if no activity and relaunch timeout');
            this.$timeout.cancel(this.timerPopPinTimeOut);
            if (this.timerDeclareTimeOut != null) {
                this.$timeout.cancel(this.timerDeclareTimeOut);
            }
            this.timerPopPinTimeOut = this.$timeout(this.displayPopPinTimeOut, this.timeBeforePopupTimeout(), true, this);
            this.$scope.openPopPinTimeOut = false;
        }

        /**
         * unlock all envelopes no deleted and no
         */
        public unlockAllEnvelopes(): void {
            for (let envelope of this.$scope.batchTree.envelopes) {
                if (!envelope.hidden && !envelope.deleted) {
                    this.trayService.quitEnvelope(envelope.id, "Abandon controle qualite");
                }
            }
        }

        /**
         * Return in corbeille
         */
        public returnTray(): void {
            this.$scope.openPopPinTimeOut = false;
            this.$location.path("/control-image/treatment/" + this.trayId);
        }
    }

    app.controller("ControlImageTreatmentDetailController", ControlImageTreatmentDetailController);
}