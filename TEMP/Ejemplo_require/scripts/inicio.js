define(['jquery-2.0.3'],function(jq){

		var run = function(){
			$(document).ready(function() {
			
			$('h1').css('color', 'red');
		});
		};
		return{run:run};
});