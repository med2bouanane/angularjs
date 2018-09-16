
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var promise = require('promise');
var Social = require('../lib/Social');
require('sinon-as-promised');

var chaiPromise = require('chai-as-promised');
chai.use(chaiPromise);

describe('Social',function(){

	var url = 'www.google.com';

	it('should have twitter_url',function () {
		expect(Social).to.have.property('twitter_url');
	});

	it('should have facebook_url',function () {
		expect(Social).to.have.property('facebook_url');
	});



	describe('#getTwitterCount',function(){
		
		it('should be a function',function(){
			expect(Social.getTwitterCount).to.be.a('function');
		});
		// Example of Spy
		it('should call callAPI',function(){
			sinon.spy(Social,'callApi');
			Social.getTwitterCount(url);
			expect(Social.callApi.withArgs(Social.twitter_url + url).calledOnce).to.be.equal(true,'bad args');
			expect(Social.callApi.calledOnce).to.be.true;

			Social.callApi.restore();
		});

		// Example Stub
		it('should return count',function(done){
			var stub = sinon.stub(Social,'callApi');
			
			// without sinon-as-promised 
			// stub.returns(new Promise(function (resolve,reject) {
			// 	resolve({count:3}); // this is our simulated json result, it is a fix result 
			// 						// although it is not true
			// }));

			//npm i sinon-as-promised --save-dev
			stub.resolves({count:3});

			Social.getTwitterCount(url).then(function(result){
				expect(result.count).to.be.equal(3);
				done();
			});

			// Using the chai-as-promised
			// expect(Social.getTwitterCount(url)).to.eventually.be.equal({count:3}).notify(done);
		});
	});

	var url2 = 'http://echo.jsontest.com/';
	var name = 'name/Mohamed/';
	var age = 'age/36';
	describe('#getJson',function () {
		it('should get a Json format',function (done) {
			sinon.spy(Social,'getJson');
			Social.getJson(url2,name,age).then(function (result) {
				expect(result.name).to.be.equal('Mohamed');	
				done();
			});
		});

		
	});

});




