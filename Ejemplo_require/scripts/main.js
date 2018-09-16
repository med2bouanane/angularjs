//defino el módulo main con sus dependencias

define(['jquery','inicio'],function($,inicio)
{

	var init=function()
	{

		$(document).ready(inicio.ready());
	};

	return{
        init:init
    };
	
});

