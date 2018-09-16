angular.module('RedifinitionController', [])
.controller('RedifinitionController',["$routeParams", "$location", function ($scope, $http, $routeParams, $location) {


    var EnumTypeIdentifiant = {
        id: 0,
        login: 1,
        guid: 2,
        email: 3
    }

    RemplirLogin();
    $scope.RedefinirMotPasse = function () {
        $http.post('WebServices/eKPIAcces.asmx/RedefinirMotPasse',
            {
                //theLangue: $scope.,
                thetxtAncienMotPasse: $scope.oldPass,
                theNouveauMotPasseConfirmation: $scope.NouveauMotPasseConfirmation,
                theIdentificateur: $scope.identificateur,
                theTypeIdentificateur:$scope.typeIdentificateur
            }
            ,
            {
                headers: { 'Content-Type': 'application/json' }
            }
            )
        .success(function (data) {
            if (data.d.succes) {
                ShowMessage(data.d.succes, data.d.message);
            }
            else {
                ShowMessage(data.d.succes, data.d.message);
            }
        })
        .fail(function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        });
    };


    function RemplirLogin() {
        var guid = ($location.search()).guid;
        if ((guid != null) && (guid != "")) {

            $http.post('WebServices/eKPIAcces.asmx/ObtenirUtilisateur',
            {
                theIdentifiant : guid,
                theTypeIdentifiant : EnumTypeIdentifiant.guid 
            }
             ,
            {
                headers: { 'Content-Type': 'application/json' }
            }
            )
        .success(function (data) {
            if (data.d.succes) {
                $('[id$=txlLogin]').val(data.d.email);
            }
            else {
                ShowMessage(data.d.succes, data.d.message);
            }
        })
        .fail(function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        });
        }
        else {

            //$scope.login = aUtilisateurObjectJson.email;      
        }
    }

    function AfficherMessage(theSucces, theMessage) {
        if (theSucces == EnumStatus.Succes) {
            $scope.lblNotification = data.d.message;
            //Get from resource
            $("#imgNotification").attr("src", "Images/ok.gif");
        }
        else if (theSucces == EnumStatus.NoSucces) {
            $scope.lblNotification = data.d.message;
            //Get from resource
            $("#imgNotification").attr("src", "Images/nook.gif");
        }
        else {
            $scope.lblNotification = data.d.message;
            //Write a literal text
            $("#imgNotification").attr("src", "Images/nook.gif");
        }
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}]);


