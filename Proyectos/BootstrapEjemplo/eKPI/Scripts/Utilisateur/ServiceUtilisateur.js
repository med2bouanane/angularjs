var aServices = angular.module('eKPI.Utilisateur.ServiceUtilisateur', [])

aServices.service('GestionUtilisateur', ['$http', function ($http) {
    this.ConnecterUtilisateur = function (theIdentifiant, theMotPasse) {
        var promise = $http({
            url: 'WebServices/eKPIAcces.asmx/ObtenirAcces',
            method: 'POST',
            data: {
                theIdentifiant: theIdentifiant,
                theMotPasse: theMotPasse
            },
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (reponse) {
                return reponse.data.d;
            });
        return promise;
    };

    this.RedefinirMotPasse = function (theIdentifiant, theTypeIdentifiant) {
        var promise = $http({
            url: 'WebServices/eKPIAcces.asmx/RecupererMotPasse',
            method: 'POST',
            data: {
                theIdentifiant: theIdentifiant,
                theTypeIdentifiant: theTypeIdentifiant
            },
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (reponse) {
                return reponse.data.d;
            });
        return promise;
    };
}]);