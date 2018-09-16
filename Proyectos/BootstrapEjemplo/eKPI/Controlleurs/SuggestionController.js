angular.module('SuggestionController', ['pascalprecht.translate'])
.controller('SuggestionController', function ($scope, $http,$translate) {
/*
    var option = {
        lng: $("#ddlLangue").val(),
        cookieName: 'langue',
        resGetPath: 'Traductions/__ns__-__lng__.json'
    };

    i18n.init(option, function (t) {
        $(".Traduction").i18n();
        $("#btnEnvoyer").val(i18n.t("btnEnvoyer"));
    });

    $("#ddlLangue").change(function () {
        i18n.setLng($("#ddlLangue").val(), function (t) {
            $(".Traduction").i18n();
            $("#btnEnvoyer").val(i18n.t("btnEnvoyer"));
        });
    });
*/
        $( "#ddlLangue" ).change(function() {
            $scope.$apply(function () {
            $translate.use($('#ddlLangue ').val());
            });
        });

    //AfficherChamps();

    $scope.EnvoyerSuggestion = function () {
        //        $cookieStore.put('myIdUtilisateur', '123456789');
        //        var aIdUtilisateurCookie = $cookieStore.get('myIdUtilisateur');
        //        if (aIdUtilisateurCookie == null) {
        if (true) {//
            var aTitre = "";
            if ($('#rbtM').attr('checked')) {
                aTitre = $('#lblM').text();
            }
            else if ($('#rbtMme').attr('checked')) {
                aTitre = $('#lblMme').text();
            }
            else {
                aTitre = $('#lblMlle').text();
            }
            $http.post('WebServices/eKPIAcces.asmx/EnvoyerSuggestionNonConecte',
                {
                    theTitre: aTitre,
                    theNom: $scope.nom,
                    thePrenom: $scope.prenom,
                    theFonction: $scope.fonction,
                    theEmail: $scope.email,
                    theTelephone: $scope.telephone,
                    theddlLangue: $scope.langue,
                    theSujet: $scope.sujet,
                    theMessage: $scope.message
                }
                ,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
                )
                .success(function (data, status) {
                    if ((Boolean)(data.d.succes)) {
                        AfficherMessage(data.d.succes, data.d.message);
                        $("#tblVueNoConecte").attr('disabled', 'none');
                    }
                    else {
                        AfficherMessage(data.d.succes, data.d.message);
                    }
                })
                .error(function (data, status) {
                    //AfficherMessage(false, data);
                });
        }
        else {
            $http.post('WebServices/eKPIAcces.asmx/EnvoyerSuggestionConecte',
                {
                    theIdUtilisateur: aIdUtilisateurCookie,
                    theSujet: $scope.sujet,
                    theMessage: $scope.message
                }
                ,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
                )
                .success(function (data, status) {
                    if (data.d.succes) {
                        AfficherMessage(data.d.succes, data.d.message);
                        $("#tblVueNoConecte").attr('disabled', 'none');
                    }
                    else {
                        AfficherMessage(data.d.succes, data.d.message);
                    }
                })
                .error(function (data, status) {
                    //AfficherMessage(false, data);
                });
        }
    };

    //    String.prototype.format = function() {
    //        var formatted = this;
    //        for (var i = 0; i < arguments.length; i++) {
    //            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
    //            formatted = formatted.replace(regexp, arguments[i]);
    //        }
    //        return formatted;
    //    }  

    function AfficherMessage(theSucces, theMessage) {
        if (theSucces) {
            $scope.divNotification = data.d.message;
            $("#imgNotification").attr("src", "Images/ok.gif");
        }
        else {
            $scope.divNotification = data.d.message;
            $("#imgNotification").attr("src", "Images/nook.gif");
        }
    }

//    function AfficherChamps() {
//        var aIdUtilisateurCookie = $cookieStore.get('myIdUtilisateur');
//        if (aIdUtilisateurCookie == null) {
//            $("#trTitre").attr('display', 'none');
//            $("#trNom").attr('display', 'none');
//            $("#trPrenom").attr('display', 'none');
//            $("#trFonction").attr('display', 'none');
//            $("#trEmail").attr('display', 'none');
//            $("#trPhone").attr('display', 'none');
//            $("#trLangue").attr('display', 'none');
//            $("#trPhone").attr('display', 'none');
//        }
//        else {
//            $("#trTitre").attr('display', 'block');
//            $("#trNom").attr('display', 'block');
//            $("#trPrenom").attr('display', 'block');
//            $("#trFonction").attr('display', 'block');
//            $("#trEmail").attr('display', 'block');
//            $("#trPhone").attr('display', 'block');
//            $("#trLangue").attr('display', 'block');
//            $("#trPhone").attr('display', 'block');
//        }
//    }

})
    .config(['$translateProvider', function ($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: "./Traductions/",
            suffix: ".json"
        });

        $translateProvider.preferredLanguage('fr');


    }]);




