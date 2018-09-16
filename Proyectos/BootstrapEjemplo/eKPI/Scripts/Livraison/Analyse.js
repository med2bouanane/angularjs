angular.module('eKPI.Livraison.Analyse', [])
   .controller('AnalyseCtrl', function ($scope) {
       $scope.model = { test: 'Aaaaaaaa' };




   });

$(function () {
    var option = {
        lng: 'fr',
        cookieName: 'langue',
        ns: 'Analyse',
        resGetPath: 'Traductions/__ns__-__lng__.json'
    };

    i18n.init(option, function (t) {
        $(".Traduction").i18n();
        $("#lblTitreGlobal").val("lblTitreGlobal");
        $("#btnRechercher").val(i18n.t("btnRechercher"));
        //   $("#btnTest").val(i18n.t("btnTest"));
    });


});
