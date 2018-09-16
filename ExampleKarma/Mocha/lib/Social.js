

var promise = require('promise');
var request = require('request');

module.exports = {


	twitter_url:'https://api.twitter.com/1.1/search/tweets.json?q=',
	//'http://urls.api.twitter.com/1/urls/count.json?callback=?&url=',
	facebook_url:'http://graph.facebook.com',

	getTwitterCount:function (url) {
		var self = this;
		// Use the promise
		return new Promise(function (resolve,reject) {
			self.callApi(self.twitter_url + url).then(function (result) {
				resolve(result);
			});
		});

	},
	callApi: function (url) {
		
		return new Promise(function(resolve,reject){
			request(url,function(error,response,body){
				if(!error && response.statusCode == 200){
					resolve(JSON.parse(body));
				}else{
					reject(error);
				}
			});
		});
		
	},

	getJson:function(url,name,age){
		return new Promise(function (resolve,reject) {
			console.log('MI URL: '+url);
			request(url+name+age,function(error,response,body){
				if(!error && response.statusCode == 200){
					resolve(JSON.parse(body));
				}else{
					reject(error);
				}
			});
		});
	}

};