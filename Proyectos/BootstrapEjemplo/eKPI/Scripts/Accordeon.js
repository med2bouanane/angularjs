/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cet accordeon permet un affichage identique partout où il est appelé sans besoin de rajout en Javascript ou Code-behind //
// Il nécessite juste de respecter la logique de structure donnée en bas de fichier                                        //
//                                                                                                            Janvier 2014 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
$(function () {
    // On commence par cacher les champs de configurations de l'accordeon
    $(".accordeonOuverture").each(function (index, item) { $(this).hide(); });
    $(".accordeonConfiguration").each(function (index, item) { $(this).hide(); });

    $('.accordeon').each(function () {
        var $aAccordeon = $(this);
        // Extraction des données de configuration
        var $aOuvertureMultiple = GetValeurConfiguration($aAccordeon, "OuvertureMultiple", "0");
        var $aDeployerTout = GetValeurConfiguration($aAccordeon, "DeployerTout", "0");
        var $aLangue = GetValeurConfiguration($aAccordeon, "Langue", "fr");
        var $aAfficherFlecheVerte = GetValeurConfiguration($aAccordeon, "AfficherFlecheVerte", "0");

        // On rajoute les events sur le click des rubriques
        $aAccordeon.children('.accordeonContenu').each(function () {
            var $container = $(this);
            var $rubrique = $container.prev('.accordeonEnTete');
            $rubrique.on('click', function (e) {
                e.preventDefault();
                if ($container.is(':visible')) {
                    // Si l'ouverture multiple est off, on ne peut pas fermer l'onglet ouvert
                    if ($aOuvertureMultiple == "1") {
                        $container.hide('fast');
                        if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($container)) {
                            $(this).find("img").attr("src", "../Images//FlecheVerte.gif");
                        } else {
                            $(this).find("img").attr("src", "../Images//fleche.gif");
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
                            $(this).hide();
                            if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($container)) {
                                $(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//FlecheVerte.gif");
                            } else {
                                $(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//fleche.gif");
                            }
                            SupprimerOngletOuvert($aAccordeon, $container.attr("id"));
                        });
                    }
                    $container.show('fast');
                    if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($container)) {
                        $(this).find("img").attr("src", "../Images//FlecheBasVerte.gif");
                    } else {
                        $(this).find("img").attr("src", "../Images//flechebas.gif");
                    }
                    $('html, body').animate({
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
                $rubrique.find("img").attr("src", "../Images//FlecheVerte.gif");
            } else {
                $rubrique.find("img").attr("src", "../Images//fleche.gif");
            }
        });

        // On ouvre les rubriques listées dans le champs correspondant
        $.each($aAccordeon.children(".accordeonOuverture").val().split(';'), function (theIndex, theItem) {
            if (theItem != "") {
                var aOnglet = $aAccordeon.children("#" + theItem);
                aOnglet.show();

                if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche(aOnglet)) {
                    aOnglet.prev('.accordeonEnTete').find("img").attr("src", "../Images//FlecheBasVerte.gif");
                } else {
                    aOnglet.prev('.accordeonEnTete').find("img").attr("src", "../Images//flechebas.gif");
                }
            }
        });

        // On ajoute un bouton "Déployer tout" si demandé
        if ($aDeployerTout == "1") {
            $aAccordeon.prepend("<input type='button' class='accordeonDeployerTout' onclick='DeployerTout($(this));return false;' style='float: right;margin-right:3px;' Etat='0' value=''/><br/><br/>");
            SetDeployerTout($aAccordeon.children(".accordeonDeployerTout"), 0);
        }
    });
});

function AjouterOngletOuvert(theAccordeon, theId) {
    theAccordeon.children(".accordeonOuverture").val(theAccordeon.children(".accordeonOuverture").val() + theId + ";");
}

function DeployerTout(theButton) {
    if (theButton.attr("Etat") == "0") {
        theButton.parent('.accordeon').children('.accordeonContenu').each(function () {
            $(this).show();
            if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($(this))) {
                $(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//FlecheBasVerte.gif");
            } else {
                $(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//flechebas.gif");
            }
            AjouterOngletOuvert(theButton.parent('.accordeon'), $(this).attr("id"));
        });
        SetDeployerTout(theButton, 1);
    } else {
        theButton.parent('.accordeon').children('.accordeonContenu').each(function () {
            $(this).hide();
            if ($aAfficherFlecheVerte == "1" && VerifierCouleurFleche($(this))) {
                $(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//FlecheVerte.gif");
            } else {
                $(this).siblings('.accordeonEnTete').find("img").attr("src", "../Images//fleche.gif");
            }
            SupprimerOngletOuvert(theButton.parent('.accordeon'), $(this).attr("id"));
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
    $(theDiv).find("input:checkbox:checked:first").each(function () {
        aElementRempli = true;
    });

    //Vérification des champs texte
    $(theDiv).find(":text").each(function () {
        if ($(this).val() != '') {
            aElementRempli = true;
        }
    });

    //Vérification des champs texte avec tinyMCE
    $(theDiv).find(".txtMCE").each(function () {
        if ($(this).val() != "") {
            aElementRempli = true;
        }
    });

    $(theDiv).find("select").each(function () {
        if ($(this).children().length > 0) {
            aElementRempli = true;
        }
    });

    return aElementRempli;
}

/////////////////////
// ---Structure--- //
/////////////////////

//<div class="accordeon">
//    <div class="accordeonEnTete">
//         <img />
//    </div>
//    <div class="accordeonContenu"></div>
//    <input type="text" class="accordeonConfiguration" value="DeployerTout=0;OuvertureMultiple=0;" />
//    <input type="text" class="accordeonOuverture" />
//</div>

// Les "div" peuvent être autre chose tant qu'ils possèdent la class appropriée et respectent la structure
// Les champs "text" seront masqués à l'écran mais sont nécessaire pour l'utilisation de class

// ---accordeonConfiguration---
// Permet de configurer différents paramètres de l'accordeon :
// DeployerTout -- Affiche un bouton permettant de tout ouvrir et tout refermer en un click (valeur à 0 ou 1) -- valeur par défaut: 0
// OuvertureMultiple -- Permet de spécifier si on peut, ou non, ouvrir plusieurs onglets simultanément (valeur à 0 ou 1) -- valeur par défaut: 0
// AfficherFlecheVerte -- Permet de mettre la flèche en vert si l'un des controles est rempli (valeur à 0 ou 1) -- valeur par défaut: 0
// Langue -- Langue dans laquelle s'affichera le bouton "Deployer tout" (valeur à fr ou en) -- valeur par défaut: fr

// ---accordeonOuverture---
// Liste des clientId des "accordeonContenu" devant être ouvert au chargement de la page