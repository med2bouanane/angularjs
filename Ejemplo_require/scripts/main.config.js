//alert("Hola script");

//Este config es para usar la libreria jQuery y librerias extensas
//como knockout ...
require.config({

	paths:{ // Definimos los alias de las librerias
			jquery:'libs/jquery-2.0.3',
			knockout:'libs/knockout-2.3.0',
            angular:'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular.min'
		   },

    shim:{
        'angular':{
            exports:'angular'
        }
    },

    baseUrl:'scripts'
});

//Así es como se hace el require con mis scripts propios
//para su modularización
//require se usa para el script de inicialización, en los demás se usa Define
//El script principal es el main.js

require(['main','controller'],function(main){
    // este callback se dispara cuando main.js esté cargado, pero no
    // solo main.js, sino tambien sus dependencias.

    // cuando esté cargado llamo al metodo init
	main.init();
});
