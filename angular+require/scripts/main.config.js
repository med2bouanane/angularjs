/**
 * Created by Mohamed on 22/03/14.
 */
require.config({

    paths:{// Definimos los alias de las librerias
        jquery:'libs/jquery-2.0.3',
        //knockout:'libs/knockout-2.3.0',
        angular:'libs/angular.min'//'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular.min'
    },

    shim:{
        'angular':{
            exports:'angular'
        }
    },

    baseUrl:'scripts'
});

//require se usa para el script de inicialización, en los demás se usa Define

//Scripts principales son: el main.js para JQuery, y MainCtr.js para angular
require(['main','controllers/MainCtr','angular'],function(main){

    // este callback se dispara cuando main.js MainCtr.js estén cargados, y tambien sus dependencias.

    // cuando esté cargado llamo al metodo init
    main.init();
});