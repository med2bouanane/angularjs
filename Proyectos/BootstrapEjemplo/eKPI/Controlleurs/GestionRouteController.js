var app = angular.module("app", ['ngRoute', 'eKPI.administration.objectifsLivraison', 'eKPI.administration.blocageClient', 'eKPI.livraison.vueEnsemble', 'SuggestionController', 'MotPassePerduController', 'RedifinitionController', 'IndexController', 'ui.bootstrap','ContactController','IndexController']);
app.config(['$routeProvider',function($route){
        $route
        .when('/',{
            templateUrl: 'Default.html',
                controller:'IndexController'
        })
        .when('/index', {
            templateUrl: 'Default.html',
            controller:'IndexController'
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
        .when('/Acceuil', {
            templateUrl: 'Acceuil.html'
        })

        //Route vers les pages d'administration
        .when('/Administration/ObjectifsLivraison', {
            templateUrl: 'VuesPartielles/Administration/ConfigurationObjectif.html',
            controller: 'ObjectifsLivraisonCtrl'
        })
        .when('/Administration/BlocageClient', {
            templateUrl: 'VuesPartielles/Administration/BlocageClient.html',
            controller: 'BlocageClientCtrl'
        })
        .when('/Livraison/VueEnsemble', {
            templateUrl: 'VuesPartielles/Livraison/VueEnsemble.html',
            controller: 'VueEnsembleCtrl'
        })
        .when('/Livraispon/Analyse', {
            templateUrl: 'Livraison/Analyse.html',
            controller: 'AnalyseCtrl'
        })
        //Route par défaut :
        .otherwise({
            redirectTo:'/'
        })
    }]);


