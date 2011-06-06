namespace('tux');

$(function() {
	
	tux.Account = Backbone.Model.extend({
		
		applyAmount: function(amt) {
			this.set({
				bal: parseInt(this.get('bal')) + parseInt(amt)
			}).save();
		}
		
	});
	
});