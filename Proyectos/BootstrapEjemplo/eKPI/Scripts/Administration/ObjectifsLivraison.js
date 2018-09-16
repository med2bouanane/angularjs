/// <reference path="../angular.min.js" />

angular.module('eKPI.administration.objectifsLivraison', ['eKPI.administration.services'])
    .controller('ObjectifsLivraisonCtrl', ['$scope', 'obtenirInformation', function ($scope, information) {
        $scope.objectifCourrant = {};
        $scope.historiqueObjectifs = {};

        information.ObtenirObjectifsLivraison().then(function (reponse) {
            $scope.historiqueObjectifs = reponse;
            if ($scope.historiqueObjectifs.length > 0) {
                //On utilise angular.copy afin de créer une copie du dernier objectif et non pas un passage par référence
                //(qui ferait que l'historique se mettrait à jour en même temps que l'objectif courrant)
                $scope.objectifCourrant = angular.copy($scope.historiqueObjectifs[0]);
            }
        });

        $scope.Choisir = function (objectif) {
            var chk = objectif.Checked;
            for (i = 0; i < $scope.historiqueObjectifs.length; i++) {
                $scope.historiqueObjectifs[i].Checked = false;
            }
            objectif.Checked = chk;
        };

        $scope.SauverObjectif = function () {
            $scope.objectifCourrant.DateCreation = '/Date(' + Date.now().toString() + ')/';
            $scope.objectifCourrant.IdUtilisateur = 145;
            $scope.historiqueObjectifs.unshift(angular.copy($scope.objectifCourrant));
            information.SauverObjectifLivraison($scope.objectifCourrant);
        };
    } ])
    .filter('jsonDate', function ($filter) {
        return function (input, format) {
            return $filter('date')(parseInt(input.substr(6)), format);
        };
    });