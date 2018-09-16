module arvato.demat.controller {
    "use strict";

    interface routeParams extends ng.route.IRouteParamsService {
        entityTypeParams: string;
    }

    export class EntityTypeAddController {

        static $inject: string[] = ["$location", "$routeParams", "EntityTypeService", "Constants"];

        private entityTypeModel: arvato.demat.models.IEntityType;

        constructor(private $location: ng.ILocationService, private routeParams: routeParams, private entityTypeService: services.EntityTypeService, private constants: constants.Constants) {

        }

        public isFilled() {
            if (this.entityTypeModel && this.entityTypeModel.code && this.entityTypeModel.label) {
                return true;
            }
            return false;
        }

        public addEntityType() {
            this.entityTypeService.addEntityType(this.routeParams.entityTypeParams, this.entityTypeModel)
                .then(promiseValue => this.$location.path("admin/entity-type/" + this.routeParams.entityTypeParams))
                .catch(reason => this.$location.path(this.constants.ERROR_500_PATH));
        }
    }

    app.controller("EntityTypeAddController", EntityTypeAddController);
}