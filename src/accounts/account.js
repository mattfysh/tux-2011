namespace('tux.accounts');

// account model
tux.accounts.Account = (function() {
	'use strict';
	
	// model defaults
	var defaults = {
			balance: 0
	},
	
	// adjust the balance by amount
	adjustBalance = function (amount) {
		this.set({
			balance: this.get('balance') + amount
		});
	},
	
	// validation
	validate = function (attrs) {
		if (typeof attrs.balance !== 'number') {
			return 'balance must be a number';
		}
	};
	
	// define model api
	return Backbone.Model.extend({
		defaults: defaults,
		adjustBalance: adjustBalance,
		validate: validate
	});
	
}());
