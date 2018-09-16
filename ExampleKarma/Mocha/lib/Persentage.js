module.exports ={

	evolution : function(a,b){
		//return Math.round(10000 * (b-a)/a)/100;
		return this.round(100 * (b-a)/a);
	},
	round:function(value){
		return Math.round(100*value)/100;
	},
	wait: function (time,callback) {
		setTimeout(function () {
			callback(18);
		},time)
	},
	call: function(value,callback){
		callback(this.round(value));
	}
}