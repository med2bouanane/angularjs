module arvato.demat.controller {
    "use strict";

    interface routeParams extends ng.route.IRouteParamsService {
        entityTypeParams: string;
        entityIdParams: number;
    }

    export class EntityTypeUpdateController {

        static $inject: string[] = ["$location", "$routeParams", "EntityTypeService", "Constants"];

        private entityTypeModel: arvato.demat.models.IEntityType;

        constructor(private $location: ng.ILocationService, private routeParams: routeParams, private entityTypeService: services.EntityTypeService, private constants: constants.Constants) {
            entityTypeService.loadEntityType(this.routeParams.entityTypeParams, this.routeParams.entityIdParams)
                .then((entityType: models.IEntityType) => {
                    this.entityTypeModel = entityType;
                })
                .catch(reason => this.$location.path(this.constants.ERROR_500_PATH));
        }

        public isFilled() {
            if (this.entityTypeModel && this.entityTypeModel.code && this.entityTypeModel.label) {
                return true;
            }
            return false;
        }

        public updateEntityType() {
            this.entityTypeService.updateEntityType(this.routeParams.entityTypeParams, this.entityTypeModel)
                .then(promiseValue => this.$location.path("admin/entity-type/" + this.routeParams.entityTypeParams))
                .catch(reason => this.$location.path(this.constants.ERROR_500_PATH));
        }
    }

    app.controller("EntityTypeUpdateController", EntityTypeUpdateController);
}