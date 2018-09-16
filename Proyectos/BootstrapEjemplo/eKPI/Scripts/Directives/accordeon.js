/// <reference path="../Angular/angular.js" />
/// <reference path="../../Controlleurs/GestionRouteController.js" />

app.directive('accordeon', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        templateUrl: 'VuesPartielles/Directives/accordeon.html',
        replace: true,
        link: function (scope, element, attrs) {
            var $aAccordeon = angular.element(element[0]);
            // Extraction des données de configuration

            var $aOuvertureMultiple = 1; //GetValeurConfiguration($aAccordeon, "OuvertureMultiple", "1");
            var $aDeployerTout = 0; //GetValeurConfiguration($aAccordeon, "DeployerTout", "0");
            var $aLangue = "fr"; //GetValeurConfiguration($aAccordeon, "Langue", "fr");
            var $aAfficherFlecheVerte = 0; //GetValeurConfiguration($aAccordeon, "AfficherFlecheVerte", "0");

            if (attrs.ouverturemultiple) {
                $aOuvertureMultiple = attrs.ouverturemultiple;
            }

            if (attrs.langue) {
                $aLangue = attrs.langue;
            }

            if (attrs.flecheverte) {
                $aAfficherFlecheVerte = attrs.flecheverte;
            }

            // On rajoute les events sur le click des rubriques
            $aAccordeon.children('.accordeonContenu').each(function () {
                var $container = angular.element(this);
                var $rubrique = $container.prev('.accordeonEnTete');
                $rubrique.on('click', function (e) {
                    e.preventDefault();
                    if ($container.is(':visible')) {
                        // Si l'ouverture multiple est off, on ne peut pas fermer l'onglet ouvert
                        if ($aOuvertureMultiple == "1") {
                            $container.hide('fast');
                            if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($container)) {
                                angular.element(this).find("img").attr("src", "Images/FlecheVerte.gif");
                            } else {
                                angular.element(this).find("img").attr("src", "Images/fleche.gif");
                            }
                            SupprimerOngletOuvert($aAccordeon, $container.attr("id"));
                            if ($aDeployerTout == "1") {
                                VerifierLibelleDeployerTout($aAccordeon);
                            }
                        }
                    } else {
                        // Si l'ouverture multiple est off, on ferme tout avant d'ouvrir l'onglet
                        if ($aOuvertureMultiple == "0") {
                            $aAccordeon.children('.accordeonContenu').each(function () {
                                angular.element(this).hide();
                                if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($container)) {
                                    angular.element(this).siblings('.accordeonEnTete').find("img").attr("src", "Images/FlecheVerte.gif");
                                } else {
                                    angular.element(this).siblings('.accordeonEnTete').find("img").attr("src", "Images/fleche.gif");
                                }
                                SupprimerOngletOuvert($aAccordeon, $container.attr("id"));
                            });
                        }
                        $container.show('fast');
                        if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($container)) {
                            angular.element(this).find("img").attr("src", "Images/FlecheBasVerte.gif");
                        } else {
                            angular.element(this).find("img").attr("src", "Images/flechebas.gif");
                        }
                        angular.element('html, body').animate({
                            scrollTop: $rubrique.offset().top
                        }, 200);
                        AjouterOngletOuvert($aAccordeon, $container.attr("id"));
                        if ($aDeployerTout == "1") {
                            VerifierLibelleDeployerTout($aAccordeon);
                        }
                    }
                });
                // Au chargement on cache toutes les rubriques
                $container.hide();
                if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($container)) {
                    $rubrique.find("img").attr("src", "Images/FlecheVerte.gif");
                } else {
                    $rubrique.find("img").attr("src", "Images/fleche.gif");
                }

                if (attrs.titre) {
                    $rubrique.append(attrs.titre);
                }
            });

            // On ouvre les rubriques listées dans le champs correspondant
            //            $.each($aAccordeon.children(".accordeonOuverture").val().split(';'), function (theIndex, theItem) {
            //                if (theItem != "") {
            //                    var aOnglet = $aAccordeon.children("#" + theItem);
            //                    aOnglet.show();

            //                    if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche(aOnglet)) {
            //                        aOnglet.prev('.accordeonEnTete').find("img").attr("src", "../Images//FlecheBasVerte.gif");
            //                    } else {
            //                        aOnglet.prev('.accordeonEnTete').find("img").attr("src", "../Images//flechebas.gif");
            //                    }
            //                }
            //            });

            // On ajoute un bouton "Déployer tout" si demandé
            if ($aDeployerTout == "1") {
                $aAccordeon.prepend("<input type='button' class='accordeonDeployerTout' onclick='DeployerTout(angular.element(this));return false;' style='float: right;margin-right:3px;' Etat='0' value=''/><br/><br/>");
                SetDeployerTout($aAccordeon.children(".accordeonDeployerTout"), 0);
            }

            function AjouterOngletOuvert(theAccordeon, theId) {
                theAccordeon.children(".accordeonOuverture").val(theAccordeon.children(".accordeonOuverture").val() + theId + ";");
            }

            function DeployerTout(theButton) {
                if (theButton.attr("Etat") == "0") {
                    theButton.parent('.accordeon').children('.accordeonContenu').each(function () {
                        angular.element(this).show();
                        if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche(angular.element(this))) {
                            angular.element(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//FlecheBasVerte.gif");
                        } else {
                            angular.element(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//flechebas.gif");
                        }
                        AjouterOngletOuvert(theButton.parent('.accordeon'), angular.element(this).attr("id"));
                    });
                    SetDeployerTout(theButton, 1);
                } else {
                    theButton.parent('.accordeon').children('.accordeonContenu').each(function () {
                        angular.element(this).hide();
                        if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche(angular.element(this))) {
                            angular.element(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//FlecheVerte.gif");
                        } else {
                            angular.element(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//fleche.gif");
                        }
                        SupprimerOngletOuvert(theButton.parent('.accordeon'), angular.element(this).attr("id"));
                    });
                    SetDeployerTout(theButton, 0);
                }
            }

            function GetValeurConfiguration(theAccordeon, theMotCle, theValeurParDefaut) {
                var $aConfiguration = theAccordeon.children(".accordeonConfiguration").val();
                if ($aConfiguration != "" && $aConfiguration.indexOf(theMotCle) > -1) {
                    return $aConfiguration.substr($aConfiguration.indexOf(theMotCle) + theMotCle.length + 1).split(";")[0];
                } else {
                    return theValeurParDefaut
                }
            }

            function SetDeployerTout(theButton, theEtat) {
                var $aLangue = GetValeurConfiguration(theButton.parent('.accordeon'), "Langue", "fr");
                if ($aLangue == "en") {
                    if (theEtat == 1) {
                        theButton.val("Display none");
                        theButton.attr("Etat", "1");
                    } else {
                        theButton.val("Display all");
                        theButton.attr("Etat", "0");
                    }
                } else {
                    if (theEtat == 1) {
                        theButton.val("Fermer tout");
                        theButton.attr("Etat", "1");
                    } else {
                        theButton.val("Déployer tout");
                        theButton.attr("Etat", "0");
                    }
                }
            }

            function SupprimerOngletOuvert(theAccordeon, theId) {
                theAccordeon.children(".accordeonOuverture").val(theAccordeon.children(".accordeonOuverture").val().replace(theId + ";", ""));
            }

            function VerifierLibelleDeployerTout(theAccordeon) {
                var aNombreOnglets = theAccordeon.children(".accordeonContenu").length;
                var aNombreElementsOuverts = theAccordeon.children(".accordeonOuverture").val().split(";").length - 1;
                if (aNombreElementsOuverts == 0) {
                    SetDeployerTout(theAccordeon.children(".accordeonDeployerTout"), 0);
                } else if (aNombreElementsOuverts == aNombreOnglets) {
                    SetDeployerTout(theAccordeon.children(".accordeonDeployerTout"), 1);
                }
            }

            function VerifierCouleurFleche(theDiv) {
                var aElementRempli = false;
                //Vérification des cases à cochées
                angular.element(theDiv).find("input:checkbox:checked:first").each(function () {
                    aElementRempli = true;
                });

                //Vérification des champs texte
                angular.element(theDiv).find(":text").each(function () {
                    if (angular.element(this).val() != '') {
                        aElementRempli = true;
                    }
                });

                //Vérification des champs texte avec tinyMCE
                angular.element(theDiv).find(".txtMCE").each(function () {
                    if (angular.element(this).val() != "") {
                        aElementRempli = true;
                    }
                });

                angular.element(theDiv).find("select").each(function () {
                    if (angular.element(this).children().length > 0) {
                        aElementRempli = true;
                    }
                });

                return aElementRempli;
            }
        }
    }
});