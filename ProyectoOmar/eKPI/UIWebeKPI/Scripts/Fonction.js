/* 
Attention : Ne pas utiliser de <asp:CkeckBox> mais des <input type="checkbox" runat="server"> 
Il suffit de metre un class = CheckBoxSelectionnerTous pour le checkbox du header et class = CheckBoxSelectionner pour tous les autres
Les attributs suivant ont été ajoutés :
    - ControleADesactiver : permet de désactiver un ou plusieurs contrôles si rien n'est coché.
    - Group : permet d'utiliser plusieurs séries de cases à cocher au sein d'une même page.
*/

$(function () {
    //Permet de cocher ou décocher tous les checkbox en même temps lors du clic sur la checkbox "SelectionnerTous"
    $('.CheckBoxSelectionnerTous').on("click", function () {
        if ($(this).attr("Group") != undefined) {
            $('.CheckBoxSelectionner[group="' + $(this).attr('Group') + '"]').attr('checked', $(this).is(':checked')).trigger('change');
            ActiverDesactiverControles($(this).attr('Group'));
        } else {
            $('.CheckBoxSelectionner:not([Group])').attr('checked', $(this).is(':checked')).trigger('change');
            ActiverDesactiverControles();
        }
    });

    //Permet cocher ou décocher la checkbox "SelectionnerTous" lorsqu'on coche ou qu'on décoche tous les checkbox un par un
    $(".CheckBoxSelectionner").on("click", function () {
        if ($(this).attr("Group") != undefined) {
            //Si tous les checkboxes sont checkés --> Checker le SelectionnerTous
            if ($('.CheckBoxSelectionner[group="' + $(this).attr('Group') + '"]:checked').length == $('.CheckBoxSelectionner[group="' + $(this).attr('Group') + '"]').length)
                $('.CheckBoxSelectionnerTous[group="' + $(this).attr('Group') + '"]').attr('checked', true);
            else
                $('.CheckBoxSelectionnerTous[group="' + $(this).attr('Group') + '"]').attr('checked', false);

            ActiverDesactiverControles($(this).attr("Group"));
        } else {
            //Si tous les checkboxes sont checkés --> Checker le SelectionnerTous
            if ($('.CheckBoxSelectionner[attribute!="Group"]:checked').length == $('.CheckBoxSelectionner:not([Group])').length)
                $('.CheckBoxSelectionnerTous:not([Group])').attr('checked', true);
            else
                $('.CheckBoxSelectionnerTous:not([Group])').attr('checked', false);

            ActiverDesactiverControles();
        }
    });

    $(".CheckBoxSelectionner").each(function () {
        if ($(this).attr("Group") != undefined) {
            ActiverDesactiverControles($(this).attr("Group"));
        } else {
            ActiverDesactiverControles();
        }
    });

});

/*
Permet de désactiver des contrôles si rien n'est coché et de les activer des qu'on coche une des cases
la liste des Id doit se présenter sous la forme suivante : IDControle1;IDControle2;IDControle3
*/
function ActiverDesactiverControles(theGroup) {
    if (theGroup != undefined) {
        if ($('.CheckBoxSelectionnerTous[group="' + theGroup + '"]').attr('ControleADesactiver') != undefined && $('.CheckBoxSelectionnerTous[group="' + theGroup + '"]').attr('ControleADesactiver') != false) {
            var aListeIDControle = $('.CheckBoxSelectionnerTous[group="' + theGroup + '"]').attr('ControleADesactiver').split(";");

            if ($('.CheckBoxSelectionner[Group="' + theGroup + '"]:checked').length) {
                for (i = 0; i < aListeIDControle.length; i++) {
                    $("#" + aListeIDControle[i]).removeAttr("disabled");
                }
            } else {
                for (i = 0; i < aListeIDControle.length; i++) {
                    $("#" + aListeIDControle[i]).attr("disabled", "disabled");
                }
            }
        }
    } else {
        if ($(".CheckBoxSelectionnerTous:not([Group])").attr("ControleADesactiver") != undefined && $(".CheckBoxSelectionnerTous:not([Group])").attr("ControleADesactiver") != false) {
            var aListeIDControle = $(".CheckBoxSelectionnerTous:not([Group])").attr("ControleADesactiver").split(";");

            if ($('.CheckBoxSelectionner:not([Group]):checked').length) {
                for (i = 0; i < aListeIDControle.length; i++) {
                    $("#" + aListeIDControle[i]).removeAttr("disabled");
                }
            } else {
                for (i = 0; i < aListeIDControle.length; i++) {
                    $("#" + aListeIDControle[i]).attr("disabled", "disabled");
                }
            }
        }
    }
}

/*
Fonction permettant de vérifier l'extension d'un fichier
Pour l'utiliser, il faut définir un attribut "ExtensionsAcceptees" dans lequel on spécifie 
les extensions acceptées en prenant soin de les séparer par "|"
*/
$(function () {

    $('.VerifierExtension').on('change', function () {
        var aExtensions = $(this).attr('ExtensionsAcceptees');
        var aRegexExtension = new RegExp('(' + aExtensions + ')$', 'i');

        var aTableauChemin = $(this).val().split('.');
        var aExtension = aTableauChemin[aTableauChemin.length - 1];

        if ($(this).attr("MessageErreurExtension") != undefined && $(this).attr("MessageErreurExtension") != false)
            aMessageErreur = $(this).attr('MessageErreurExtension');
        else
            aMessageErreur = 'You can only use files with one of those extension: ' + aExtensions

        if ($(this).val() != '' && !aExtension.match(aRegexExtension)) {
            $(this).replaceWith($(this).val('').clone(true));
            $(this).val('');
            alert(aMessageErreur);
        }
    });
});

/*
Classe css qui permet de vérifier la taille d'un fichier
par défaut la taille max est limitée 4Mo, la valeur de l'attribut 'TailleMaxFichier' est en Ko
/!\ ne fonctionne qu'avec une version de JQuery < 1.9
*/

$(function () {

    $(".VerifierTailleFichier").on('change', function () {
        var aTailleFichierValide = true;
        var aTailleMax = 4 * 1024 * 1024;
        var aMessageErreur = "";

        if ($(this).attr("TailleMaxFichier") != undefined && $(this).attr("TailleMaxFichier") != false)
            aTailleMax = parseFloat($(this).attr('TailleMaxFichier')) * 1024;
        else
            aTailleMax = 4 * 1024 * 1024;

        if ($(this).attr("MessageErreurSpecifique") != undefined && $(this).attr("MessageErreurSpecifique") != false)
            aMessageErreur = $(this).attr('MessageErreurSpecifique');
        else
            aMessageErreur = "Max file size " + String(aTailleMax / 1024) + " Ko";

        if ($.browser.msie && parseFloat($.browser.version) < 10) {
            // Verification par contrôle active X pour les version d'internet explorer inférieur à 10

            try {
                var aActiveXObjet = new ActiveXObject("Scripting.FileSystemObject");
                if (aActiveXObjet.getFile($(this).val()).size >= aTailleMax) {
                    aTailleFichierValide = false;
                    $(this).val('');
                }
            } catch (ex) {
            }
        } else {
            // Vérification en JQuery pour les autres navigateurs et IE >= 10

            if ($(this).val() != '' && this.files[0].size > aTailleMax) {
                $(this).replaceWith($(this).val('').clone(true));
                $(this).val('');
                aTailleFichierValide = false;
            }
        }

        if (!aTailleFichierValide) alert(aMessageErreur);
    });
});

/* 
Attention : Ne pas utiliser de <asp:CkeckBox> mais des <input type="checkbox" runat="server"> 
Il suffit de metre un class = CheckBoxSelectionnerTous pour le checkbox du header et class = CheckBoxSelectionner pour tous les autres
Les attributs suivant ont été ajoutés :
- Group : permet d'utiliser plusieurs séries de cases à cocher au sein d'une même page.
*/

$(function () {
    //Permet de cocher ou décocher tous les checkbox en même temps lors du clic sur la checkbox "SelectionnerTous"
    $('.RadioSelectionnerTous').click(function () {
        $('.RadioSelectionner[group="' + $(this).attr('Group') + '"]:enabled').attr('checked', $(this).is(':checked'));

        if ($('.RadioSelectionner[group="' + $(this).attr('Group') + '"]:checked').length == $('.RadioSelectionner[group="' + $(this).attr('Group') + '"]').length)
            $('.RadioSelectionnerTous[group="' + $(this).attr('Group') + '"]').attr('checked', true);
        else
            $('.RadioSelectionnerTous').attr('checked', false);
    });

    //Permet cocher ou décocher la checkbox "SelectionnerTous" lorsqu'on coche ou qu'on décoche tous les checkbox un par un
    $(".RadioSelectionner").click(function () {
        //Si tous les checkboxes sont checkés --> Checker le SelectionnerTous
        if ($('.RadioSelectionner[group="' + $(this).attr('Group') + '"]:checked').length == $('.RadioSelectionner[group="' + $(this).attr('Group') + '"]').length)
            $('.RadioSelectionnerTous[group="' + $(this).attr('Group') + '"]').attr('checked', true);
        else
            $('.RadioSelectionnerTous').attr('checked', false);
    });
});

/*
Fonction permettant de vérifier si les champs sont remplis sur base d'une classe.
Le deuxième paramètre permet de dire si il faut faire clignoter ou non les contrôles.
Cette fonction revoie un booléen, si tout les champs sont remplis, elle revoie true.
*/

function ValiderChampObligatoire(theClassCSS, theFaireClignoterChamps) {
    var aChampRempli = true;
    var aListeControleAFaireClignoter = new Array();


    // Validation des champs texte et file.

    $("input." + theClassCSS + "[type=text], input." + theClassCSS + "[type=file]").each(function () {
        if ($(this).val() == "") {
            aChampRempli = false;
            aListeControleAFaireClignoter.push($(this));
        }
    });


    // Validation des selects

    $("select." + theClassCSS).each(function () {
        if ($(this)[0].selectedIndex <= 0) {
            aChampRempli = false;
            aListeControleAFaireClignoter.push($(this));
        }
    });


    // Validation des contrôle dans un div contenant la classe à vérifier.

    $("div." + theClassCSS).find("input, select").each(function () {
        if ($(this).is(":text")) {
            if ($(this).val() == "") {
                aChampRempli = false;
                aListeControleAFaireClignoter.push($(this));
            }

        } else if ($(this).is(":file")) {
            if ($(this).val() == "") {
                aChampRempli = false;
                aListeControleAFaireClignoter.push($(this));
            }

        } else if ($(this).is("select")) {
            if ($(this)[0].selectedIndex <= 0) {
                aChampRempli = false;
                aListeControleAFaireClignoter.push($(this).parents("div." + theClassCSS));
            }

        }
    });


    //Si on a pas préciser de valeur pour le paramètre theFaireClignoterChamps on le considère à true et on fait clignoter les champs.

    if (theFaireClignoterChamps == undefined || theFaireClignoterChamps.toLowerCase() == "true") {
        for (var i = 0; i < aListeControleAFaireClignoter.length; i++) {
            $(aListeControleAFaireClignoter[i]).stop(true, true).css("border-width", "2px");
            $(aListeControleAFaireClignoter[i]).fadeOut(300).fadeIn(300, function (e) {
                $(this).css("border-width", "1px");
            });
        }
    }

    return aChampRempli;
}

/*
Class CSS qui permettent de n'encoder que des nombre dans un champ texte.
*/

$(function () {
    $(".ChampNumeric").keydown(function (event) {
       // alert(event.keyCode);
        //capLock(event);
        // Allow: backspace, delete, tab, escape, and enter
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        } else {
            // Ensure that it is a number and stop the keypress
            if (!(event.keyCode == 8                                // backspace
        || event.keyCode == 46                              // delete
        || (event.keyCode >= 48 && event.keyCode <= 57 && event.shiftKey)     // numbers on keyboard T30839 
        || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
        ) {
                event.preventDefault();
            }
        }
    });

    $(".ChampNumericDecimal").keydown(function (event) {
        // Allow: backspace, delete, tab, escape, and enter
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39) ||
        // Allow: .
            ((event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 188) && (this.value.indexOf(".") == -1 && this.value.indexOf(",") == -1))) {
            // let it happen, don't do anything
            return;
        } else {
            // Ensure that it is a number and stop the keypress
            if (!(event.keyCode == 8                                // backspace
                || event.keyCode == 46                              // delete
                || (event.keyCode >= 48 && event.keyCode <= 57 && event.shiftKey)     // numbers on keyboard T30839 
                || (event.keyCode >= 96 && event.keyCode <= 105))   // number on keypad
                ) {
                event.preventDefault();
            }
        }
    });

    $(".ChampAlphabet").keydown(function (event) {
        // Allow: backspace, delete, tab, escape, and enter
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39) ||
        // Allow: .
            ((event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 188) && (this.value.indexOf(".") == -1 && this.value.indexOf(",") == -1))) {
            // let it happen, don't do anything
            return;
        } else {
            // Ensure that it is a number and stop the keypress
            if (!(event.keyCode == 8                                // backspace
                || event.keyCode == 46                              // delete
                || (event.keyCode >= 65 && event.keyCode <= 90))    // alphabet on keyboard
                ) {
                event.preventDefault();
            }
        }
    });
});