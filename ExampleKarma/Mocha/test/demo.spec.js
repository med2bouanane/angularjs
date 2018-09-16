var assert = require('assert');


describe('Title of my test',function(){

	it('should do something',function(){
		var a = 3;
		assert.equal(a * 2,6,'bad operation');
	});
});