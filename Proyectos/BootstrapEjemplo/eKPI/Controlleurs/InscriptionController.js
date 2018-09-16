angular.module('InscriptionController', [])
.controller('InscriptionController', function ($scope, $http) {


    //-------------------------------------------------------------------------//
    //------------------------------Inscription--------------------------------//
    //-------------------------------------------------------------------------//
    function Initialiser() {
        $("[id='brnPrecedant']").attr("style", "display:none");
        $("[id='brnSuivant']").attr("style", "display:block");
        $("[id='brnFinish']").attr("style", "display:none");
        if ($("[id$='rbtCompteExistant']").attr("checked")) {
            ActiverVueCompteExistant(true);
        }
        else {
            ActiverVueCompteExistant(false);
        }
    }

    function ActiverVueOUI() {
        $("[id$='rbtCompteExistant']").attr("checked", "true");
        ActiverVueConecte('true');
    }

    function ActiverVueCompteExistant(theVal) {
        if (theVal) {
            $("[id$='tblVueNoConecte']").attr("style", "display:none");
            $("[id$='tblDescription']").attr("style", "display:none");
            $("[id$='tblVueConecte']").attr("style", "display:block");
            $("[id$='tdDebutEtape2']").attr("class", "FinEtapeGrisFonce")
            $("[id$='tdEtape2']").attr("style", "visibility: hidden")
            $("[id$='tdFinEtape2']").attr("style", "visibility: hidden")
            ViderControles(["txtNom", "txtPrenom", "txtEmail", "txtFonction", "txtTelephone"]);
        }
        else {
            $("[id$='tblDescription']").attr("style", "display:block");
            $("[id$='tblVueNoConecte']").attr("style", "display:block");
            $("[id$='tblVueConecte']").attr("style", "display:none");
            if ($("[id$='hdnCurrentStep']").val() == '1') {
                $("[id$='tdDebutEtape2']").attr("class", "DebutEtapeGrise EtapeFondGrisClair");
            }
            else {
                $("[id$='tdDebutEtape2']").attr("class", "FinEtapeGrisFonce EtapeFondGrisClair");
            }
            $("[id$='tdEtape2']").attr("style", "visibility: visible")
            $("[id$='tdFinEtape2']").attr("style", "visibility: visible")
            ViderControles(["txtIdentifiant", "txtMotPasse"])
        }
    }

    function isNullOrEmpty(theVal) {
        return (theVal == undefined || theVal == null || theVal.length <= 0) ? true : false;
    }

    function ViderControles(theList) {
        for (i = 0; i < theList.length; i++) {
            $("[id$='" + theList[i] + "']").val('');
        }
    }

    function GestionEtape(theEtape) {
        switch (theEtape) {
            case 0:
                $("[id='tdDebutEtape1']").attr("class", "DebutEtapeGrise");
                $("[id='tdEtape1']").attr("class", "EtapeGrise");
                $("[id='tdDebutEtape2']").attr("class", "DebutEtapeGrisClair EtapeGrise");
                $("[id='tdEtape2']").attr("class", "EtapeFondGrisClair");
                $("[id='tdFinEtape2']").attr("class", "FinEtapeGrisClair EtapeFondGrisClair");
            case 1:
                $("[id='tdDebutEtape1']").attr("class", "DebutEtapeGrisClair");
                $("[id='tdEtape1']").attr("class", "EtapeFondGrisClair");
                $("[id='tdDebutEtape2']").attr("class", "DebutEtapeGrise EtapeFondGrisClair");
                $("[id='tdEtape2']").attr("class", "EtapeGrise");
                $("[id='tdFinEtape2']").attr("class", "FinEtapeGrisFonce");
            case 2:
                $("[id='trSteps']").attr("style", "display:none");
        }
    }

    $('[id$=brnPrecedant]').click(function () {
        if ($("[id$='rbtCompteExistant']").attr("checked")) {
            $("[id$='hdnCurrentStep']").val('2');
        }
        return false;
    });
    $('[id$=btnSuivant]').click(function () {

        return false;
    });
    $('[id$=btnFinish]').click(function () {

        return false;
    });



    $scope.CompteExistant = function () {
        switch ($scope.utilisateur.typeUtilisateur) {
            case '0':
                return true;
            case '1':
                return false;
            default:
                return true;
        }
    }

    $scope.NouveauUtilisateurPas1 = function () {
        return !($scope.CompteExistant)
    }

    $scope.NouveauUtilisateurPas2 = function () {
        return (!($scope.CompteExistant) && ($scope.hdnCurrentStep == 2));
    }

});