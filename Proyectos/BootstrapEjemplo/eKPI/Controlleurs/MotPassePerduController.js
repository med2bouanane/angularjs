angular.module('MotPassePerduController', ['eKPI.Utilisateur.ServiceUtilisateur'])
.controller('MotPassePerduController', ['$scope', '$http', 'GestionUtilisateur', function ($scope, $http, GestionUtilisateur) {

    var TypeIdentifiant = {
        id: 0,
        login: 1,
        guid: 2,
        email: 3
    }

    var EnumStatus = {
        Succes: 0,
        NoSucces: 1,
        Erreur: 2
    }

    $scope.identifiantData = { identifiant: '', TypeIdentifiant: '0' };
    $scope.notification = '';
    $scope.RecupererMotPasse = function () {

        switch ($scope.identifiantData.TypeIdentifiant) {
            case '0':
                aTypeIdentifiant = TypeIdentifiant.login;
                break;
            case '1':
                aTypeIdentifiant = TypeIdentifiant.email;
        }
        GestionUtilisateur.RedefinirMotPasse($scope.identifiantData.identifiant, aTypeIdentifiant)
        .then(function (reponse) {
            if (reponse.succes == EnumStatus.Succes) {
                console.log(reponse);
                $scope.notification = 'hola';
                AfficherMessage(reponse.succes, reponse.message);
                $("#divLoginEmail").attr("style", "display:none");
            }
            else {
                if (reponse.succes == EnumStatus.NoSucces) {
                    AfficherMessage(reponse.succes, reponse.message);
                }
                else {
                    AfficherMessage(reponse.succes, reponse.message); //message
                }
            }
        },
        function (reponse) {
            console.log(reponse);
        });

    };

    function AfficherMessage(theSucces, theMessage) {
        if (theSucces == EnumStatus.Succes) {
            $scope.notification = 'theMessage';
            //Get from resource
            $("#imgNotification").attr("src", "Images/ok.gif");
        }
        else if (theSucces == EnumStatus.NoSucces) {
            $scope.notification = theMessage;
            //Get from resource
            $("#imgNotification").attr("src", "Images/nook.gif");
        }
        else {
            $scope.notification = theMessage;
            //Write a literal text
            $("#imgNotification").attr("src", "Images/nook.gif");
        }
    }

} ]);