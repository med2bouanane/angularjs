var Social = require('../lib/Social');

var url = 'http://echo.jsontest.com/';
var name = 'name/Mohamed/';
var age = 'age/36';

// var promise =Social.getJson(url,name,age);

// promise.then(function (result) {
// 	console.log(result);
// })
// .catch(function (error) {
// 	console.log(error);
// });


var promiseTwitter = Social.getTwitterCount('');


promiseTwitter.then(function (result) {
	console.log(result);

}).catch(function (error) {
	console.log(error);
});