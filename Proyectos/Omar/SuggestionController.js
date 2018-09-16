angular.module('SuggestionController', [])
.controller('SuggestionController', function ($scope, $http) {
    $scope.lblTitreGlobal = "test";

/*
        $scope.EnvoyerSuggestion = function () {
            if ($cookies.idUser == null){//
                $http.post('WebServices/eKPIAcces.asmx/EnvoyerSuggestionNonConecte',
                {
                    theTitre: $scope.theTitre,
                    theNom: $scope.NouveauMotPasseConfirmation,
                    thePrenom: $scope.identificateur,
                    theFonction: $scope.typeIdentificateur,
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
                    if ((bool)(data.d.succes)) {
                        ShowMessage(data.d.succes, data.d.message);

                    }
                    else {
                        ShowMessage(data.d.succes, data.d.message);
                    }
                })
                .error(function (data, status) {
                    alert("ERROR");
                });
            } 
            else
            {
                $http.post('WebServices/eKPIAcces.asmx/EnvoyerSuggestionConecte',
                {
                    theIdUtilisateur: $cookies.idUser,
                    theSujet: $scope.sujet,
                    theMessage: $scope.message,
                }
                ,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
                )
             
                .success(function (data, status) {
                    if (data.d.succes) {
                        ShowMessage(data.d.succes, data.d.message);

                    }
                    else {
                        ShowMessage(data.d.succes, data.d.message);
                    }
                })
                .error(function (data, status) {
                    alert("ERROR");
                });
            }
        };

    String.prototype.format = function() {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    }
*/
});




