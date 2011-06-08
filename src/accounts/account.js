namespace('tux.accounts');

// account model
tux.accounts.Account = Backbone.Model.extend({
	
	defaults: {
		balance: 0
	},
	
	adjustBalance: function(amount) {
		// temporarily disable the validator to allow the balance update
		var valFn = this.validate;
		this.validate = noop;
		this.set({
			balance: this.get('balance') + amount
		});
		this.validate = valFn;
	},
	
	validate: function(attrs) {
		if (attrs.balance) return 'cannot set balance post-creation';
	}
	
});