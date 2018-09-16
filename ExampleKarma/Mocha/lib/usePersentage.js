var Persentage = require('../lib/Persentage')

//Persentage per = new Persentage();

var res = Persentage.evolution(100,50);

console.log('evolution(100,50)= '+res);

var callback = function(a){
			console.log(a * 2);
		};

Persentage.wait(1000,callback);


var callback2 = function(a){
			console.log(a);
		};

Persentage.call(10.34444,callback2);