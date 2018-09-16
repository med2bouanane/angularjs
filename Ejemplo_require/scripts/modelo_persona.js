define(['knockout'],function(ko){

	var persona = function(){

		this.Nombre=ko.observable();
		this.Apellido=ko.observable();
	};


	return {persona:persona};

});