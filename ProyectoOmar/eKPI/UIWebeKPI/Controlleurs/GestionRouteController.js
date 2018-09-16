//var app = angular.module("app", ['ngRoute']); //'ConfidentialiteController',, 'ngCookies']);
app.config(['$routeProvider',function($route){
        $route
        .when('/',{
            templateUrl: 'Default.html',
            controller: 'ControllerDefault'
        })
        .when('/index', {
            templateUrl: 'Default.html',
            controller: 'ControllerDefault'
        })
         .when('/Redefinition', {
            templateUrl: 'Redefinition.html',
	        controller: 'RedifinitionController'
	    })
        .when('/Suggestion', {
            templateUrl: 'Suggestion.html',
            controller: 'SuggestionController'
        })
        .when('/MotPassePerdu', {
            templateUrl: 'MotPassePerdu.html',
            controller: 'MotPassePerduController'
        })
        .when('/Preferences', {
            templateUrl: 'Preferences.html',
            controller: 'PreferencesController'
        })
        .when('/Inscription', {
            templateUrl: 'Inscription.html',
            controller: 'InscriptionController'
        })
        .when('/GestionProfil', {
            templateUrl: 'GestionProfil.html',
            controller: 'GestionProfilController'
        })
        .when('/Contact', {
            templateUrl: 'Contact.html',
            controller: 'ContactController'
        })
        .when('/Confidentialite', {
            templateUrl: 'Confidentialite.html',
            controller: 'ConfidentialiteController'
        })
        .when('/Conditions', {
            templateUrl: 'Conditions.html',
            controller: 'ConditionsController'
        })
        .otherwise({
            redirectTo:'/'
        })
    }]);


