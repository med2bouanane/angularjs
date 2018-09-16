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
        pagePictures:Array<models.controlimage.IPage>;
        indexPagePicture:number;
        treeData: Object;
        treeOptions: object;
        batchTree: models.controlimage.IBatchTree;
        // differents reject type by structural entity type
        rejectTypesByBatch: models.IRejectType[];
    }
    /**
     * controller pour le controle image de base
     */
    export class ControlImageRejectDetailController {

        static $inject: string[] = ["$location", "$q", "$scope", "$routeParams", "AuthSharedService","ControlImageDetailService","TrayService"];
        
        private batchId: number;
        private trayId: number;

        constructor(private $location: ng.ILocationService,
                    private q: ng.IQService,
                    private $scope: DetailScope,
                    private routeParams: RouteParams,
                    private authService: services.AuthSharedService,
                    private controlImageService: services.controlimage.ControlImageDetailService,
                    private trayService: services.TrayService) {
            this.$scope=$scope;
            this.$scope.pagePictures = [];
            this.$scope.treeData=[];
            this.trayId = routeParams.trayId;
            this.batchId = routeParams.batchId;
            this.init(this.$scope);
            this.initUi(this.$scope);      
        }

        private initUi($scope: DetailScope){
            var contexteSave = this;
            this.$scope.treeOptions = {
                beforeDrop : function (e) {
                    var deferred = contexteSave.q.defer();
                    var sourceValue = e.source.nodeScope.node;
                    if(!e.dest.nodesScope.node){//pour empecher le deplacement de la racine
                        deferred.reject("deplacement racine impossible");
                        return deferred.promise;
                    }
                    var destValue = e.dest.nodesScope.node;
                    if ((sourceValue.elementType - destValue.elementType) != 1){
                        deferred.reject("deplacement dans un sous type  sup a -1 impossible");
                        return deferred.promise;
                    }
                    if(sourceValue.elementType == "##IMAGE_CONTROLLER_PAGE##"){
                        var oldIdDocument = sourceValue.documentId;
                        sourceValue.documentId = destValue.id;
                        contexteSave.controlImageService.savePage(sourceValue).then(function(data){
                            contexteSave.generateListImage();
                            deferred.resolve();
                        },function(error){
                            sourceValue.documentId = oldIdDocument;
                            deferred.reject("erreur");
                        });
                    } else if(sourceValue.elementType == "##IMAGE_CONTROLLER_DOCUMENT##"){
                        var oldIdEnvelope = sourceValue.envelopeId;
                        sourceValue.envelopeId = destValue.id;
                        contexteSave.controlImageService.saveDocument(sourceValue).then(function(data){
                            contexteSave.generateListImage();
                            deferred.resolve();
                        },function(error){
                            sourceValue.envelopeId = oldIdEnvelope;
                            deferred.reject("erreur");
                        });
                    }
                    return deferred.promise;
                }
            };
            $scope.openPopPinRejectLot=false;            
            $scope.optionsCanvasViewer = { controls: { toolbar: false, image:false, fit: 'height' }, zoom: { value: 0.25, step: 0.01 }, rotate: { value: 90} };
            $scope.$on("control-image-view-picture",function(event, node){//affichage d'une page a partir de l'arbre
                if (node.elementType == "##IMAGE_CONTROLLER_PAGE##") {
                    $scope.fileInput = '##URL_IMG##' + node.imagePath;
                }
                contexteSave.resetPicture(node.id);
                node.select=true;
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
                    this.$location.path("control-image/reject/"+this.trayId);
                }
                // load reject Type by structural type
                this.trayService.loadRejectTypesByStructuralEntityType(this.trayId, "BATCH").then((data:models.IRejectType[])=>{
                    $scope.rejectTypesByBatch = data;
                },(error)=>{});

                this.loadBatch($scope);
            },(error)=>{
                this.$location.path("control-image/reject/"+this.trayId);
            });
        }

        /**
         * recherche la liste des batchs dans le controle image
         */
        public loadBatch($scope: DetailScope){
            this.controlImageService.loadBatch(this.batchId, this.trayId).then((batch: models.controlimage.IBatchTree) => {
                this.controlImageService.getEnvelopeUnlockedByTrayAndBatch(this.batchId, this.trayId).then((listEnvelope:Array<number>)=>{
                    $scope.batchTree = batch;
                    this.remplir_label($scope,listEnvelope);
                    this.$scope.treeData = [$scope.batchTree];
                },(error)=>{});
            },(error)=>{
                // possible error if all envelopes of this tray are locked by another user
                this.$location.path("control-image/reject/" + this.trayId);
            });
        }

        private generateListImage(){
            while (this.$scope.pagePictures.length) {
                this.$scope.pagePictures.pop();
              }
            for (var indexEnvelope = 0; indexEnvelope < this.$scope.batchTree.envelopes.length ; indexEnvelope++) {
                var envelope = this.$scope.batchTree.envelopes[indexEnvelope];
                for (var indexDocument = 0; indexDocument < envelope.documents.length ; indexDocument++) {
                    var document = envelope.documents[indexDocument];
                    for (var indexPage = 0; indexPage < document.pages.length ; indexPage++) {
                        var page = document.pages[indexPage]
                        if(page.deleted) continue;
                        this.$scope.pagePictures.push(page);
                    }
                }
            }
        }

        /**
         * remplit tous les labels pour l'arbre et genere la liste des images.
         */
        private remplir_label($scope: DetailScope,listEnvelope:Array<number>){
            $scope.batchTree.label=$scope.batchTree.name;
            $scope.batchTree.nodes = $scope.batchTree.envelopes;
            $scope.batchTree.elementType=0;
            for (var indexEnvelope = 0; indexEnvelope < $scope.batchTree.envelopes.length ; indexEnvelope++) {
                var envelope = $scope.batchTree.envelopes[indexEnvelope];
                envelope.label = envelope.number;
                envelope.nodes = envelope.documents;
                envelope.hidden = listEnvelope.indexOf(envelope.id)==-1;
                envelope.elementType=1;
                for (var indexDocument = 0; indexDocument < envelope.documents.length ; indexDocument++) {
                    var document = envelope.documents[indexDocument];
                    document.label = document.name;
                    document.nodes = document.pages;
                    document.elementType = 2;
                    for (var indexPage = 0; indexPage < document.pages.length ; indexPage++) {
                        var page = document.pages[indexPage]
                        if(page.deleted) continue;
                        page.label = page.name;
                        page.elementType = 3;
                        $scope.pagePictures.push(page);
                    }
                }
            }
            $scope.fileInput = '##URL_IMG##' + $scope.pagePictures[0].imagePath;    
        }

        public openPopPinRejectBatch(): void{
            this.$scope.openPopPinRejectLot=true;
        }

        public rejectBatch(rejectId: number, comment: string): void{
            this.$scope.openPopPinRejectLot = false;
            for(let envelope of this.$scope.batchTree.envelopes){
                if(!envelope.hidden && !envelope.deleted){
                    this.trayService.rejectEnvelope(envelope.id, this.trayId, rejectId, comment);
                }
            }
            this.$location.path("/control-image/reject/"+this.trayId);
        }

        public deleteBatch(): void {
            this.trayService.deleteBatch(this.batchId, 'Rejet Controle Image');
            this.$location.path("/control-image/reject/"+this.trayId);
       }

        public printBatch(): void {
            console.log(this.batchId);
            this.controlImageService.printBatch(this.batchId).then((data: any) => {
                var file = new Blob([data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            });
        }

        /* Canvas Viewer - redimensionne la page  */
        public reset(): void{
            this.$scope.$broadcast("canvas-viewer-resize",'page');
        }
        /* Canvas Viewer - rotationne la page  */
        public rotate(val:number): void{
            this.$scope.$broadcast("canvas-viewer-rotate",val);
        }
        /* Canvas Viewer - zoom sur la page  */
        public zoom(val:number): void{
            this.$scope.$broadcast("canvas-viewer-zoom",val);
        }
        /* Canvas Viewer - page precedente  */
        public prev(): void{
            this.$scope.indexPagePicture--;
            if(this.$scope.indexPagePicture < 0){
                this.$scope.indexPagePicture = 0;
            }
            this.refreshViewer();
        }
        /* Canvas Viewer - page suivante  */
        public next(): void{
            this.$scope.indexPagePicture++;
            if(this.$scope.indexPagePicture >= this.$scope.pagePictures.length){
                this.$scope.indexPagePicture = this.$scope.pagePictures.length - 1;
            }
            this.refreshViewer();
        }
        /* Canvas Viewer - premiere page  */
        public first(): void{
            this.$scope.indexPagePicture = 0;
            this.refreshViewer();
        }
        /* Canvas Viewer - derniere page  */
        public last(): void{
            this.$scope.indexPagePicture = this.$scope.pagePictures.length-1;
            this.refreshViewer();
        }
        /* Canvas Viewer - remove page */
        public remove():void{
            var page:models.controlimage.IPage = this.$scope.pagePictures[this.$scope.indexPagePicture];
            this.$scope.$emit("control-image-remove-page",page);
        }
        /* Canvas Viewer - change de page  */
        public refreshViewer():void{
            this.$scope.fileInput = '##URL_IMG##' + this.$scope.pagePictures[this.$scope.indexPagePicture].imagePath;
        }
        /* cherche l'index de la page selectionne dans la liste des images  */
        public resetPicture(idPage:number){
            for (var indexPicture = 0; indexPicture < this.$scope.pagePictures.length ; indexPicture++) {
                if(idPage == this.$scope.pagePictures[indexPicture].id){
                    this.$scope.indexPagePicture = indexPicture;
                }
            }
        }
    }

    app.controller("ControlImageRejectDetailController", ControlImageRejectDetailController);
}