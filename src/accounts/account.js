namespace('tux.accounts');

// account model
tux.accounts.Account = (function() {
	"use strict";
	
	// model defaults
	var defaults = {
			balance: 0
	};
	
	// adjust the balance by amount
	// TODO allow strict + function declaration + this value
	function adjustBalance(amount) {
		this.set({
			balance: this.get('balance') + amount
		});
	}
	
	// validation
	function validate(attrs) {
		if (typeof attrs.balance !== 'number') {
			return 'balance must be a number';
		}
	}
	
	// build model api
	return Backbone.Model.extend({
		defaults: defaults,
		adjustBalance: adjustBalance,
		validate: validate
	});
}());
