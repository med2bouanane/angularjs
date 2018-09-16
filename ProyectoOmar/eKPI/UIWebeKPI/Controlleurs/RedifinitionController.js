angular.module('RedifinitionController', [])
.controller('RedifinitionController', function ($scope, $http) {
//    $scope.TitreGlobal = "test";

    $scope.RedefinirMotPasse = function () {
        $http.post('WebServices/eKPIAcces.asmx/RedefinirMotPasse',
            {
                theLangue: $scope.usuario,
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
    };
});


function RemplirLogin() {
    if (($('[id$=hdnUtilisateur]').val() == null) || ($('[id$=hdnUtilisateur]').val() == '')) {
        var parametres = {};
        parametres.theIdentificateur = '2D86CBD4-B6A2-4855-BD94-C624E2FC896A';  //getParameterByName('guid'); //Recupere le guid depuis l'appelle
        parametres.theTypeIdentificateur = TypeIdentificateur.guid;
        //Appel ajax
        $.ajax({
            type: "POST",
            url: "WebServices/eKPIAcces.asmx/ObtenirUtilisateur",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(parametres),
            dataType: 'json'
        })
        .done(function (data) {
            if (data.d.succes) {
                $('[id$=txtNouveauMotPasse]').val(data.d.email);
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
    else{
        $('[id$=lblLogin]').val($('[id$=hdnUtilisateur]').val());
   }
}

function ShowMessage(theSucces, theMessage){
    if (theSucces){
        $('[id$=tblNouveauMotPasse]').attr('style', 'display:none');
        $("[id$='tblNouveauMotPasse']").attr('style', 'display:block');
        $scope.notification = theMessage;
        //$("[id$='imgMessage']").attr('url'
    }
    else {
        $('[id$=tblNouveauMotPasse]').attr('style', 'display:block');
        $("[id$='tblNouveauMotPasse']").attr("style", "display:block");
        $scope.notification = theMessage;
        //$("[id$='imgMessage']").attr('url'
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}