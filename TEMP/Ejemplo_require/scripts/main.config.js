//alert("Hola script");

//Este config es para usar la libreria jQuery y librerias extensas
//como knockout ...
require.config({

	baseUrl:'scripts',
	paths:{
			jquery:'libs/jquery-2.0.3',
			knockout:'libs/knockout-2.3.0'
		   }
});

//Así es como se hace el require con mis scripts propios
//para su modularización
//require se usa para el script de inicialización, en los demás se usa Define
require(['main'],function(main){
	main.init();
});
