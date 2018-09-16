angular.module('directivaSimple',[])

.controller('Controlador1', [ '$scope',function($scope){
	$scope.texto1 ={titulo:'Controlador',subtitulo:'1'};
	$scope.texto2 ={titulo:'Controlador2',subtitulo:'2'};
}])

/*
.controller('Controlador2', [ '$scope',function($scope){
	$scope.texto ={titulo:'Controlador',subtitulo:'2'};
}])
*/

.directive('miEncabezado',function(){
	//incrustar directamente el html
	return {
		restrict:'E', // la directiva es un tag
		template:'<div class="page-header"><h1> {{textoVariable.titulo}} <small>{{textoVariable.subtitulo}}</small></h1></div>',
		scope:{
			textoVariable:'=texto' // texto es un atributo del tag 'mi-encabezado'
		}
	}

	//html externo
	//return {
	//	restrict:'A',// por defecto es A para ser elemento tag 'E'
	//	templateUrl:'mi-encabezado.html'
	//}
})