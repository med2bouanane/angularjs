$(function () {
    $('#btnTest').click(function () {
        //Récuprération des informations introduites dans le filtre
        var aNombre1 = $('#cphContenu_txtNombre1').val();
        var aNombre2 = $('#cphContenu_txtNombre2').val();

        //Création de l'url avec les paramètres récupérés depuis le filtre
        var aUrl = "WebServices/eKPI.ashx?Mode=Test&A=" + aNombre1 + "&B=" + aNombre2;

        //Appel ajax
        $.ajax(aUrl).done(function (data) {
            $('#cphContenu_txtResultat').val(data);
        })
        .fail(function () {
            alert('Fail');
        });
    });
});