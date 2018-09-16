var TypeIdentificateur = {
    id: 0,
    login: 1,
    guid:2
}
Object.freeze(TypeIdentificateur)

$(document).ready(function () {

    RemplirChamps();

    $('[id$=btnValider]').click(function () {
        var aLogin = $('[id$=lblLogin]').val();
        var aAncienMotPasse = $('[id$=txtAncienMotPasse]').val();
        var aNouveauMotPasse = $('[id$=txtNouveauMotPasse]').val();
        var aNouveauMotPasseConfirmation = $('[id$=txtNouveauMotPasseConfirmation]').val();
        var parametres = {};
        parametres.theLangue = 'fr'; //obtenir depuis session
        parametres.thetxtAncienMotPasse = aAncienMotPasse;
        parametres.theNouveauMotPasse = aNouveauMotPasse
        parametres.theNouveauMotPasseConfirmation = aNouveauMotPasseConfirmation
        parametres.theIdentificateur = aLogin; //obtenir depuis session
        parametres.theTypeIdentificateur = TypeIdentificateur.login; //obtenir depuis session
        //Appel ajax
        $.ajax({
            type: "POST",
            url: "WebServices/eKPIAcces.asmx/RedefinirMotPasse",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(parametres),
            dataType: 'json'
        })
        .done(function (data) {
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
    });
});

function RemplirChamps() {
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
        $("[id$='tblNouveauMotPasse']").attr("style", "display:block");

    }
    else {
        $('[id$=tblNouveauMotPasse]').attr('style', 'display:block');
        $("[id$='tblNouveauMotPasse']").attr("style", "display:block");
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}