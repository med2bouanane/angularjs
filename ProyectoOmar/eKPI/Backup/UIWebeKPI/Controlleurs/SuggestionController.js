angular.module('SuggestionController', [])
.controller('SuggestionController', function ($scope, $http, $translate) {
   // $scope.lblTitreGlobal = "test";
//        var aLangue=$('#ddlLangue option:selected').val();
//        $translate.use(aLangue);
        $scope.EnvoyerSuggestion = function () {
            //if ($cookies.idUser == null){
            if (true){//
                var aTitre ="";
                if ($('#rbtM').attr('checked')){
                    aTitre = $('#lblM').text();
                }
                else if ($('#rbtMme').attr('checked')){
                    aTitre = $('#lblMme').text();
                }
                else{
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

                    }
                    else {
                        AfficherMessage(data.d.succes, data.d.message);
                    }
                })
                .error(function (data, status) {
                    alert(data.message);
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
                        $scope.divNotification = data.d.message;

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

//    String.prototype.format = function() {
//        var formatted = this;
//        for (var i = 0; i < arguments.length; i++) {
//            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
//            formatted = formatted.replace(regexp, arguments[i]);
//        }
//        return formatted;
//    }
    
    function AfficherMessage(theStatus, theKey){
        if (theStatus){
            var aMessage = ObtenirMessage(theKey);//ObtenirMessage(theLangue,theKey)
            //Traitement Langue
        }
    }

    

});




