/// <reference path="../Angular/angular.js" />

angular.module('eKPI.livraison.vueEnsemble', ['eKPI.administration.services', 'eKPI.livraison.services'])
    .controller('VueEnsembleCtrl', ['$scope', 'obtenirInformation', 'obtenirInformationLivraison', function ($scope, information, infoLivraison) {
        $scope.titre = {
            principal: 'Livraison',
            secondaire: 'Vue ensemble'
        };
        $scope.recherche = {
            idSite: 0,
            typeCommande: '1',
            blocageClient: 0,
            IndicateurStandart: 0,
            IndicateurPack: 0
        };
        $scope.objectifLivraisons = {};
        $scope.accuses = {};
        $scope.IndicePerformance = {
            Min: 0,
            Max: 1
        };

        information.ObtenirObjectifsLivraison().then(function (reponse) {
            $scope.objectifLivraisons = reponse.reverse();
        });

        $scope.masquerIndicateurStandart = function () {
            switch ($scope.recherche.typeCommande) {
                case '1':
                    return false;
                case '2':
                    return true;
                default:
                    return false;
            }
        };

        $scope.masquerIndicateurPack = function () {
            switch ($scope.recherche.typeCommande) {
                case '1':
                    return true;
                case '2':
                    return false;
                default:
                    return true;
            }
        };

        $scope.chargerGraphique = function () {
            var parametres = {
                theIdSite: $scope.recherche.idSite,
                theTypeCommande: $scope.recherche.typeCommande,
                theInfoBlocageClient: $scope.recherche.blocageClient
            };
            infoLivraison.obtenirAccuseVueEnsemble(parametres)
                .then(function (reponse) {
                    $scope.accuses = reponse;

                    switch ($scope.recherche.typeCommande) {
                        case '1':
                            if ($scope.recherche.IndicateurStandart) {
                                $scope.IndicePerformance = { Min: -2, Max: 0 };
                            } else {
                                $scope.IndicePerformance = { Min: -2, Max: 2 };
                            }
                            break;
                        case '2':
                            if ($scope.recherche.IndicateurPack) {
                                $scope.IndicePerformance = { Min: 0, Max: 0 };
                            } else {
                                $scope.IndicePerformance = { Min: 0, Max: 1 };
                            }
                            break;
                    }

                    var aAccusesOK = {}, base, key;
                    var aAccusesNOK = {}, base, key;
                    var aPourcentOK = {}, base, key;

                    angular.forEach($scope.accuses, function (accuse, index) {
                        key = accuse.DateSortieMoisAnnee;
                        if (!aAccusesOK[key]) {
                            aAccusesOK[key] = 0;
                        }
                        if (!aAccusesNOK[key]) {
                            aAccusesNOK[key] = 0;
                        }

                        if (accuse.IndicePerformance >= $scope.IndicePerformance.Min && accuse.IndicePerformance <= $scope.IndicePerformance.Max) {
                            aAccusesOK[key] += 1;
                        } else {
                            aAccusesNOK[key] += 1;
                        }
                    });

                    var aLabels = [];
                    var aOK = [];
                    angular.forEach(aAccusesOK, function (val, key) {
                        aOK.push(val);
                        aLabels.push(key);
                    });

                    var aNOK = [];
                    angular.forEach(aAccusesNOK, function (val, key) {
                        aNOK.push(val);
                    });

                    var aPourcentOK = [];
                    angular.forEach(aAccusesOK, function (val, key) {
                        var aPourcent = (val / (val + aAccusesNOK[key])) * 100;
                        aPourcentOK.push(parseFloat(aPourcent.toFixed(2)));
                    });

                    var aObjectifs = [];

                    angular.forEach(aNOK, function (index, val) {
                        aObjectifs.push(null);
                    });

                    angular.forEach($scope.objectifLivraisons, function (aObjectif, aIndex) {
                        angular.forEach(aLabels, function (val, index) {
                            if (val == aObjectif.SemaineCreation) {
                                for (i = index; i < aObjectifs.length; i++) {
                                    switch ($scope.recherche.typeCommande) {
                                        case '1':
                                            if ($scope.recherche.IndicateurStandart == 0) {
                                                aObjectifs[i] = aObjectif.CommandeStandardMoinsDeuxPlusZero;
                                            } else {
                                                aObjectifs[i] = aObjectif.CommandeStandardMoinsDeuxPlusDeux;
                                            }
                                            break;
                                        case '2':
                                            if ($scope.recherche.IndicateurPack == 0) {
                                                aObjectifs[i] = aObjectif.CommandePackMoinsZeroPlusZero;
                                            } else {
                                                aObjectifs[i] = aObjectif.CommandePackMoinsZeroPlusUn;
                                            }
                                            break;
                                    }
                                }
                            }
                        });
                    });

                    ChargerGraphique(aLabels, aOK, aNOK, aPourcentOK, aObjectifs);
                });
        };

        function ChargerGraphique(labels, accuseOK, accuseNOK, pourcentageOK, objectifsLivraison) {
            Highcharts.dateFormats = {
                W: function (timestamp) {
                    var date = new Date(timestamp);
                    var onejan = new Date(date.getFullYear(), 0, 1);
                    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                    var dayOfYear = ((today - onejan + 86400000) / 86400000);

                    return Math.ceil(dayOfYear / 7);

                }
            };

            Highcharts.setOptions({
                colors: ["#ff3700", "#42A07B", "#9B5E4A", "#72727F", "#82914E", "#12E3f0", "#fcf645", "#c8e3b9", "#a498d6", "#cd3773", "#595fd5", "#1F949A", "#c393d6", "#964d8a", "#964d8a", "#eebe62", "#0bd2be", "#86777F", "#fc4f1a", "#e75532", "#cf0f4c", "#de4069", "#df7fa8", "#bf112f", "#110263", "#d7fa7a", "#48307d", "#48307d", "#65b294", "#2b5f0a", "#073baa", "#f4ef76", "#c6a0b1", "#af6131", "#2f32e9", "#42cd0a", "#6d3a6d", "#ba68ee", "#839396", "#dff4ad", "#1b1372", "#acab8e", "#93fd48", "#22a265", "#e76ae2", "#e69a42", "#6b58d2", "#c3906a", "#4070f0", "#38cc5c", "#c6daef", "#b468ec", "#9c3e69", "#60cb39", "#e6be7e", "#62d8e5", "#25712b", "#503804", "#6752c5", "#9d9706", "#7f9f9c", "#a9edb3", "#ce0f46", "#07828d", "#ababde", "#718de1", "#7d348e", "#fdc2a6", "#fdc2a6", "#4b08d2"]
            });

            angular.element('#graphique').highcharts({
                exporting: {
                    enabled: false
                },
                chart: {
                    type: 'column',
                    zoomType: 'x'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: labels,
                    labels: {
                        align: 'right',
                        rotation: -45,
                        y: 35,
                        align: 'center'
                    }
                },
                yAxis: [{
                    gridLineWidth: 0,
                    opposite: false,
                    title: {
                        x: 15,
                        rotation: -90,
                        text: 'Nombre de commandes'
                    },
                    labels: {
                        x: 10,
                        y: 5,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false
                }, {
                    gridLineWidth: 1,
                    opposite: true,
                    title: {
                        text: 'Pourcentage OK'
                    },
                    labels: {
                        x: 0,
                        y: 5,
                        format: '{value:.,0f}'
                    },
                    showFirstLabel: false
                }],
                tooltip: {
                    crosshairs: true,
                    formatter: function () {
                        return this.series.name + ' : <b>' + this.y + '</b>';
                    }
                },
                labels: {
                    items: [{
                        html: '',
                        style: {
                            left: '50px',
                            top: '18px',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    }]
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    type: 'column',
                    name: 'NOK [-2;+0]',
                    data: accuseNOK
                }, {
                    type: 'column',
                    name: 'OK [-2;+0]',
                    data: accuseOK
                }, {
                    type: 'line',
                    yAxis: 1,
                    name: 'Objectif',
                    data: objectifsLivraison,
                    marker: {
                        enabled: false
                    }
                }, {
                    type: 'spline',
                    yAxis: 1,
                    name: '% OK',
                    data: pourcentageOK,
                    marker: {
                        enabled: false
                    }
                }]
            });
        }
    } ]);