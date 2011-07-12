namespace('tux.accounts');

(function() {
	'use strict';
	
	tux.accounts.Account = Backbone.Model.extend({
		
		// model defaults
		defaults: {
			balance: 0
		},
		
		// adjust balance by given amount
		adjustBalance: function (amount) {
			this.set({
				balance: this.get('balance') + amount
			}).save();
		},
		
		// validate model
		validate: function (attrs) {
			if (typeof attrs.balance !== 'number') {
				return 'balance must be a number';
			}
		}
		
	});
	
}());
