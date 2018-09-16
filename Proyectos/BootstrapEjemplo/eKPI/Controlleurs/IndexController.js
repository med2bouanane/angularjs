angular.module('IndexController', ['eKPI.Utilisateur.ServiceUtilisateur'])
.controller('IndexController', ['$scope', '$http', 'GestionUtilisateur', function ($scope, $http, GestionUtilisateur) {

//    var option = {
//        lng: $("#ddlLangue").val(),
//        cookieName: 'langue',
//        resGetPath: 'Traductions/__ns__-__lng__.json'
//    };

//    i18n.init(option, function (t) {
//        $(".Traduction").i18n();
//    });

//    $("#ddlLangue").change(function () {
//        i18n.setLng($("#ddlLangue").val(), function (t) {
//            $(".Traduction").i18n();
//        });
//    });

        $scope.idioma= $("#ddlLangue option:eq(1)").val();
    //var aLangue = $('#ddlLangue option:selected').val();

    var EnumStatus = {
        Succes: 0,
        NoSucces: 1,
        Erreur: 2
    }

    $scope.identifiant = { login: '', motPasse: '' };
    $scope.connecterUtilisateur = function () {
        console.log('hi');
        GestionUtilisateur.ConnecterUtilisateur($scope.identifiant.login, $scope.identifiant.motPasse)
        .then(function (reponse) {
            console.log(reponse);
            if (reponse.succes == EnumStatus.Succes) {
                console.log('Succes');
                //$location.path('/Acceuil');
            }
            else {
                if (reponse.succes == EnumStatus.NoSucces) {
                    $scope.FailureText = reponse.message; //clé  
                }
                else {
                    $scope.FailureText = reponse.message; //message
                }
            }
        },
        function (reponse) {
            console.log(reponse);
        });

    };
} ]);