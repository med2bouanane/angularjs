//defino el módulo main con sus dependencias

define(['jquery','knockout','modelo_persona'],function($,ko,persona)
{

	var init=function()
	{

		$(document).ready(inicio);
	};
		

	var inicio = function()
	{
		
		$('h1').css('color', 'yellow');

			var p = new persona.persona();

			ko.applyBindings(p);	
	};

	
		return{init:init};
	
});

