/// <reference path="../Angular/angular.js" />

angular.module('eKPI.administration.blocageClient', ['eKPI.administration.services'])
    .controller('BlocageClientCtrl', ['$scope', 'obtenirInformation', '$modal', function ($scope, info, $modal) {
        $scope.Incoterms = {};
        $scope.BlocageLivraisons = {};
        $scope.HistoriqueCourrant = {};
        $scope.HistoriqueBlocageClient = {};
        $scope.HistoriqueSelectionne = {};

        ChargerDonnees();

        $scope.SauverChangement = function () {
            info.SauverBlocageClient($scope.Incoterms, $scope.BlocageLivraisons, $scope.HistoriqueCourrant.Description, 145);
            $scope.HistoriqueCourrant.DateCreation = '/Date(' + Date.now().toString() + ')/';
            $scope.HistoriqueBlocageClient.unshift(angular.copy($scope.HistoriqueCourrant));

        };

        $scope.Choisir = function (theHistorique) {
            var aCoche = theHistorique.Checked;

            for (i = 0; i < $scope.HistoriqueBlocageClient.length; i++) {
                $scope.HistoriqueBlocageClient[i].Checked = false;
            }

            if (aCoche) {
                $scope.HistoriqueSelectionne = theHistorique;
            } else {
                $scope.HistoriqueSelectionne = {};
            }

            theHistorique.Checked = aCoche
        };

        $scope.OuvrirModal = function () {
            if ($scope.HistoriqueSelectionne.IdHistoriqueBlocageClient) {
                $modal.open({
                    templateUrl: 'VuesPartielles/Administration/HistoriqueBlocageClient.html',
                    controller: 'AfficherHistoriqueCtrl',
                    size: 'lg',
                    resolve: {
                        information: function () {
                            return {
                                historique: $scope.HistoriqueSelectionne,
                                incoterms: $scope.Incoterms,
                                blocageLivraisons: $scope.BlocageLivraisons
                            }
                        }
                    }
                });
            }
        };

        function ChargerDonnees() {
            info.ObtenirIncoterms().then(function (reponse) {
                $scope.Incoterms = reponse;
            });

            info.ObtenirBlocageLivraison().then(function (reponse) {
                $scope.BlocageLivraisons = reponse;
            });

            info.ObtenirHistoriqueBlocageClient().then(function (reponse) {
                $scope.HistoriqueBlocageClient = reponse;
                for (i = 0; i < $scope.HistoriqueBlocageClient.length; i++) {
                    $scope.HistoriqueBlocageClient[i].Checked = false;
                }
                $scope.HistoriqueCourrant = angular.copy($scope.HistoriqueBlocageClient[0]);
            });
        }
    } ])

//Controlleur de la popup modal
    .controller('AfficherHistoriqueCtrl', ['$scope', '$modalInstance', 'obtenirInformation', 'information', function ($scope, $modalInstance, info, information) {
        $scope.historique = information.historique;
        $scope.incoterms = information.incoterms;
        $scope.blocageLivraisons = information.blocageLivraisons;
        $scope.detailsHistorique = {};

        info.ObtenirDetailsHistorique($scope.historique.IdHistoriqueBlocageClient)
            .then(function (reponse) {
                $scope.detailsHistorique = reponse;
                for (i = 0; i < $scope.incoterms.length; i++) {
                    $scope.incoterms[i].Checked = false;
                    for (j = 0; j < $scope.detailsHistorique.length; j++) {
                        if ($scope.incoterms[i].IdIncotermSAP === $scope.detailsHistorique[j].IdIncotermSAP) {
                            $scope.incoterms[i].Checked = true;
                        }
                    }
                }

                for (i = 0; i < $scope.blocageLivraisons.length; i++) {
                    $scope.blocageLivraisons[i].Checked = false;
                    for (j = 0; j < $scope.detailsHistorique.length; j++) {
                        if ($scope.blocageLivraisons[i].IdBlocageLivraison === $scope.detailsHistorique[j].IdBlocageLivraison) {
                            $scope.blocageLivraisons[i].Checked = true;
                        }
                    }
                }
            });



        $scope.fermer = function () {
            $modalInstance.dismiss('cancel');
        };
    } ]);
