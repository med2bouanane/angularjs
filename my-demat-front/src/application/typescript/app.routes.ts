module arvato.demat {
    "use strict";

    app.constant('USER_ROLES', {
        ALL_ROLES: '*',
        ADMINISTRATOR_ROLE: 'Administrateur',
        SUPERVISOR_ROLE: 'Superviseur',
        OPERATOR_ROLE: 'Opérateur',
        OTC_ROLE: 'OTC'
    });

    app.config(($routeProvider, USER_ROLES) => {

        $routeProvider.when('/home', {
            templateUrl: 'components/home/home.html',
            controller: 'HomeController',
            controllerAs: "homeCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/', {
            redirectTo: '/home'
        }).when('/user/:action', {
            templateUrl: 'components/user/user-account.html',
            controller: 'UserController',
            controllerAs: "userCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/envelopes/:batchId', {
            templateUrl: 'components/supervision/envelope/envelope.html',
            controller: 'EnvelopeController',
            controllerAs: "envelopeCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE, USER_ROLES.SUPERVISOR_ROLE]
            }
        }).when('/historic-batch', {
            templateUrl: 'components/supervision/batch/batch.html',
            controller: 'HistoricBatchController',
            controllerAs: "historicBatchCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE, USER_ROLES.SUPERVISOR_ROLE]
            }
        }).when('/historic/:envelopeId', {
            templateUrl: 'components/supervision/historic/historic.html',
            controller: 'HistoricParamsController',
            controllerAs: "historicCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE, USER_ROLES.SUPERVISOR_ROLE]
            }
        }).when('/historic', {
            templateUrl: 'components/supervision/historic/historic.html',
            controller: 'HistoricController',
            controllerAs: "historicCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE, USER_ROLES.SUPERVISOR_ROLE]
            }
        }).when('/admin-users', {
            templateUrl: 'components/administration/users-roles/admin-users.html',
            controller: 'AdminUsersController',
            controllerAs: "adminUsersCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
            }
        }).when('/admin-xpath', {
            templateUrl: 'components/administration/integration-batch/integration-batch.html',
            controller: 'AdminIntegrationBatchController',
            controllerAs: "integrationBatchCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
            }
        }).when('/admin-referencial', {
            templateUrl: 'components/administration/referencial/admin-referencial.html',
            controller: 'AdminReferencialController',
            controllerAs: "referencialCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
            }
        }).when('/admin-trays', {
            templateUrl: 'components/administration/tray/admin-trays.html',
            controller: 'AdminTrayController',
            controllerAs: "adminTrayCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
            }
        }).when('/admin-lists', {
            templateUrl: 'components/administration/lists/admin-lists.html',
            controller: 'AdminListsController',
            controllerAs: "adminListsCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
            }
        }).when('/admin-indexes', {
            templateUrl: 'components/administration/indexes/admin-indexes.html',
            controller: 'AdminIndexesController',
            controllerAs: "adminIndexesCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/login', {
            templateUrl: 'components/authentification/login.html',
            controller: 'LoginController',
            access: {
                loginRequired: false,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/loading', {
            templateUrl: 'components/loading/loading.html',
            access: {
                loginRequired: false,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/logout', {
            template: ' ',
            controller: 'LogoutController',
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/tray-detail/:trayId', {
            templateUrl: 'components/tray-treatment/tray-detail/tray-detail.html',
            controller: 'TrayDetailController',
            controllerAs: 'trayDetailCtrl',
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/envelope-detail/:envelopeId', {
            templateUrl: 'components/tray-treatment/envelope-detail/envelope-detail.html',
            controller: 'EnvelopeDetailController',
            controllerAs: 'envelopeDetailCtrl',
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/control-image/treatment/:trayId', {
            templateUrl: 'components/control-image/treatment/base-template.html',
            controller: 'ControlImageTreatmentBaseController',
            controllerAs: 'treatmentBaseCtrl',
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/control-image/treatment/:trayId/detail/:batchId', {
            templateUrl: 'components/control-image/treatment/detail-template.html',
            controller: 'ControlImageTreatmentDetailController',
            controllerAs: 'treatmentDetailCtrl',
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/control-image/reject/:trayId', {
            templateUrl: 'components/control-image/reject/base-template.html',
            controller: 'ControlImageRejectBaseController',
            controllerAs: 'rejectBaseCtrl',
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/control-image/reject/:trayId/detail/:batchId', {
            templateUrl: 'components/control-image/reject/detail-template.html',
            controller: 'ControlImageRejectDetailController',
            controllerAs: 'rejectDetailCtrl',
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/error/:code', {
            templateUrl: 'components/error/error.html',
            controller: 'ErrorController',
            controllerAs: "errorCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/admin-application', {
            templateUrl: 'components/administration/application/admin-application.html',
            controller: 'AdminAppController',
            controllerAs: "adminAppCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        }).when('/admin/entity-type/:entityTypeParams', {
            templateUrl: 'components/administration/entity-type/list/entity-type-list.html',
            controller: 'EntityTypeListController',
            controllerAs: "entityTypeListCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
            }
        }).when('/admin/entity-type/:entityTypeParams/add', {
            templateUrl: 'components/administration/entity-type/add/entity-type-add.html',
            controller: 'EntityTypeAddController',
            controllerAs: "entityTypeAddCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
            }
        }).when('/admin/entity-type/:entityTypeParams/update/:entityIdParams', {
            templateUrl: 'components/administration/entity-type/update/entity-type-update.html',
            controller: 'EntityTypeUpdateController',
            controllerAs: "entityTypeUpdateCtrl",
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ADMINISTRATOR_ROLE]
            }
        }).otherwise({
            redirectTo: '/error/404',
            access: {
                loginRequired: true,
                authorizedRoles: [USER_ROLES.ALL_ROLES]
            }
        });
    });
}