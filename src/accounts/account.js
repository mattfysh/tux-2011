namespace('tux.accounts');

// account model
tux.accounts.Account = Backbone.Model.extend({
	
	defaults: {
		balance: 0
	},
	
	adjustBalance: function(amount) {
		this.set({
			balance: this.get('balance') + amount
		});
	}
	
});