namespace('tux.accounts');

// account model
tux.accounts.Account = Backbone.Model.extend({
	
	defaults: {
		balance: 0
	},
	
	adjustBalance: function(amount) {
		// manually adjust balance to bypass validation
		this.attributes.balance = this.get('balance') + amount;
	},
	
	validate: function(attrs) {
		if (attrs.balance) return 'cannot set balance post-creation';
	}
	
});