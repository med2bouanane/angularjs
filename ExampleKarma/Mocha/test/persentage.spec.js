
var assert = require('assert'); // import node's asserts
var assertChai = require('chai').assert; // import chai's asserts
var should = require('chai').should(); //import chi's should 
									 //actually call the function
var expect = require('chai').expect;

var Persentage = require('../lib/Persentage')

describe('Persentage',function(){

	describe('#evolution',function(){

		it('should give an evolution',function(){

			assert.equal(Persentage.evolution(100,200),100);
			assert.equal(Persentage.evolution(100,150),50);
			assert.equal(Persentage.evolution(100,50),-50);
			// test with the should interface of chai
			Persentage.evolution(100,20).should.be.equal(-80);
		});

		it('should handle 0 evolution',function(){
			assert.equal(Persentage.evolution(0,100),Infinity);
		});
		it('should round value',function(){
			assert.equal(Persentage.evolution(30,100),233.33);
		});
	});
});


describe('#wait',function(){

	it('should exit',function(){
		// node's assert
		//assert.notEqual(Persentage.wait,undefined);

		//chai's assert
		//assertChai.isFunction(Persentage.wait);

		//chai's expect
		expect(Persentage.wait).to.be.a('function');
	});
	//Test asynchrone code, add done() 
	// for waiting the callback function, then it complete the test
	it('should wait 300 ms',function(done){
		Persentage.wait(300,function(test){
			assert.equal(test,18);
			done();
		});
	});
});


// the difernt methods of a test
describe('#Methods',function(){

	before(function () {
		// body...
	});

	beforeEach(function () {
		// body...
	});
	after(function () {
		// body...
	});
	afterEach(function () {
		// body...
	});

/*
	it.only('test only this test',function(){
			assert.equal(12,12);
	});
*/
	it('TODO this test is pending to do');

	it.skip('skip this test, is pending',function(){
			assert.equal(12,12);
	});
});




