/// <reference path="../Angular/angular.js" />
var aServices = angular.module('eKPI.administration.services', [])

aServices.service('obtenirInformation', ['$http', function ($http) {
    this.ObtenirObjectifsLivraison = function () {
        //Il faut utiliser une promise car il s'agit d'une requête asynchrone
        var promise = $http({
            url: 'WebServices/eKPI.asmx/ObtenirObjectifsLivraison',
            method: 'POST',
            data: '',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (reponse) {
                return reponse.data.d;
            });
        return promise;
    };

    this.SauverObjectifLivraison = function (theObjectif) {
        $http({
            url: 'WebServices/eKPI.asmx/SauverObjectifLivraison',
            method: 'POST',
            data: {
                theDescription: theObjectif.Description,
                theCommandePackMoinsZeroPlusZero: theObjectif.CommandePackMoinsZeroPlusZero,
                theCommandePackMoinsZeroPlusUn: theObjectif.CommandePackMoinsZeroPlusUn,
                theCommandeStandardMoinsDeuxPlusZero: theObjectif.CommandeStandardMoinsDeuxPlusZero,
                theCommandeStandardMoinsDeuxPlusDeux: theObjectif.CommandeStandardMoinsDeuxPlusDeux,
                theIdUtilisateur: theObjectif.IdUtilisateur
            },
            headers: {
                'Content-type': 'application/json'
            }
        }).error(function (data, status, headers, config) {
            console.log(data, status, headers, config);
        });
    };

    this.ObtenirIncoterms = function () {
        var promise = $http({
            url: 'WebServices/eKPI.asmx/ObtenirIncoterms',
            method: 'POST',
            data: '',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (reponse) {
                return reponse.data.d;
            });
        return promise;
    };
    this.ObtenirBlocageLivraison = function () {
        var promise = $http({
            url: 'WebServices/eKPI.asmx/ObtenirBlocageLivraison',
            method: 'POST',
            data: '',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (reponse) {
                return reponse.data.d;
            });
        return promise;
    };
    this.ObtenirHistoriqueBlocageClient = function () {
        var promise = $http({
            url: 'WebServices/eKPI.asmx/ObtenirHistoriqueBlocageLivraison',
            method: 'POST',
            data: '',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (reponse) {
                return reponse.data.d;
            });
        return promise;
    };
    this.ObtenirDetailsHistorique = function (IdHistorique) {
        var promise = $http({
            url: 'WebServices/eKPI.asmx/ObtenirDetailsHistorique',
            method: 'POST',
            data: { theIdHistoriqueBlocageClient: IdHistorique },
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (reponse) {
                return reponse.data.d;
            });
        return promise;
    }

    this.SauverBlocageClient = function (theListeIncoterms, theListeBlocageLivraison, theDescritpion, theIdUtilisateur) {
        $http({
            url: 'WebServices/eKPI.asmx/SauverBlocageClient',
            method: 'POST',
            data: {
                theListeIncoterms: theListeIncoterms,
                theListeBlocageLivraisons: theListeBlocageLivraison,
                theDescription: theDescritpion,
                theIdUtilisateur: theIdUtilisateur
            },
            headers: {
                'Content-type': 'application/json'
            }
        }).error(function (data, status, headers, config) {
            console.log(data, status, headers, config);
        });
    };
} ]);
