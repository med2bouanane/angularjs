angular.module('ContactController', ['ngDialog', 'angularFileUpload'])
.controller("contactController", ['$scope', '$http', 'ngDialog', '$location', '$translate', '$filter', '$upload', function ($scope, $http, ngDialog, $location, $translate, $filter, $upload) {
    
    
    $scope.files = [];
    if (($location.absUrl()).indexOf('/es/') > -1) {
        $translate.use('es');
        $scope.language = 'es';
    }
    else if (($location.absUrl()).indexOf('/ca/') > -1)
    {
        $translate.use('ca');
        $scope.checked_ca = true;
        $scope.language = 'ca';
    }
    else if (($location.absUrl()).indexOf('/en/') > -1) {
        $translate.use('en');
        $scope.checked_en = true;
        $scope.language = 'en';
    }
    else if (($location.absUrl()).indexOf('/fr/') > -1) {
        $translate.use('fr');
        $scope.checked_fr = true;
        $scope.language = 'fr';
    }
    else if (($location.absUrl()).indexOf('/gl/') > -1) {
        $translate.use('gl');
        $scope.checked_gl = true;
        $scope.language = 'gl';
    }
    else if (($location.absUrl()).indexOf('/it/') > -1) {
        $translate.use('it');
        $scope.checked_it = true;
        $scope.language = 'it';
    }
    else if (($location.absUrl()).indexOf('/nl/') > -1) {
        $translate.use('nl');
        $scope.checked_nl = true;
        $scope.language = 'nl';
    }
    else if (($location.absUrl()).indexOf('/pt/') > -1) {
        $translate.use('pt');
        $scope.checked_pt = true;
        $scope.language = 'pt';
    }
    else if (($location.absUrl()).indexOf('/ro/') > -1) {
        $translate.use('ro');
        $scope.checked_ro = true;
        $scope.language = 'ro';
    }
    else if (($location.absUrl()).indexOf('/ru/') > -1) {
        $translate.use('ru');
        $scope.checked_ru = true;
        $scope.language = 'ru';
    }
    else if (($location.absUrl()).indexOf('/de/') > -1) {
        $translate.use('de');
        $scope.checked_de = true;
        $scope.language = 'de';
    }


    $scope.gmail = '';
    $scope.hello = hello;
    //$scope._ = _;
    $scope.contacts = [];
    $scope.order = 'name';
    //$scope.max = 200;
    //$scope.$on('LOAD', function () { $scope.loading = true; });
    //$scope.$on('UNLOAD', function () { $scope.loading = false; });

    $scope.init = function (gmail, hotmail, yahoo) {
        hello.init({
            windows: hotmail,
            google: gmail,//Local  "1084550066140-sde0t3chrh0hia0tdcpn5bvocgg1btal.apps.googleusercontent.com",
            yahoo: yahoo,
        }
           , {
               redirect_uri: '../',//redirectYahoo',//
               oauth_proxy: 'https://auth-server.herokuapp.com/proxy',
               scope: "friends"
           }
    );
    };

    $scope.addContactManually = function () {

        $("#msg-error-contact").css("display", "none");

        if ($scope.nameContact &&
            //$scope.surnameContact &&
            $scope.emailContact)
        {
            //var elems = $scope.contacts.filter(function (obj) {
            //    return (obj["email"] === $scope.emailContact);
            //});

            //if (elems.length === 0) {
            //    $(".contacts .panel-body").css("display", "none");
            var obj = { email: $("#emailContact").val() };
            if (_.where($scope.contacts, obj).length <= 0) {
                $(".contacts .panel-body").css("display", "none");
                $scope.contacts.push
                ({
                    name: $scope.nameContact,
                    //surname: $scope.surnameContact,
                    email: $scope.emailContact,
                    //image: '/Images/Icons/gmail.png',
                    pos: $scope.contacts.length
                });

                if ($scope.contacts.length > 0) {
                    $("#msg-error-agregar").css("display", "none");
                }

                $scope.nameContact = '';
                //$scope.surnameContact = '';
                $scope.emailContact = '';

                $scope.error8 = '';
                $("#emailContact").removeClass("validation-error-input");

                $scope.error6 = '';
                $("#namecontact").removeClass("validation-error-input");
            }
            else
            {
                $scope.error8 = 'DUPLICATECONTACT';//"Un contacto con el mismo email ya ha sido agregado.";
                $("#msg-error-contact").css("display", "block");
                $("#msg-error-emailcontact").css("display", "block");
                $("#emailContact").addClass("validation-error-input");
            }
        }
        else 
        {
            if (!$scope.nameContact) {
                $scope.error6 = 'REQUIRED';//"El campo nombre del destinatario es obligatorio.";
                $("#msg-error-contact").css("display", "block");

                $("#msg-error-namecontact").css("display", "block");
                $("#namecontact").addClass("validation-error-input");
            }
            else
            {
                $scope.error6 = '';
                $("#namecontact").removeClass("validation-error-input");
            }

            //if (!$scope.surnameContact) {
            //    $scope.error7 = "El campo apellidos del destinatario es obligatorio.";
            //    $("#msg-error-contact").css("display", "block");

            //    $("#msg-error-surnamecontact").css("display", "block");
            //    $("#surnamecontact").css("border-color", "#d3222a");
            //}
            //else {
            //    $scope.error7 = '';
            //    $("#surnamecontact").css("border-color", "#e6ecf0");
            //}

            //Comprueba que el formato del email sea correcto y que no sea vacío.
            if (($("#emailContact").val()).length <= 0) {
                $scope.error8 = 'REQUIRED';//"El campo email del destinatario es obligatorio.";
                $("#msg-error-contact").css("display", "block");

                $("#msg-error-emailcontact").css("display", "block");
                $("#emailContact").addClass("validation-error-input");
            }
            else if (errorEmail($("#emailContact").val()))
            {
                $scope.error8 = 'EMAILFORMAT';//"El formato del campo email del destinatario no es correcto.";
                $("#msg-error-contact").css("display", "block");

                $("#msg-error-emailcontact").css("display", "block");
                $("#emailContact").addClass("validation-error-input");
            }
            else {
                $scope.error8 = '';
                $("#emailContact").removeClass("validation-error-input");
            }
        }
    };

    $scope.openDialog = function (pos) {
        var result = confirm($filter('translate')('CONFIRMDELETE'));
        if (result == true) {
            $scope.deleteContact(pos);
        }
    }

    $scope.openDialogLegalConditions = function () {
        $("#legalconditions-container").fadeIn(1000);
    }

    $scope.closeLegalConditions = function () {
        $("#legalconditions-container").fadeOut(1000);
    }

    $scope.deleteContact = function (pos) {

        $scope.contacts.splice(pos, 1);

        if($scope.contacts.length === 0)
        {
            $(".contacts .panel-body").css("display", "block");
        }
    };

    //////////////////////////
    function getInternetExplorerVersion() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    }
    function checkVersion() {
        var msg = "You're not using Windows Internet Explorer.";
        var ver = getInternetExplorerVersion();
        if (ver > -1) {
            if (ver >= 8.0)
                msg = "You're using a recent copy of Windows Internet Explorer."
            else
                msg = "You should upgrade your copy of Windows Internet Explorer.";
        }
        alert(msg);
    }

    ///////////////////////

    $scope.submitContacts2 = function ()
    {
        $("#canvasloader-container").text("Enviando ...");
        $("#AnimateSend").css("height","41px");
        
        var cl = new CanvasLoader('canvasloader-container');
        cl.setDiameter(26);
        cl.setColor('#ffffff');
        
        cl.show();
        $("#canvasloader-container>div").addClass('prog');

        //$("#canvasloader-container>div").css('position', 'relative');
        //$("#canvasloader-container>div").css('left', '-80%');
        //$("#canvasloader-container>div").css('bottom', '27px');

        var ver = getInternetExplorerVersion();
        if (ver > -1) {
            if (ver > 8.0)
            { $("#canvasloader-container>div").addClass('prog'); alert(">IE8"); }
            else
            { $("#canvasloader-container>div").addClass('prog-ie8'); alert("<IE8"); }
        }

        //var inc = 1;
        //$("#spanLoad").text("Enviando ");
        //var timer = setInterval(function () { myTimer() }, 500);
        //function myTimer() {
        //    var text = $("#spanLoad").text();
            
        //    if(text === 'Enviando ')
        //        $("#spanLoad").text("Enviando .");
        //    else if (text === 'Enviando .' && inc)
        //        $("#spanLoad").text("Enviando ..");
        //    else if (text === 'Enviando ..' && inc)
        //        $("#spanLoad").text("Enviando ...");
        //    else if (text === 'Enviando ...')
        //    {
        //        $("#spanLoad").text("Enviando ..");
        //        inc = 0;
        //    }
        //    else if (text === 'Enviando ..' && !inc)
        //    {
        //        $("#spanLoad").text("Enviando .");
        //    }
        //    else if (text === 'Enviando .' && !inc) {
        //        $("#spanLoad").text("Enviando ");
        //        inc = 1;
        //    }
            
        //}

        //var timer2 = setInterval(function () { myTimer2() }, 2000);
        //function myTimer2() {
        //    $("#spanIcon").removeClass("glyphicon glyphicon-repeat");
        //    $("#spanIcon").addClass("glyphicon glyphicon-refresh pull-left");
            
        //}
    }

    $scope.submitContacts = function ()
    {
        $("#msg-error-user").css("display", "none");
        $("#msg-error-contact").css("display", "none");
        $("#msg-error-condiciones").css("display", "none");

        $("#AnimateSend").val("Enviando ...");
        setTimeout(function () {
            //do what you need here
            $("#AnimateSend").val("Enviar");
        }, 2000);
        $("#AnimateSend").val("Enviando ...");
        if ($scope.nameUser &&
            //$scope.surnameUser &&
            $scope.emailUser &&
            $scope.contacts.length > 0 &&
            $scope.acceptLegalConditions) {

            var url = "Create";
            $http.post(url, {
                contacts: $scope.contacts,
                nameUser: $scope.nameUser,
                //surnameUser: $scope.surnameUser,
                emailUser: $scope.emailUser
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, headers, config) {

                if (JSON.parse(data) === "Error") {
                    $scope.error10 = 'SENDINGERROR';//"No se ha podido enviar la felicitación.";
                    $("#msg-error-user").css("display", "block");

                    $("#AnimateSend").val("Enviar");
                }
                else {
                    $("#AnimateSend").val("Enviar");
                    var res = JSON.parse(data).split("&");
                    window.location.href = "VerifySenderAddress?email=" + res[0] + "&sendingIdentifier=" + res[1] +"&language=" + $scope.language;
                }
            })
            .error(function (data, status, headers, config) {
                $scope.error10 = 'SENDINGERROR';//"No se ha podido enviar la felicitación.";
                $("#msg-error-user").css("display", "block");

            });
        }
        else {
            $("#AnimateSend").val("Enviando ...");
            //Vuelve al principio de la página para ver los errores
            $('html, body').animate({ scrollTop: 0 }, 0);

            if (!$scope.nameUser) {
                $scope.error1 = 'REQUIRED';//"El campo nombre es obligatorio.";
                $("#msg-error-user").css("display", "block");
                $("#msg-error-nameuser").css("display", "block");
                $("#msg-error-nameuser").css("display", "block");
                $("#input-error-nameuser").addClass("validation-error-input");
            }
            else {
                $scope.error1 = '';
                $("#input-error-nameuser").removeClass("validation-error-input");
            }

            //if (!$scope.surnameUser) {
            //    $scope.error2 = "El campo apellido es obligatorio.";
            //    $("#msg-error-user").css("display", "block");
            //    $("#msg-error-surnameuser").css("display", "block");
            //    $("#input-error-surnameuser").css("border-color", "#d3222a");
            //}
            //else {
            //    $scope.error2 = '';
            //    $("#input-error-surnameuser").css("border-color", "#e6ecf0");
            //}

            //Comprueba que el formato del email sea correcto y que no sea vacío.
            if (($("#emailUser").val()).length <= 0) {//($scope.contactsForm.emailUser.$error.required) {

                $scope.error3 = 'REQUIRED';//"El campo email es obligatorio.";
                $("#msg-error-user").css("display", "block");
                $("#msg-error-emailuser").css("display", "block");
                $("#emailUser").addClass("validation-error-input");
            }
            else if (errorEmail($("#emailUser").val())) {
                $scope.error3 = 'EMAILFORMAT';// "El formato del campo email no es correcto.";
                $("#msg-error-user").css("display", "block");
                $("#msg-error-emailuser").css("display", "block");
                $("#emailUser").addClass("validation-error-input");
            }
            else {
                $scope.error3 = '';
                $("#emailUser").removeClass("validation-error-input");
            }
            
            if ($scope.contacts.length === 0) {
                $scope.error4 = 'NONECONTACT';//"No se ha agregado ningún contacto.";
                $("#msg-error-user").css("display", "block");

                $scope.error4 = 'NONECONTACT'; //"No se ha agregado ningún contacto.";
                $("#msg-error-agregar").css("display", "block");
            }
            else {
                $scope.error4 = '';
            }

            if (!$scope.acceptLegalConditions)
            {
                $scope.error5 = 'REQUIRED';//"La aceptación de las condiciones legales es un campo obligatorio.";
                $("#msg-error-condiciones").css("display", "block");

                $("#msg-error-condiciones").css("display", "block");
                $("#checkValidacion").addClass("validation-error-input");
            }
            else {
                $scope.error5 = '';
                $("#checkValidacion").removeClass("validation-error-input");
            }
        }
        
    };

    $scope.deleteAllContacts = function () {
        var result = confirm($filter('translate')('CONFIRMDELETEALL'));
        if (result == true) {
            $scope.contacts = [];
        }
        
    }

    $scope.submitOutlook = function () {

        //$scope.$emit('LOAD');
        //var time = 2;
        //var timer = setInterval(function () { if (time < 95) { time = time + 2;$("#progress").css("width", time + "%"); } }, 500);
        $http.post("Outlook",
                    { name: $scope.userOutlook, pass: $scope.passOutlook },
                    { headers: { 'Content-Type': 'application/json' } })
            .success(function (data, status, headers, config) {
                    $http.get("datos").
                      success(function (data, status, headers, config) {
                          $scope.datos = data;
                          if (data[0].Name === 'ERROR')
                          {
                              $scope.erroroutlook = 'LOGINERROR';//"Usuario o contraseña incorrectos.";
                              $("#msg-error-outlook").css("display", "block");
                              $("#outlookuser").addClass("validation-error-input");
                              $("#outlookpass").addClass("validation-error-input");
                              //clearInterval(timer);
                              //$scope.$emit('UNLOAD');
                          }  
                          else
                          {
                              
                              $scope.erroroutlook = '';
                              $("#outlookuser").removeClass("validation-error-input");
                              $("#outlookpass").removeClass("validation-error-input");

                              for (var index = 0; index < data.length; index++)
                              {
                                  var obj = { email: data[index].Email };
                                  //console.log('image['+i+'] '+o.thumbnail);
                                  if (_.where($scope.contacts, obj).length <= 0)
                                  {
                                      var i = 30 + index;
                                      $scope.contacts.push
                                    ({
                                        name: data[index].Name,
                                        surname: '',
                                        email: data[index].Email,
                                        //image: '/Images/Icons/gmail.png',
                                        pos: $scope.contacts.length
                                    });
                                  }
                              }

                              if ($scope.contacts.length > 0)
                              {
                                  $("#msg-error-agregar").css("display", "none");
                              }
                          }
                          //$("#progress").css("width", "100%");
                          //clearInterval(timer);
                          //$scope.$emit('UNLOAD');
                          //$("#progress").css("width", "2%");
                      }).
                      error(function (data, status, headers, config) {
                          alert("ERROR");
                      });

            })
            .error(function (data, status, headers, config) {
            });

        //$scope.contacts = [];
    };

    //function successFunction() {
    //    alert($('#my_iframe').contents().find('p').html());
    //}
    //$scope.uploadFile = function () {
    //    //debugger;
    //    document.getElementById('my_form').target = 'my_iframe'; //'my_iframe' is the name of the iframe
    //    //document.getElementById('my_form').submit();
    //    var callback = function () {
    //        if (successFunction)
    //            successFunction();
    //        else
    //            alert("ERROR");
    //        $('#frame').unbind('load', callback);
    //    };

    //    $('#my_iframe').bind('load', callback);
    //    $('#hfParam').val('id:1');

    //    $('#my_form').submit();
    //    //$("#my_form").trigger("submit");

    //};


    $scope.uploadFile = function () {
        //var x = document.getElementById("uploadBtn").value;
        //var split = x.split("\\");
        //alert(split[0]);
        //alert(split[1]);
        //alert(split[split.length-1]);

        //var file = $scope.myFile;//split[split.length - 1];//
        //var uploadUrl = "LoadContactsFromCSV";
        //$scope.uploadFileToUrl(uploadUrl); //(file, uploadUrl);



        if ($scope.files.length <= 0) {
            $scope.csvError = 'Se ha producido un error al cargar los contactos desde el fichero, por favor asegurese de que el formato sea el correcto.';
            $("#msg-error-csv").css("display", "block");
        }

        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $scope.files.length; i++) {
            var file = $scope.files[i];
            $scope.upload = $upload.upload({
                url: 'LoadContactsFromCSV', //upload.php script, node.js route, or servlet url
                //method: 'POST' or 'PUT',
                //headers: {'header-key': 'header-value'},
                //withCredentials: true,
                data: { myObj: $scope.myModelObj },
                file: file, // or list of files ($files) for html5 only
                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                // customize file formData name ('Content-Disposition'), server side file variable name. 
                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
            }).progress(function (evt) {
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                //console.log(data);
                //alert(data);
                if (JSON.parse(data) === "Error") {
                    $scope.csvError = 'Se ha producido un error al cargar los contactos desde el fichero, por favor asegurese de que el formato sea el correcto.';
                    $("#msg-error-csv").css("display", "block");
                }
                if (JSON.parse(data) === "Empty") {
                    $scope.csvError = 'No se ha cargado ningun fichero de contactos.';
                    $("#msg-error-csv").css("display", "block");
                }
                else {
                    $scope.addContactFromCSV(JSON.parse(data));
                }
            });
            //.error(...)
            //.then(success, error, progress); 
            // access or attach event listeners to the underlying XMLHttpRequest.
            //.xhr(function(xhr){xhr.upload.addEventListener(...)})
        }
        /* alternative way of uploading, send the file binary with the file's content-type.
           Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
           It could also be used to monitor the progress of a normal http post/put request with large data*/
        // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.


    };

    $scope.uploadFileToUrl = function (uploadUrl) {//(file, uploadUrl) {
        //var fd = new FormData();
        //fd.append('file', file);
        $http.post(uploadUrl, {//,fd,
            //transformRequest: angular.identity,
            id:1,
            headers: { 'Content-Type': 'application/vnd.ms-excel'}//undefined }// 
        })
        .success(function (data, status, headers, config) {
            if (JSON.parse(data) === "Error") {
                $scope.csvError = 'Se ha producido un error al cargar los contactos desde el fichero, por favor asegurese de que el formato sea el correcto.';
                $("#msg-error-csv").css("display", "block");
            }
            if (JSON.parse(data) === "Empty") {
                $scope.csvError = 'No se ha cargado ningun fichero de contactos.';
                $("#msg-error-csv").css("display", "block");
            }
            else {
                $scope.addContactFromCSV(JSON.parse(data));
            }
        })
        .error(function (data, status, headers, config) {
            $scope.csvError = 'Se ha producido un error al cargar los contactos desde el fichero, por favor asegurese de que el formato sea el correcto.';
            $("#msg-error-csv").css("display", "block");
        });
    };

    $scope.addContactFromCSV = function (data) {

        if (data != null) {
            $("#msg-error-csv").css("display", "none");

            $scope.nameCampaign = $("#listcamp-contact option:selected").text();
            $scope.nameStorage = $("#liststorage-contact option:selected").text();

            var listContacts = angular.fromJson(data);



            angular.forEach(listContacts, function (key, value) {

                //var elems = $scope.contacts.filter(function (obj) {
                //    return (obj["email"] === key["RowKey"]);
                //});
                var obj = { email: key["RowKey"] };
                if (_.where($scope.contacts, obj).length <= 0) {

                    $scope.contacts.push
                    ({
                        name: key["Name"],
                        surname: '',
                        email: key["RowKey"],
                        //image: imagen,
                        pos: $scope.contacts.length
                    });

                    if ($scope.contacts.length > 0) {
                        $("#msg-error-agregar").css("display", "none");
                    }
                }
                //else {
                //    //console.log("ERROR CSV")
                //}
            });

            //$scope.pos++;
        }
        else if ($scope.nameContact == '') {
            $scope.error = ' Nombre ';
            $("#msg-error").css("display", "block");
        }
        else if ($scope.emailContact == '') {
            $scope.error = ' Correo ';
            $("#msg-error").css("display", "block");
        }
        else if ($scope.emailContact.split('@') == $scope.emailContact) {
            $scope.emailError = ' formato del correo incorrecto';
            $("#msg-error").css("display", "block");
        }
    };


    //////// Mailing ////////

    

    $scope.getFriends = function (network, path) {

        // login (display:'page',scope: 'friends', response_type: 'code' )
        hello.login(network, { scope: 'friends' }, function (auth) {
            if (!auth || auth.error) {
                //console.log("Signin aborted " + auth);
                return;
            };

            // Get the friends
            // using path, me/friends or me/contacts
            hello(network).api(path, function responseHandler(r) {

                $scope.$apply(function () {

                    for (var i = 0; i < r.data.length; i++)
                    {
                        var o = r.data[i];
                        var obj = { email: o.email };
                        //console.log('image['+i+'] '+o.thumbnail);
                        if (o.email !== undefined && _.where($scope.contacts, obj).length <=0)
                        {
                            //var imagen = o.thumbnail?o.thumbnail:'/Images/Icons/gmail.png';
                            $scope.contacts.push
                            ({
                                name: o.name,
                                surname: '',
                                email: o.email,
                                //image: imagen,
                                pos: $scope.contacts.length
                            });

                            if ($scope.contacts.length > 0) {
                                $("#msg-error-agregar").css("display", "none");
                            }
                        }

                    }

                    
                });
                

            });
        });
    };

    /*
    if ($scope.contacts.length > 0)
    $scope.contactsAdded = $scope.contacts.length; 
    else
        $scope.contactsAdded = 'dddddNo se ha agregado ningún contacto' + $scope.contacts.length;
    */

    var errorEmail = function (email) {
        var error = false;
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!expr.test(email))
            error = true;//Hay Error
        return error;
    }










    $scope.onFileSelect = function ($files) {

        $scope.files = $files;


        //var x = document.getElementById("uploadBtn").value;
        //alert($files[0].name);
        //var split = x.split("\\");
        //alert(split[split.length - 1]);
        document.getElementById("uploadFile").value = $files[0].name;//split[split.length - 1];
        
    };
}]);

