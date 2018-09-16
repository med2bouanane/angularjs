//var app = angular.module("app", ['ngRoute', 'SuggestionController', 'pascalprecht.translate'])

//.config(function ($translateProvider) {

//    $translateProvider.translations('en', {
//        "lblTitreGlobal": "Suggestion",
//        "lblNotification": "",
//        "lblTitre": "Title",
//        "lblM": "Mr",
//        "lblMme": "Mme",
//        "lblMlle": "Ms",
//        "lblNom": "Name",
//        "lblPrenom": "First name",
//        "lblFonction": "Occupation",
//        "lblEmail": "Email",
//        "lblPhone": "Phone",
//        "lblLangue": "Language",
//        "lblSujet": "Subject",
//        "lblMessage": "Message",
//        "btnEnvoyer": "Send Message",
//        "EmailTitreMessage": "Titre : Suggestion pour le portail KPI Industeel",

//        "msgErrorFormat": "One or more fields do not meet the required format",
//        "msgErrorEncodage": "Fields marked with * are required",
//        "msgSucces": "Your suggestion has been sent successfully",
//        "msgErreurGeneral": "An error has occurred at server side."
//    });

//    $translateProvider.translations('en', {
//  "lblTitreGlobal": "Suggestion",
//  "lblNotification": "",
//  "lblTitre": "Title",
//  "lblM": "Mr",
//  "lblMme": "Mme",    
//  "lblMlle": "Ms",
//  "lblNom": "Name",
//  "lblPrenom": "First name",
//  "lblFonction": "Occupation",
//  "lblEmail": "Email",
//  "lblPhone": "Phone",
//  "lblLangue": "Language",
//  "lblSujet": "Subject",
//  "lblMessage": "Message",
//  "btnEnvoyer": "Send Message",
//  "EmailTitreMessage": "Titre : Suggestion pour le portail KPI Industeel",
//  
//  "msgErrorFormat": "One or more fields do not meet the required format",
//  "msgErrorEncodage": "Fields marked with * are required",
//  "msgSucces": "Your suggestion has been sent successfully",
//  "msgErreurGeneral": "An error has occurred at server side."
//    });
//    $translateProvider.preferredLanguage('en');
//});

var app = angular.module("app", ['ngRoute', 'SuggestionController', 'pascalprecht.translate'])
.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: "/Traduction/",
        suffix: ".json"
    });
    $translateProvider.preferredLanguage("en");

} );