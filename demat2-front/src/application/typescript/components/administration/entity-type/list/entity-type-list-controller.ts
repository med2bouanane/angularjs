module arvato.demat.controller {
    "use strict";

    import Constants = arvato.demat.constants.Constants;

    interface routeParams extends ng.route.IRouteParamsService {
        entityTypeParams: string;
    }

    export class EntityTypeListController extends GenericAdminController {

        static $inject: string[] = ["$location", "$routeParams", "EntityTypeService", "Constants"];

        private entityTypes: arvato.demat.models.IEntityType[];
        private currentModel: arvato.demat.models.IEntityType;

        constructor(private $location: ng.ILocationService, private routeParams: routeParams, private entityTypeService: services.EntityTypeService, private constants: constants.Constants) {
            super();

            entityTypeService.loadEntityTypes(this.routeParams.entityTypeParams)
                .then((entityTypes: models.IEntityType[]) => {
                    this.entityTypes = entityTypes;
                })
                .catch(reason => this.$location.path(this.constants.ERROR_500_PATH));
        }

        public prepareUpdateEntityType(currentModel: arvato.demat.models.IEntityType) {
            this.currentModel = currentModel;
            this.$location.path("admin/entity-type/" + this.routeParams.entityTypeParams + "/update/" + this.currentModel.id);
        }

        public prepareDeleteEntityType(currentModel: arvato.demat.models.IEntityType) {
            this.currentModel = currentModel;
            this.openPopinConfirm = true;
        }

        public deleteEntityType() {
            this.entityTypeService.deleteEntityType(this.routeParams.entityTypeParams, this.currentModel.id)
                .then(promiseValue => {
                    console.log("admin/entity-type/" + this.routeParams.entityTypeParams);
                    return this.$location.path("admin/entity-type/" + this.routeParams.entityTypeParams);
                })
                .catch(reason => this.$location.path(this.constants.ERROR_500_PATH));
            this.openPopinConfirm = false;
        }
    }

    app.controller("EntityTypeListController", EntityTypeListController);
}