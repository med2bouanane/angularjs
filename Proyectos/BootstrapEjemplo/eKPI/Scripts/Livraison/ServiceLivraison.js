/// <reference path="../Angular/angular.js" />

angular.module('eKPI.livraison.services', [])
    .factory('obtenirInformationLivraison', function ($http) {
        var aServiceLivraison = {
            obtenirAccuseVueEnsemble: function (theParametre) { //theParametre est un objet javascript qui DOIT contenir 3 propriétés : theIdSite, theTypeCommade et theInfoBlocageClient
                var promise = $http({
                    url: 'WebServices/eKPI.asmx/ObtenirInfoVueEnsemble',
                    method: 'POST',
                    data: theParametre,
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(function (reponse) {
                    return reponse.data.d;
                }, function (error) {
                    return error;
                });
                return promise;
            }
        }
        return aServiceLivraison;
    });