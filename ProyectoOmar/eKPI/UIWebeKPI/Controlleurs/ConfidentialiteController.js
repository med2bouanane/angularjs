//angular.module('ConfidentialiteController', ['ngRoute'])

app.controller('ConfidentialiteController', function ($scope) {

        var option = {
            lng: $("#ddlLangue").val(),
            cookieName: 'langue',
            resGetPath: 'Traduction/__ns__-__lng__.json'
        };
        i18n.init(option, function (t) {
            $(".Traduction").i18n();
            $("#lblTitreGlobal").text(i18n.t("lblTitreGlobal"));
            $("#lblTexteConfidencialite").text(i18n.t("lblTexteConfidencialite"));
        });
        $("#ddlLangue").change(function () {
            i18n.setLng($("#ddlLangue").val(), function (t) {
                $(".Traduction").i18n();
                $("#lblTitreGlobal").text(i18n.t("lblTitreGlobal"));
                $("#lblTexteConfidencialite").text(i18n.t("lblTexteConfidencialite"));
            });
        });
});